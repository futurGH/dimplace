import { type ButtonProps as BuiltInButtonProps, Pressable, StyleSheet, Text } from "react-native";
import { useColorTheme } from "../../style/ColorThemeProvider";
import type { ColorTheme } from "../../style/colorThemes";
import { Typography } from "../../style/typography";

export type ButtonProps = BuiltInButtonProps & {
	style: Partial<StyleSheet.NamedStyles<ReturnType<typeof createStyles>>>;
};
export default function Button({ onPress, title, style }: ButtonProps) {
	const { Colors } = useColorTheme();
	const baseStyles = createStyles(Colors);
	return (
		<Pressable style={[baseStyles.button, style.button]} onPress={onPress}>
			<Text style={[baseStyles.text, style.text]}>{title}</Text>
		</Pressable>
	);
}

const createStyles = (Colors: ColorTheme) =>
	StyleSheet.create({
		button: {
			backgroundColor: Colors.Button,
			borderColor: Colors.Border,
			borderRadius: 999,
			borderWidth: 1,
			flex: 1,
			flexShrink: 1,
			flexGrow: 0,
			justifyContent: "center",
			alignItems: "center",
			paddingVertical: 16,
			paddingHorizontal: 32,
			minHeight: 52,
		},
		text: { ...Typography.Body, color: Colors.TextPrimary },
	});
