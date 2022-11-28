import type { ReactNode } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Colors } from "../../styles";

export interface CardProps {
	content: ReactNode;
	footer?: ReactNode;
	onPress?: () => void;
	style?: View["props"]["style"];
}
export function Card({ content, footer = null, onPress, style }: CardProps) {
	return (
		<Pressable onPress={onPress} style={[styles.container, style]}>{content}{footer}</Pressable>
	);
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: Colors.Card,
		borderRadius: 16,
		borderWidth: 1,
		borderColor: Colors.Border,
		overflow: "hidden",
		flex: 1,
		width: "100%",
		alignItems: "center",
	},
});
