import type { NavigationProp } from "@react-navigation/native";
import type { ActionTypes, RecursiveActions, StateMapper } from "easy-peasy";
import { buildAuthUrl } from "../screens/onboarding/AuthWebView";
import type { ConfigModel } from "../store/configModel";
import { debounce } from "./debounce";

type Config = StateMapper<Pick<ConfigModel, FilterKeysByValue<ConfigModel, ActionTypes>>>;

let authing = false;
const authWebView = debounce((navigation: NavigationProp<any>, config: Config) => {
	navigation.navigate("AuthWebView", { source: buildAuthUrl(config) });
}, 5000);

export async function handleErrors(
	{ error: _error, navigation, config, actions }: {
		error: unknown;
		navigation: NavigationProp<any>;
		config: Config;
		actions: RecursiveActions<ConfigModel>;
	},
) {
	const [, error] = await actions.updateAccessToken();
	if (error) {
		if (authing) return true;
		authing = true;
		authWebView(navigation, config);
	} else authing = false;
	return true;
}
