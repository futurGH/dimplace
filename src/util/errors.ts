import type { NavigationProp } from "@react-navigation/native";
import type { ActionTypes, RecursiveActions, StateMapper } from "easy-peasy";
import { buildAuthUrl } from "../screens/onboarding/AuthWebView";
import type { ConfigModel } from "../store/configModel";

let errorCount = 0;
setInterval(() => errorCount = 0, 10000);
export function handleErrors(
	{ errors, refetch, navigation, config, actions }: {
		errors: unknown;
		refetch: () => Promise<unknown>;
		navigation: NavigationProp<any>;
		config: StateMapper<Pick<ConfigModel, FilterKeysByValue<ConfigModel, ActionTypes>>>;
		actions: RecursiveActions<ConfigModel>;
	},
) {
	errorCount++;
	console.log(errorCount);
	if (errorCount >= 3) {
		errorCount = 0;
		console.log("navigating");
		navigation.navigate("AuthWebView", { source: buildAuthUrl(config) });
	}
	const error = (Array.isArray(errors) && errors.length) ? errors[0] : errors;
	const errorCode = error.response.status;
	if (errorCode === 401) {
		actions.updateAccessToken(config.refreshToken);
	}
	// TODO: alert or something when repeated fetching fails
	refetch().catch(() => {
		navigation.navigate("AuthWebView", { source: buildAuthUrl(config) });
	});
}
