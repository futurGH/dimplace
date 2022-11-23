import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StyleSheet, Text } from "react-native";
import { BrokenLightbulb } from "../../assets/broken-lightbulb";
import Button from "../../components/Button";
import { Container } from "../../components/Container";
import type { StackParamList } from "../../components/layout/NavigationWrapper";
import { Colors, Typography } from "../../styles";

export function Onboarding({ navigation }: NativeStackScreenProps<StackParamList, "Onboarding">) {
	return (
		<Container style={styles.content}>
			<BrokenLightbulb />
			<Text style={styles.title}>Welcome to Dimplace!</Text>
			<Text style={styles.body}>Log in with your education provider to get started.</Text>
			<Button
				title="Get started"
				style={{ button: styles.button }}
				onPress={() => {
					navigation.navigate("InstitutionSelection");
				}}
			/>
		</Container>
	);
}

const styles = StyleSheet.create({
	content: { flex: 1, justifyContent: "center", alignItems: "center" },
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
