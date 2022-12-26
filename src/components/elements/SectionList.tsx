import { useState } from "react";
import {
	type GestureResponderEvent,
	Pressable,
	SectionList as NativeSectionList,
	type SectionListProps as NativeSectionListProps,
	ViewStyle,
} from "react-native";
import { StyleSheet, Text, View } from "react-native";
import { ChevronDownIcon } from "../../assets/icons/chevron-down";
import { ChevronUpIcon } from "../../assets/icons/chevron-up";
import { DocumentIcon } from "../../assets/icons/document";
import { LinkIcon } from "../../assets/icons/link";
import { Colors, Typography } from "../../styles";
import { ItemSeparator } from "./ItemSeparator";
import type { ListItemProps } from "./List";
import { ListItem, makeListItemStyles } from "./List";

export type Section<T> = { title: string; data?: Array<T> | Array<Section<T>> };
export interface SectionListProps<T extends ListItemProps>
	extends Omit<Partial<NativeSectionListProps<T>>, "sections">
{
	sections: Array<Section<T> & { showCount?: boolean }>;
	itemStyles?: ListItemProps["styles"];
	labelAlignment?: "bottom" | "right";
	onItemPress?: (item: T) => void;
	onItemPressIn?: (event: GestureResponderEvent) => void;
	onItemPressOut?: (event: GestureResponderEvent) => void;
	nested?: boolean;
	collapsedSections: Array<string>;
}
export function SectionList<T extends ListItemProps>(
	{
		onItemPress = () => {},
		onItemPressIn,
		onItemPressOut,
		sections,
		nested = false,
		collapsedSections,
		...props
	}: SectionListProps<T>,
) {
	const [collapseMarker, setCollapseMarker] = useState(0);
	const listItemStyles = makeListItemStyles(props.labelAlignment === "right");

	return (
		<NativeSectionList
			renderSectionHeader={({ section }) => {
				const collapsed = collapsedSections.includes(section.title);
				return (
					<SectionHeader
						title={section.title}
						collapsed={collapsed}
						style={{
							marginTop: 8,
							marginBottom: 8,
							...(nested ? Typography.Subheading : Typography.Heading),
						}}
						onPress={() => {
							const collapsed = collapsedSections.includes(section.title);
							if (collapsed) {
								collapsedSections.splice(
									collapsedSections.indexOf(section.title),
									1,
								);
							} else {
								collapsedSections.push(section.title);
							}
							setCollapseMarker(collapseMarker + 1);
						}}
						{...(section.showCount && { count: section.data?.length })}
					/>
				);
			}}
			renderItem={({ item: _item, section, index }) => {
				const [backgroundColor, setBackground] = useState("transparent");
				const { showCount } = section;
				const collapsed = collapsedSections.includes(section.title);
				if (collapsed) return null;
				if (isSection(_item)) {
					const item = _item as Section<T>;
					return (
						<SectionList
							sections={[{ title: item.title, data: item.data, showCount }]}
							collapsedSections={collapsedSections}
							nested={true}
							{...props}
							style={[props.style, { marginLeft: 16 }]}
						/>
					);
				}
				const item = _item as T;
				let icon = <LinkIcon {...styles.icon} />;
				if ("type" in item && typeof item.type === "string") {
					if (
						item.type.endsWith("pdf")
						|| item.type.endsWith("document")
						|| item.type.endsWith("presentation")
					) {
						icon = <DocumentIcon {...styles.icon} />;
					}
				}
				return (
					<>
						{index !== 0 ? <ItemSeparator style={{ marginLeft: 24 }} /> : null}
						<ListItem
							key={item.title ? `${item.title}` : null}
							icon={icon}
							onPress={() => onItemPress(item)}
							onPressIn={(event) => {
								setBackground(Colors.Card);
								onItemPressIn?.(event);
							}}
							onPressOut={(event) => {
								setBackground("transparent");
								onItemPressOut?.(event);
							}}
							styles={{
								container: {
									...listItemStyles.container,
									...(props.itemStyles?.container || {}),
									backgroundColor,
									marginHorizontal: 16,
									paddingVertical: 12,
								},
								title: {
									...listItemStyles.title,
									...(props.itemStyles?.title || {}),
									...Typography.Body,
									color: Colors.TextSecondary,
								},
								text: { ...listItemStyles.text, ...(props.itemStyles?.text || {}) },
								label: {
									...listItemStyles.label,
									...(props.itemStyles?.label || {}),
								},
							}}
							{...item}
						/>
					</>
				);
			}}
			sections={sections as never}
			keyExtractor={(item) => `${item.title}-${item.label}`}
			getItemCount={(items) => items?.data?.length || items?.length || 0}
			keyboardShouldPersistTaps="handled"
			stickySectionHeadersEnabled={false}
			extraData={{ collapseMarker }}
			{...props}
		/>
	);

	function isSection(item: T | Section<T>): item is Section<T> {
		return "data" in item && item.data != null;
	}
}

const styles = StyleSheet.create({
	sectionList: { width: "100%", marginBottom: 32 },
	sectionHeader: {
		backgroundColor: Colors.Card,
		borderColor: Colors.Border,
		borderWidth: 1,
		borderRadius: 32,
		maxWidth: "100%",
		flexDirection: "row",
		justifyContent: "space-between",
		paddingHorizontal: 16,
		paddingVertical: 8,
	},
	titleContainer: { flexDirection: "row", alignItems: "center", maxWidth: "80%" },
	sectionTitle: { ...Typography.Heading, color: Colors.TextPrimary },
	countBadge: {
		backgroundColor: Colors.Border,
		width: 18,
		height: 18,
		justifyContent: "center",
		alignItems: "center",
		marginLeft: 12,
		borderRadius: 99,
	},
	countText: { ...Typography.Caption, fontFamily: "WorkMedium", color: Colors.TextLabel },
	icon: { width: 20, height: 20, marginTop: 3, fill: Colors.TextPrimary },
});

export interface SectionHeaderProps {
	title: string;
	count?: number;
	collapsed: boolean;
	style?: ViewStyle;
	onPress?: () => void;
}
function SectionHeader({ title, count, collapsed, style, onPress }: SectionHeaderProps) {
	const ChevronIcon = collapsed ? ChevronDownIcon : ChevronUpIcon;
	const containerStyle = { ...styles.sectionHeader, ...(style || {}) };
	const [backgroundColor, setBgColor] = useState(containerStyle.backgroundColor);
	return (
		<Pressable
			style={[containerStyle, { backgroundColor }]}
			onPress={onPress}
			onPressIn={() => setBgColor(Colors.Button)}
			onPressOut={() => setBgColor(containerStyle.backgroundColor)}
		>
			<View style={styles.titleContainer}>
				<Text numberOfLines={1} style={styles.sectionTitle}>{title}</Text>
				{count
					? (
						<View style={styles.countBadge}>
							<Text style={styles.countText}>{count}</Text>
						</View>
					)
					: null}
			</View>
			{count ? <ChevronIcon {...styles.icon} /> : null}
		</Pressable>
	);
}
