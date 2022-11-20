import { Action, action } from "easy-peasy";

export interface ConfigModel {
	onboarded: boolean;
	setOnboarded: Action<ConfigModel, boolean>;
	tenantId: string;
	setTenantId: Action<ConfigModel, string>;
	clientId: string;
}

export const confioModel: ConfigModel = {
	onboarded: false,
	setOnboarded: action((state, payload) => {
		state.onboarded = payload;
	}),
	tenantId: "",
	setTenantId: action((state, payload) => {
		state.tenantId = payload;
	}),
	clientId: "73b7099f-d148-46f7-95cc-4b957cdf0f75",
};
