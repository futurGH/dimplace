import type { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { useColorTheme } from "../../style/ColorThemeProvider";
import type { ColorTheme } from "../../style/colorThemes";

interface ContainerProps {
	style?: View["props"]["style"];
	children: ReactNode;
}
export function Container({ style, children }: ContainerProps) {
	const { Colors } = useColorTheme();
	const baseStyles = createStyles(Colors);
	return <View style={[baseStyles.content, style]}>{children}</View>;
}

const createStyles = (Colors: ColorTheme) =>
	StyleSheet.create({
		content: {
			backgroundColor: Colors.Background,
			height: "100%",
			width: "100%",
			paddingHorizontal: "5%",
			paddingTop: "2.5%",
		},
	});
