import type { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColorTheme } from "../../style/ColorThemeProvider";
import type { ColorTheme } from "../../style/colorThemes";
import { Typography } from "../../style/typography";

// Written out for assignability to (from? parameter variance is confusing) BottomTabHeaderProps
export type HeaderProps = {
	route: { name: NativeStackHeaderProps["route"]["name"] };
	options?: {
		title?: NativeStackHeaderProps["options"]["title"];
		headerTitle?: NativeStackHeaderProps["options"]["headerTitle"];
		headerLeft?: NativeStackHeaderProps["options"]["headerLeft"];
		headerRight?: NativeStackHeaderProps["options"]["headerRight"];
	};
	paddingTop?: number;
};
export function Header(
	{ route: { name }, options: { title: _title, headerTitle, headerLeft, headerRight } = {}, paddingTop }:
		HeaderProps,
) {
	const { Colors } = useColorTheme();
	const styles = createStyles(Colors);

	const title = (typeof headerTitle === "function" ? headerTitle({ children: "" }) : headerTitle)
		?? _title ?? name;
	paddingTop = paddingTop ?? useSafeAreaInsets().top; // ??= doesn't seem to be supported by Expo yet

	const leftIcon = headerLeft?.({ canGoBack: true }) || null;
	const rightIcon = headerRight?.({ canGoBack: true }) || null;
	return (
		<View style={[styles.paddingWrapper, { paddingTop }]}>
			<View style={styles.container}>
				<View style={styles.icon}>{leftIcon}</View>
				<Text numberOfLines={1} style={styles.title}>{title}</Text>
				<View style={{ ...styles.icon, ...styles.rightIcon }}>{rightIcon}</View>
			</View>
		</View>
	);
}

const createStyles = (Colors: ColorTheme) =>
	StyleSheet.create({
		paddingWrapper: { backgroundColor: Colors.Background, width: "100%", height: "auto" },
		container: {
			width: "100%",
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "space-between",
			paddingHorizontal: "5%",
			paddingVertical: 16,
		},
		title: { ...Typography.Heading, color: Colors.TextPrimary, textAlign: "center", width: "50%" },
		icon: { maxHeight: 28, flexGrow: 1, flexBasis: 0 },
		rightIcon: { flexDirection: "row", justifyContent: "flex-end" },
	});
