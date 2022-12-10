import type { ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import type { SvgProps } from "react-native-svg";
import { Colors, Typography } from "../../styles";

export interface ChipProps {
	text: ReactNode;
	icon?: (props: { style?: SvgProps["style"]; fill?: SvgProps["fill"] }) => JSX.Element | null;
	onPress?: () => void;
	style?: View["props"]["style"];
}
export function Chip({ text, icon: Icon = () => null, onPress, style }: ChipProps) {
	return (
		<Pressable onPress={onPress} style={[styles.container, style]}>
			<Icon style={styles.icon} fill={Colors.TextLabel} />
			<Text style={styles.text}>{text}</Text>
		</Pressable>
	);
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: Colors.Card,
		borderRadius: 32,
		borderWidth: 1,
		borderColor: Colors.Border,
		overflow: "hidden",
		flexDirection: "row",
		paddingHorizontal: 16,
		paddingVertical: 10,
	},
	icon: { width: 18, height: 18, marginRight: 8 },
	text: { ...Typography.Label, color: Colors.TextLabel },
});
