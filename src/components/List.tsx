import type { FlatListProps, TextStyle, ViewStyle } from "react-native";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { Colors, Typography } from "../styles";
import { ItemSeparator } from "./ItemSeparator";

interface ListItemProps {
	icon: (props?: { style?: ViewStyle }) => JSX.Element;
	title: string;
	subtitle?: string;
	onPress?: () => void;
	style?: { container?: ViewStyle; icon?: ViewStyle; title?: TextStyle; subtitle?: TextStyle };
}
export function ListItem({ icon: Icon, title, subtitle, onPress, style = {} }: ListItemProps) {
	return (
		<View style={[listItemStyles.container, style.container]}>
			<Icon />
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

export function List<T extends ListItemProps>(
	props: Partial<FlatListProps<T>> & Pick<FlatListProps<T>, "data">,
) {
	return (
		<FlatList
			ItemSeparatorComponent={ItemSeparator}
			renderItem={({ item }) => <ListItem {...item} />}
			{...props}
		/>
	);
}
