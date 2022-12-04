import { useNavigation } from "@react-navigation/native";
import type { ActionTypes, RecursiveActions, StateMapper } from "easy-peasy";
import { buildAuthUrl } from "../screens/onboarding/AuthWebView";
import type { ConfigModel } from "../store/configModel";
export function handleErrors(
	{ errors, refetch, config, actions }: {
		errors: unknown;
		refetch: () => Promise<unknown>;
		config: StateMapper<Pick<ConfigModel, FilterKeysByValue<ConfigModel, ActionTypes>>>;
		actions: RecursiveActions<ConfigModel>;
	},
) {
	const navigation = useNavigation();
	if (Array.isArray(errors) && errors.length) {
		const error = errors[0];
		const errorCode = error.response.status;
		if (errorCode === 401) {
			actions.updateAccessToken(config.refreshToken);
			// TODO: alert or something when repeated fetching fails
			refetch().catch(() => {
				navigation.navigate("AuthWebView", { source: buildAuthUrl(config) });
			});
		}
	}
}
