import type { ReactNode } from "react";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import type { SvgProps } from "react-native-svg";
import { useColorTheme } from "../../style/ColorThemeProvider";
import type { ColorTheme } from "../../style/colorThemes";
import { Typography } from "../../style/typography";

export interface ChipProps {
	text: ReactNode;
	icon?: (props: { style?: SvgProps["style"]; fill?: SvgProps["fill"] }) => JSX.Element | null;
	onPress?: () => void;
	style?: View["props"]["style"];
}
export function Chip({ text, icon: Icon = () => null, onPress, style }: ChipProps) {
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
			<Icon style={styles.icon} fill={Colors.TextLabel} />
			<Text style={styles.text}>{text}</Text>
		</Pressable>
	);
}

const createStyles = (Colors: ColorTheme) =>
	StyleSheet.create({
		container: {
			backgroundColor: Colors.Card,
			borderRadius: 99,
			borderWidth: 1,
			borderColor: Colors.Border,
			overflow: "hidden",
			flexDirection: "row",
			alignItems: "center",
			paddingHorizontal: 16,
			paddingVertical: 10,
		},
		icon: { width: 18, height: 18, marginRight: 8 },
		text: { ...Typography.Label, color: Colors.TextLabel },
	});
