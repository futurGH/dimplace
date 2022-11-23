import type { ReactNode } from "react";
import type { FlatListProps, TextStyle, ViewStyle } from "react-native";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { Colors, Typography } from "../styles";
import { ItemSeparator } from "./ItemSeparator";

export interface ListItemProps {
	title: string;
	icon?: ReactNode;
	subtitle?: string;
	onPress?: () => void;
	style?: { container?: ViewStyle; icon?: ViewStyle; title?: TextStyle; subtitle?: TextStyle };
}
export function ListItem({ icon = null, title, subtitle, onPress, style = {} }: ListItemProps) {
	return (
		<View style={[listItemStyles.container, style.container]}>
			{icon}
			<Pressable style={listItemStyles.text} onPress={onPress}>
				<Text style={[listItemStyles.title, style.title]}>{title}</Text>
				{subtitle && (
					<Text style={[listItemStyles.subtitle, style.subtitle]}>{subtitle}</Text>
				)}
			</Pressable>
		</View>
	);
}

const listItemStyles = StyleSheet.create({
	container: { flex: 1, flexDirection: "row", paddingVertical: 16 },
	text: { flex: 1, justifyContent: "center", paddingLeft: 8 },
	title: { ...Typography.ListHeading, color: Colors.TextPrimary },
	subtitle: { ...Typography.Label, color: Colors.TextLabel },
});

interface ListProps<T> extends Partial<FlatListProps<T>> {
	data: Array<T>;
	onItemPress?: (item: T) => void;
}
export function List<T extends ListItemProps>({ onItemPress = () => {}, ...props }: ListProps<T>) {
	return (
		<FlatList
			ItemSeparatorComponent={ItemSeparator}
			renderItem={({ item }) => <ListItem onPress={() => onItemPress(item)} {...item} />}
			{...props}
		/>
	);
}
