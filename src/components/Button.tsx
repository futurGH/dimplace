import { type ButtonProps as BuiltInButtonProps, Pressable, StyleSheet, Text } from "react-native";
import { Colors, Typography } from "../styles";

export type ButtonProps = BuiltInButtonProps & {
	style: Partial<StyleSheet.NamedStyles<typeof baseStyles>>;
};
export default function Button({ onPress, title, style }: ButtonProps) {
	return (
		<Pressable style={[baseStyles.button, style.button]} onPress={onPress}>
			<Text style={[baseStyles.text, style.text]}>{title}</Text>
		</Pressable>
	);
}

const baseStyles = StyleSheet.create({
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
