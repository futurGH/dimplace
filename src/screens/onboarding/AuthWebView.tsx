import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SafeAreaView, StyleSheet } from "react-native";
import WebView from "react-native-webview";
import { getToken } from "../../api/token";
import type { StackParamList } from "../../components/layout/NavigationWrapper";
import { useStoreActions, useStoreState } from "../../store/store";

export type AuthWebViewProps = NativeStackScreenProps<StackParamList, "AuthWebView">;
export function AuthWebView({ route, navigation }: AuthWebViewProps) {
	const { source: uri } = route.params;
	const config = useStoreState((state) => state.config);
	const configActions = useStoreActions((actions) => actions.config);
	return (
		<SafeAreaView style={styles.container}>
			<WebView
				source={{ uri }}
				originWhitelist={["*"]}
				onShouldStartLoadWithRequest={(event) => {
					if (event.url.includes("code=")) {
						const code = event.url.split("code=")[1];
						if (!code) return true;
						getToken({ code, clientId: config.clientId }).then((token) => {
							if (token) {
								const { access_token, refresh_token } = token;
								configActions.setAccessToken(access_token);
								configActions.setRefreshToken(refresh_token);
								configActions.setOnboarded(true);
							}
							navigation.navigate("Home");
						});
						return false;
					} else return true;
				}}
			/>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({ container: { flex: 1 } });
