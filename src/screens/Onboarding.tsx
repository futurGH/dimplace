import { StyleSheet, Text, View } from "react-native";
import { BrokenLightbulb } from "../assets/broken-lightbulb";
import Button from "../components/Button";
import { Colors, Typography } from "../styles";

export function Onboarding() {
	return (
		<View style={styles.container}>
			<BrokenLightbulb />
			<Text style={styles.title}>Welcome to Dimplace!</Text>
			<Text style={styles.body}>Log in with your education provider to get started.</Text>
			<Button title="Get started" style={{ button: styles.button }} />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: Colors.Background,
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		paddingHorizontal: "10%",
	},
	title: {
		...Typography.Title,
		color: Colors.TextPrimary,
		textAlign: "center",
		letterSpacing: -0.25,
		paddingTop: 16,
		paddingBottom: 8,
	},
	body: { ...Typography.Body, color: Colors.TextPrimary, textAlign: "center" },
	button: { marginTop: 32 },
});
