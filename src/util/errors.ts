import { useNavigation } from "@react-navigation/native";
import { buildAuthUrl } from "../screens/onboarding/AuthWebView";
import { useStoreActions, useStoreState } from "../store/store";

export function handleErrors(
	{ errors, refetch }: { errors: unknown; refetch: () => Promise<unknown> },
) {
	const config = useStoreState((state) => state.config);
	const configActions = useStoreActions((state) => state.config);
	const navigation = useNavigation();
	if (Array.isArray(errors) && errors.length) {
		const error = errors[0];
		const errorCode = error.response.status;
		if (errorCode === 401) {
			configActions.updateAccessToken(config.refreshToken);
			// TODO: alert or something when repeated fetching fails
			refetch().catch(() => {
				navigation.navigate("AuthWebView", { source: buildAuthUrl(config) });
			});
		}
	}
}
