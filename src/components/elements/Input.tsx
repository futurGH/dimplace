import type { ReactNode } from "react";
import { TextInput } from "react-native";
import { StyleSheet, View } from "react-native";
import { Colors } from "../../styles";

export type InputProps = TextInput["props"] & {
	icon?: ReactNode;
	containerStyle?: View["props"]["style"];
};
export function Input({ style, ...props }: InputProps) {
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

const baseStyles = StyleSheet.create({
	container: {
		backgroundColor: Colors.Input,
		flex: 1,
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 9999,
		overflow: "hidden",
		paddingLeft: 20,
		paddingRight: 12,
		paddingVertical: 12,
	},
	input: { backgroundColor: Colors.Input, color: Colors.TextPrimary, flexGrow: 1 },
});
