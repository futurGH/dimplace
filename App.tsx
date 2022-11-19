import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { Button, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { WebView } from "react-native-webview";

export default function App() {
	const [viewOpened, setViewOpened] = useState(false);
	return (
		<>
			{viewOpened
				? (
					<View style={styles.container}>
						<Text style={{ color: "#fff" }}>Open up App.js to start working on your app!</Text>
						<Button title="Click Me" onPress={() => setViewOpened(true)} />
						<StatusBar style="light" />
					</View>
				)
				: (
					<SafeAreaView style={{ flex: 1 }}>
						<WebView
							source={{
								uri: `https://auth.brightspace.com/oauth2/auth?client_id=${clientId}&scope=*:*:read%20core:*:*%20updates:devices:create%20updates:devices:delete%20content:topics:mark-read%20assignments:folder:submit&redirect_uri=brightspacepulse://auth&state=${state}&tenant_id=${tenantId}&response_type=code`,
							}}
							onNavigationStateChange={(event) => {
								console.log(event);
							}}
						/>
					</SafeAreaView>
				)}
		</>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: "#000", alignItems: "center", justifyContent: "center" },
});
