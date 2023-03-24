import { type Action, action, type Thunk, thunk } from "easy-peasy";
import { gqlClient } from "../api/gqlClient";
import type { CourseListQuery } from "../gql/graphql";

export interface ConfigModel {
	onboarded: boolean;
	setOnboarded: Action<ConfigModel, boolean>;
	tenantId: string;
	setTenantId: Action<ConfigModel, string>;
	clientId: string;
	accessToken: string;
	setAccessToken: Action<ConfigModel, string>;
	updateAccessToken: Thunk<ConfigModel, undefined, any, {}, Promise<[string, null] | [null, unknown]>>;
	refreshToken: string;
	setRefreshToken: Action<ConfigModel, string>;
	placeholderData: Partial<{ courseList: CourseListQuery }>;
	setPlaceholderData: Action<ConfigModel, this["placeholderData"]>;
	__DEMO__: boolean;
	__SET_DEMO__: Action<ConfigModel, boolean>;
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
	updateAccessToken: thunk(async (actions, _, { getState }): Promise<[string, null] | [null, unknown]> => {
		const state = getState();
		const body = {
			grant_type: "refresh_token",
			refresh_token: state.refreshToken,
			client_id: state.clientId,
		};
		const form = Object.entries(body).map(([key, value]) =>
			`${encodeURIComponent(key)}=${encodeURIComponent(value)}`
		).join("&");
		const response = await fetch("https://auth.brightspace.com/core/connect/token", {
			method: "POST",
			headers: { "Content-Type": "application/x-www-form-urlencoded" },
			body: form,
		});
		try {
			const data = await response.json();

			if (!response.ok || !data.access_token) return [null, data];
			if (!data.access_token) return [null, data];

			gqlClient.setHeader("Authorization", "Bearer " + data.access_token);
			actions.setAccessToken(data.access_token);
			if (data.refresh_token && data.refresh_token !== state.refreshToken) {
				actions.setRefreshToken(data.refresh_token);
			}

			return [data.access_token, null];
		} catch (e) {
			return [null, e];
		}
	}),
	refreshToken: "",
	setRefreshToken: action((state, payload) => {
		state.refreshToken = payload;
	}),
	placeholderData: {},
	setPlaceholderData: action((state, payload) => {
		Object.assign(state.placeholderData, payload);
	}),
	__DEMO__: false,
	__SET_DEMO__: action((state, payload) => {
		state.__DEMO__ = payload;
	}),
};
