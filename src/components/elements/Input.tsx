import type { ReactNode } from "react";
import { TextInput } from "react-native";
import { StyleSheet, View } from "react-native";
import { useColorTheme } from "../../style/ColorThemeProvider";
import type { ColorTheme } from "../../style/colorThemes";

export type InputProps = TextInput["props"] & { icon?: ReactNode; containerStyle?: View["props"]["style"] };
export function Input({ style, ...props }: InputProps) {
	const { Colors } = useColorTheme();
	const baseStyles = createStyles(Colors);
	return (
		<View style={[baseStyles.container, props.containerStyle]}>
			{props.icon}
			<TextInput
				style={[baseStyles.input, style]}
				placeholderTextColor={Colors.Inactive}
				clearButtonMode="always"
				{...props}
			/>
		</View>
	);
}

const createStyles = (Colors: ColorTheme) =>
	StyleSheet.create({
		container: {
			backgroundColor: Colors.Input,
			flexDirection: "row",
			borderRadius: 9999,
			overflow: "hidden",
			paddingLeft: 20,
			paddingRight: 12,
			paddingVertical: 12,
		},
		input: { backgroundColor: Colors.Input, color: Colors.TextPrimary, flexGrow: 1 },
	});
