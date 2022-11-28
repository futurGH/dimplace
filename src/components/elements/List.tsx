import type { ReactNode } from "react";
import type { FlatListProps, GestureResponderEvent, TextStyle, ViewStyle } from "react-native";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { Colors, Typography } from "../../styles";
import { ItemSeparator } from "./ItemSeparator";

export interface ListItemProps {
	title: string;
	icon?: ReactNode;
	label?: string;
	onPress?: (event: GestureResponderEvent) => void;
	onPressIn?: (event: GestureResponderEvent) => void;
	onPressOut?: (event: GestureResponderEvent) => void;
	style?: {
		container?: ViewStyle;
		text?: ViewStyle;
		icon?: ViewStyle;
		title?: TextStyle;
		label?: TextStyle;
	};
}
export function ListItem(
	{ icon = null, title, label, onPress, onPressIn, onPressOut, style = {} }: ListItemProps,
) {
	return (
		<View style={style.container}>
			{icon}
			<Pressable
				style={style.text}
				onPress={onPress}
				onPressIn={onPressIn}
				onPressOut={onPressOut}
			>
				<Text style={style.title}>{title}</Text>
				{label && <Text style={style.label}>{label}</Text>}
			</Pressable>
		</View>
	);
}

const makeListItemStyles = (rightLabel: boolean) =>
	StyleSheet.create({
		container: {
			flex: 1,
			flexDirection: "row",
			paddingVertical: 16,
			backgroundColor: "transparent",
		},
		text: {
			width: "100%",
			flex: 1,
			justifyContent: rightLabel ? "space-between" : "center",
			paddingLeft: 8,
		},
		title: { ...Typography.ListHeading, color: Colors.TextPrimary },
		label: {
			...Typography.Label,
			color: Colors.TextLabel,
			flexDirection: rightLabel ? "row" : "column",
		},
	});

interface ListProps<T> extends Partial<FlatListProps<T>> {
	data: Array<T>;
	itemStyles?: ListItemProps["style"];
	labelAlignment?: "bottom" | "right";
	onItemPress?: (item: T) => void;
	onItemPressIn?: (event: GestureResponderEvent) => void;
	onItemPressOut?: (event: GestureResponderEvent) => void;
}
export function List<T extends ListItemProps>(
	{ onItemPress = () => {}, onItemPressIn, onItemPressOut, ...props }: ListProps<T>,
) {
	const listItemStyles = makeListItemStyles(props.labelAlignment === "right");
	return (
		<FlatList
			ItemSeparatorComponent={props.ItemSeparatorComponent || ItemSeparator}
			renderItem={({ item }) => {
				const style = { ...listItemStyles, ...props.itemStyles };
				return (
					<ListItem
						onPress={() => onItemPress(item)}
						onPressIn={(event) => {
							style.container.backgroundColor = Colors.Card;
							onItemPressIn?.(event);
						}}
						onPressOut={(event) => {
							style.container.backgroundColor = "transparent";
							onItemPressOut?.(event);
						}}
						style={style}
						{...item}
					/>
				);
			}}
			{...props}
		/>
	);
}
