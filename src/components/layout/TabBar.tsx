import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Colors, Typography } from "../../styles";
export function TabBar({ navigation, state, descriptors }: BottomTabBarProps) {
	return (
		<View style={styles.container}>
			{state.routes.map((route, index) => {
				const { options } = descriptors[route.key];
				const isFocused = state.index === index;
				const potentiallyLabel = options.tabBarLabel || options.title || route.name;
				const label = typeof potentiallyLabel === "function"
					? potentiallyLabel({
						color: isFocused ? Colors.Active : Colors.TextLabel,
						focused: isFocused,
						position: "below-icon",
					})
					: potentiallyLabel;
				const icon = options.tabBarIcon?.({
					color: isFocused ? Colors.Active : Colors.TextLabel,
					focused: isFocused,
					size: 32,
				});
				const onPress = () => {
					const event = navigation.emit({
						type: "tabPress",
						target: route.key,
						canPreventDefault: true,
					});
					if (!isFocused && !event.defaultPrevented) {
						navigation.navigate(route.name);
					}
				};
				const onLongPress = () => {
					navigation.emit({ type: "tabLongPress", target: route.key });
				};
				return (
					<Pressable
						key={route.key}
						style={styles.tab}
						accessibilityRole="button"
						accessibilityState={isFocused ? { selected: true } : {}}
						accessibilityLabel={options.tabBarAccessibilityLabel}
						onPress={onPress}
						onLongPress={onLongPress}
					>
						{icon}
						<Text style={[styles.tabLabel, isFocused ? styles.activeTab : {}]}>
							{label}
						</Text>
					</Pressable>
				);
			})}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: Colors.Background,
		width: "100%",
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingHorizontal: 48,
		paddingTop: 20,
		paddingBottom: 40,
	},
	tab: { justifyContent: "center", alignItems: "center", color: Colors.TextLabel },
	tabLabel: { ...Typography.Caption, color: Colors.TextLabel, marginTop: 4 },
	activeTab: { color: Colors.Active, fontFamily: "WorkMedium" },
});
