import { StyleSheet, Text } from "react-native";
import { Container } from "../../components/layout/Container";
import { useColorTheme } from "../../style/ColorThemeProvider";
import type { ColorTheme } from "../../style/colorThemes";
import { Typography } from "../../style/typography";

export function Notifications() {
	const { Colors } = useColorTheme();
	const styles = createStyles(Colors);
	return (
		<Container>
			<Text style={styles.text}>
				Notifications are next up on the to-do list. For now, you might want to stick to
				Pulse for that.{"\n\n"}❤️
			</Text>
		</Container>
	);
}

const createStyles = (Colors: ColorTheme) =>
	StyleSheet.create({
		text: {
			...Typography.Body,
			color: Colors.TextLabel,
			marginHorizontal: 32,
			marginTop: 32,
			textAlign: "center",
		},
	});
