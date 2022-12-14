import type { ReactNode } from "react";
import { useState } from "react";
import type { FlatListProps, GestureResponderEvent, TextStyle, ViewStyle } from "react-native";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { Colors, Typography } from "../../styles";
import { ItemSeparator } from "./ItemSeparator";

export interface ListItemProps {
	title: string;
	icon?: ReactNode;
	label?: string;
	numberOfLines?: number;
	onPress?: (event: GestureResponderEvent) => void;
	onPressIn?: (event: GestureResponderEvent) => void;
	onPressOut?: (event: GestureResponderEvent) => void;
	styles?: {
		container?: ViewStyle;
		text?: ViewStyle;
		icon?: ViewStyle;
		title?: TextStyle;
		label?: TextStyle;
	};
}
export function ListItem(
	{ icon = null, title, label, numberOfLines, onPress, onPressIn, onPressOut, styles = {} }:
		ListItemProps,
) {
	const [backgroundColor, setBackground] = useState("transparent");
	return (
		<View style={{ ...styles.container, backgroundColor }}>
			{icon}
			<Pressable
				style={styles.text}
				onPress={onPress}
				onPressIn={(event) => {
					setBackground(Colors.Card);
					onPressIn?.(event);
				}}
				onPressOut={(event) => {
					setBackground("transparent");
					onPressOut?.(event);
				}}
			>
				<Text numberOfLines={numberOfLines} style={styles.title}>{title}</Text>
				{label && <Text style={styles.label}>{label}</Text>}
			</Pressable>
		</View>
	);
}

export const makeListItemStyles = (rightLabel: boolean) =>
	StyleSheet.create({
		container: {
			maxWidth: "100%",
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
	itemStyles?: ListItemProps["styles"];
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
			keyboardShouldPersistTaps="handled"
			renderItem={({ item }) => {
				return (
					<ListItem
						onPress={() => onItemPress(item)}
						styles={{ ...listItemStyles, ...props.itemStyles }}
						{...item}
					/>
				);
			}}
			{...props}
		/>
	);
}
