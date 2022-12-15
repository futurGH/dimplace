import { StyleSheet, Text } from "react-native";
import { Container } from "../../components/layout/Container";
import { Colors, Typography } from "../../styles";

export function Notifications() {
	return (
		<Container>
			<Text style={styles.text}>
				Notifications are next up on the to-do list. For now, you might want to stick to
				Pulse for that.{"\n\n"}❤️
			</Text>
		</Container>
	);
}

const styles = StyleSheet.create({
	text: {
		...Typography.Body,
		color: Colors.TextLabel,
		marginHorizontal: 32,
		marginTop: 32,
		textAlign: "center",
	},
});
