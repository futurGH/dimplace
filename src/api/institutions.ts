import { s } from "@sapphire/shapeshift";

const institutionListValidator = s.object({
	entities: s.array(
		s.object({
			class: s.string.array,
			properties: s.object({ name: s.string }),
			links: s.array(s.object({ rel: s.array(s.string), href: s.string })),
		}),
	),
});

export async function getInstitutionList(contains: string = "") {
	const response = await fetch(
		`https://lms-disco.api.brightspace.com/institutions`
			+ (contains ? `?contains=${contains}` : ""),
		{ method: "GET" },
	);
	if (!response.ok || !response.body) {
		return [];
	}
	try {
		const result = await response.json();
		const parsedResult = institutionListValidator.parse(result);
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

const institutionInfoValidator = s.tuple([
	s.object({
		tenantId: s.string,
		domain: s.string,
		"_links": s.object({ "self": s.object({ "href": s.string }) }),
	}),
]);

export async function getInstitutionInfo(lmsDomain: string) {
	const response = await fetch(
		`https://landlord.brightspace.com/v1/tenants?domain=${lmsDomain}`,
		{ method: "GET" },
	);
	if (!response.ok || !response.body) {
		return null;
	}
	try {
		const result = await response.json();
		const [parsedResult] = institutionInfoValidator.parse(result);
		return parsedResult;
	} catch (e) {
		return null;
	}
}
