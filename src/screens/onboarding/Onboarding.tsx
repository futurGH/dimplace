import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StyleSheet, Text } from "react-native";
import { BrokenLightbulb } from "../../assets/broken-lightbulb";
import Button from "../../components/elements/Button";
import { HeaderlessContainer } from "../../components/layout/HeaderlessContainer";
import type { StackParamList } from "../../components/layout/NavigationWrapper";
import { useStoreState } from "../../store/store";
import { useColorTheme } from "../../style/ColorThemeProvider";
import type { ColorTheme } from "../../style/colorThemes";
import { Typography } from "../../style/typography";

export function Onboarding({ navigation }: NativeStackScreenProps<StackParamList, "Onboarding">) {
	const config = useStoreState((state) => state.config);
	const { Colors } = useColorTheme();
	if (config.onboarded) navigation.navigate("Home");
	const styles = createStyles(Colors);
	return (
		<HeaderlessContainer style={styles.content}>
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
		</HeaderlessContainer>
	);
}

const createStyles = (Colors: ColorTheme) =>
	StyleSheet.create({
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
