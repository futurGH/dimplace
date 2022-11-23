import * as t from "typed";

const institutionListValidator = t.object({
	entities: t.array(
		t.object({
			class: t.array(t.string()),
			properties: t.object({ name: t.string() }),
			links: t.array(t.object({ rel: t.array(t.string()), href: t.string() })),
		}),
	),
});

export type InstitutionList = Array<{ name: string; links: { self?: string; lms?: string } }>;
export async function getInstitutionList(contains: string = ""): Promise<InstitutionList> {
	const response = await fetch(
		`https://lms-disco.api.brightspace.com/institutions`
			+ (contains ? `?contains=${contains}` : ""),
		{ method: "GET" },
	);
	if (!response.ok) {
		return [];
	}
	try {
		const result = await response.json();
		const parsedResult = t.unwrap(institutionListValidator(result));
		return parsedResult.entities.map((entity) => ({
			name: entity.properties.name,
			links: {
				self: entity.links.find((link) => link.rel.includes("self"))?.href,
				lms: entity.links.find((link) => link.rel.includes("lms"))?.href,
			},
		}));
	} catch (e) {
		return [];
	}
}

const institutionInfoValidator = t.object({
	tenantId: t.string(),
	domain: t.string(),
	"_links": t.object({ "self": t.object({ "href": t.string() }) }),
});

export type InstitutionInfo = t.Infer<typeof institutionInfoValidator>;
export async function getInstitutionInfo(lmsDomain: string): Promise<InstitutionInfo | null> {
	const response = await fetch(
		`https://landlord.brightspace.com/v1/tenants?domain=${lmsDomain}`,
		{ method: "GET" },
	);
	if (!response.ok) {
		return null;
	}
	try {
		const result = await response.json();
		return t.unwrap(institutionInfoValidator(result[0]));
	} catch (e) {
		return null;
	}
}
