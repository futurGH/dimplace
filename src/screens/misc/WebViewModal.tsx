import { useNavigation, useRoute } from "@react-navigation/native";
import { useState } from "react";
import { StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { WebViewProps } from "react-native-webview";
import WebView from "react-native-webview";
import { Container } from "../../components/layout/Container";
import type { HeaderProps } from "../../components/layout/Header";
import { Header } from "../../components/layout/Header";
import type { RootStackScreenProps } from "../../components/layout/NavigationWrapper";
import { CoursePageHeaderLeftButton, CoursePageHeaderRightButton } from "../course/CourseNavigation";

export interface WebViewModalProps extends WebViewProps {
	persistHeaders?: boolean;
	heading?: HeaderProps;
}
export function WebViewModal() {
	const navigation = useNavigation<RootStackScreenProps<"WebViewModal">["navigation"]>();
	const route = useRoute<RootStackScreenProps<"WebViewModal">["route"]>();
	const { source, persistHeaders, heading, ...props } = route.params;

	const _uri = source && "uri" in source && source?.uri;
	const [uri, setUri] = useState(_uri || "");

	const { bottom } = useSafeAreaInsets();

	if (!props.onLoadStart) {
		props.onLoadStart = persistHeaders ? (state) => setUri(state.nativeEvent.url) : undefined;
	}

	return (
		<Container>
			{heading && (
				<Header
					route={heading.route}
					options={{
						headerLeft: () => (
							<CoursePageHeaderLeftButton
								text=""
								onPress={() => navigation.goBack()}
							/>
						),
						headerRight: () => <CoursePageHeaderRightButton url={uri} />,
						...heading.options,
					}}
					paddingTop={0}
				/>
			)}
			<WebView
				source={{ ...source, uri }}
				style={{ ...styles.webView, marginBottom: bottom }}
				{...props}
			/>
		</Container>
	);
}

const styles = StyleSheet.create({ webView: { borderTopLeftRadius: 16, borderRadius: 16, marginTop: 16 } });
