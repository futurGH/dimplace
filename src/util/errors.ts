import type { NavigationProp } from "@react-navigation/native";
import type { ActionTypes, RecursiveActions, StateMapper } from "easy-peasy";
import { buildAuthUrl } from "../screens/onboarding/AuthWebView";
import type { ConfigModel } from "../store/configModel";
export function handleErrors(
	{ error: _error, failureCount = 0, navigation, config, actions }: {
		error: unknown;
		failureCount?: number;
		navigation: NavigationProp<any>;
		config: StateMapper<Pick<ConfigModel, FilterKeysByValue<ConfigModel, ActionTypes>>>;
		actions: RecursiveActions<ConfigModel>;
	},
) {
	if (failureCount >= 3) {
		navigation.navigate("AuthWebView", { source: buildAuthUrl(config) });
		return false;
	}
	const error = (Array.isArray(_error) && _error.length) ? _error[0] : _error;
	const errorCode = error?.response?.status;
	if (errorCode === 401) {
		actions.updateAccessToken(config.refreshToken);
	}
	return true;
}
