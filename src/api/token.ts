import * as t from "typed";

const tokenValidator = t.object({
	access_token: t.string(),
	token_type: t.string(),
	scope: t.string(),
	expires_in: t.number(),
	refresh_token: t.string(),
});

export type APIToken = t.Infer<typeof tokenValidator>;
export async function getToken(
	{ code, clientId }: { code: string; clientId: string },
): Promise<APIToken | null> {
	const body = new FormData();
	body.append("grant_type", "authorization_code");
	body.append("code", code);
	body.append("redirect_uri", "brightspacepulse://auth");
	body.append("client_id", clientId);
	const response = await fetch("https://auth.brightspace.com/core/connect/token", {
		method: "POST",
		body,
	});
	if (!response.ok) {
		return null;
	}
	try {
		const result = await response.json();
		return t.unwrap(tokenValidator(result));
	} catch (e) {
		return null;
	}
}
