import type { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { Colors } from "../../styles";

interface ContainerProps {
	style?: View["props"]["style"];
	children: ReactNode;
}
export function Container({ style, children }: ContainerProps) {
	return <View style={[baseStyles.content, style]}>{children}</View>;
}

const baseStyles = StyleSheet.create({
	content: {
		backgroundColor: Colors.Background,
		height: "100%",
		width: "100%",
		paddingHorizontal: "5%",
		paddingTop: "2.5%",
	},
});
