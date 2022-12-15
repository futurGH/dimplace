import { useState } from "react";
import { Linking, Pressable, StyleSheet, Text, View } from "react-native";
import { Container } from "../../components/layout/Container";
import { Colors, Typography } from "../../styles";

export function Settings() {
	const [linkColor, setLinkColor] = useState<string>(Colors.TextLabel);
	return (
		<Container>
			<View style={styles.container}>
				<Text style={styles.text}>Version 1.0.0</Text>
				<Text style={styles.text}>
					With lots of ❤️ {"\n"}
					<Text style={styles.tiny}>(and a little bit of 😡)</Text>
				</Text>
				<Pressable
					style={styles.text}
					onPress={() => Linking.openURL("mailto:dimplace@abdullahs.ca")}
					onPressIn={() => setLinkColor(Colors.Active)}
					onPressOut={() => setLinkColor(Colors.TextLabel)}
				>
					<Text style={styles.text}>
						Feedback:{" "}
						<Text style={[styles.link, { color: linkColor }]}>
							dimplace@abdullahs.ca
						</Text>
					</Text>
				</Pressable>
			</View>
		</Container>
	);
}
const styles = StyleSheet.create({
	container: {
		flex: 1,
		marginTop: 24,
		paddingHorizontal: 48,
		alignItems: "center",
		width: "100%",
	},
	text: { ...Typography.Body, color: Colors.TextLabel, marginBottom: 16, textAlign: "center" },
	tiny: { ...Typography.Caption, color: Colors.TextLabel, lineHeight: 20 },
	link: { ...Typography.Callout, color: Colors.TextLabel, textDecorationLine: "underline" },
});
