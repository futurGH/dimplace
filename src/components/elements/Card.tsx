import type { ReactNode } from "react";
import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Colors } from "../../styles";

export interface CardProps {
	content: ReactNode;
	footer?: ReactNode;
	onPress?: () => void;
	style?: View["props"]["style"];
}
export function Card({ content, footer = null, onPress, style }: CardProps) {
	const [backgroundColor, setBackground] = useState<string>(styles.container.backgroundColor);
	return (
		<Pressable
			onPress={onPress}
			onPressIn={() => setBackground(Colors.Button)}
			onPressOut={() => setBackground(styles.container.backgroundColor)}
			style={[styles.container, style, { backgroundColor }]}
		>
			{content}
			{footer}
		</Pressable>
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
