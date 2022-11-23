import { Action, action, Thunk, thunk } from "easy-peasy";

export interface ConfigModel {
	onboarded: boolean;
	setOnboarded: Action<ConfigModel, boolean>;
	tenantId: string;
	setTenantId: Action<ConfigModel, string>;
	clientId: string;
	accessToken: string;
	setAccessToken: Action<ConfigModel, string>;
	updateAccessToken: Thunk<ConfigModel, string>;
	refreshToken: string;
	setRefreshToken: Action<ConfigModel, string>;
}

export const configModel: ConfigModel = {
	onboarded: false,
	setOnboarded: action((state, payload) => {
		state.onboarded = payload;
	}),
	tenantId: "",
	setTenantId: action((state, payload) => {
		state.tenantId = payload;
	}),
	clientId: "73b7099f-d148-46f7-95cc-4b957cdf0f75",
	accessToken: "",
	setAccessToken: action((state, payload) => {
		state.accessToken = payload;
	}),
	updateAccessToken: thunk(async (actions, refreshToken, { getState, fail }) => {
		const state = getState();
		if (state.refreshToken !== refreshToken) {
			actions.setRefreshToken(refreshToken);
		}
		const response = await fetch("https://auth.api.brightspace.com/core/connect/token", {
			method: "POST",
			headers: { "Content-Type": "application/x-www-form-urlencoded" },
			body: new URLSearchParams({
				grant_type: "refresh_token",
				refresh_token: refreshToken,
				client_id: state.clientId,
			}),
		});
		if (response.ok) {
			const data = await response.json();
			actions.setAccessToken(data.access_token);
		} else {
			fail({ status: response.status, statusText: response.statusText });
		}
	}),
	refreshToken: "",
	setRefreshToken: action((state, payload) => {
		state.refreshToken = payload;
	}),
};
