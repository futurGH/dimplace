import type { ReactNode } from "react";
import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { useColorTheme } from "../../style/ColorThemeProvider";
import type { ColorTheme } from "../../style/colorThemes";

export interface CardProps {
	content: ReactNode;
	footer?: ReactNode;
	onPress?: () => void;
	style?: View["props"]["style"];
}
export function Card({ content, footer = null, onPress, style }: CardProps) {
	const { Colors } = useColorTheme();
	const styles = createStyles(Colors);
	const [pressed, setPressed] = useState(false);
	const backgroundColor = pressed ? Colors.Button : Colors.Card;
	return (
		<Pressable
			onPress={onPress}
			onPressIn={() => setPressed(true)}
			onPressOut={() => setPressed(false)}
			style={[styles.container, style, { backgroundColor }]}
		>
			{content}
			{footer}
		</Pressable>
	);
}

const createStyles = (Colors: ColorTheme) =>
	StyleSheet.create({
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
