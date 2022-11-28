import type {
	NativeStackHeaderProps,
} from "@react-navigation/native-stack/lib/typescript/src/types";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors, Typography } from "../../styles";

export function Header(
	{ route: { name }, options: { title, headerLeft, headerRight } }: NativeStackHeaderProps,
) {
	const { top: paddingTop } = useSafeAreaInsets();
	const leftIcon = headerLeft?.({ canGoBack: true }) || null;
	const rightIcon = headerRight?.({ canGoBack: true }) || null;
	return (
		<View style={[styles.paddingWrapper, { paddingTop }]}>
			<View style={styles.container}>
				<View style={styles.icon}>{leftIcon}</View>
				<Text style={styles.title}>{title || name}</Text>
				<View style={styles.icon}>{rightIcon}</View>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	paddingWrapper: { backgroundColor: Colors.Background, width: "100%", height: "auto" },
	container: {
		width: "100%",
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingHorizontal: "10%",
		paddingVertical: 16,
	},
	title: { ...Typography.Title, color: Colors.TextPrimary },
	icon: { maxWidth: 28, maxHeight: 28 },
});
