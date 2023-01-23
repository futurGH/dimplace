import { ReactNode, useState } from "react";
import {
	Dimensions,
	type GestureResponderEvent,
	Pressable,
	SectionList as NativeSectionList,
	type SectionListProps as NativeSectionListProps,
	TouchableOpacity,
	ViewStyle,
} from "react-native";
import { StyleSheet, Text, View } from "react-native";
import type { MixedStyleDeclaration } from "react-native-render-html";
import { ChevronDownIcon } from "../../assets/icons/chevron-down";
import { ChevronUpIcon } from "../../assets/icons/chevron-up";
import { DocumentIcon } from "../../assets/icons/document";
import { LinkIcon } from "../../assets/icons/link";
import { useColorTheme } from "../../style/ColorThemeProvider";
import type { ColorTheme } from "../../style/colorThemes";
import { Typography } from "../../style/typography";
import { Html, stripTags } from "./Html";
import { ItemSeparator } from "./ItemSeparator";
import type { ListItemProps } from "./List";
import { ListItem, makeListItemStyles } from "./List";

export type Section<T> = { title: string; label?: ReactNode; data?: Array<T> | Array<Section<T>> };
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
	const { Colors } = useColorTheme();
	const styles = createStyles(Colors);
	const [collapseMarker, setCollapseMarker] = useState(0);
	const itemStyles = makeListItemStyles(Colors, props.labelAlignment === "right");
	const listItemStyles = {
		container: {
			...itemStyles.container,
			...(props.itemStyles?.container || {}),
			marginHorizontal: 16,
			paddingVertical: 12,
		},
		title: {
			...itemStyles.title,
			...(props.itemStyles?.title || {}),
			...Typography.Body,
			color: Colors.TextSecondary,
		},
		text: { ...itemStyles.text, ...(props.itemStyles?.text || {}) },
		label: { ...itemStyles.label, ...(props.itemStyles?.label || {}) },
	};

	return (
		<NativeSectionList
			renderSectionHeader={({ section }) => {
				const collapsed = collapsedSections.includes(section.title);
				const truncateDescription = !!section.data?.length;
				const descriptionExpanded = truncateDescription
					? collapsedSections.includes(`${section.title}-description`)
					: true;
				const descriptionStyle: ViewStyle = descriptionExpanded
					? { height: "auto" }
					: { flexDirection: "row", height: 24, overflow: "hidden" };
				let description: ReactNode = section.label || null;
				if (typeof description === "string") {
					const descriptionText = descriptionExpanded ? description : stripTags(description);
					if (description.startsWith("<")) {
						description = (
							<Html
								body={descriptionText}
								width={Dimensions.get("window").width}
								numberOfLines={descriptionExpanded ? undefined : 1}
								bodyStyle={{
									...listItemStyles.title as MixedStyleDeclaration,
									color: Colors.TextSecondary,
								}}
								baseStyle={{ flexShrink: 1 }}
							/>
						);
					} else {
						description = (
							<Text
								style={listItemStyles.title}
								numberOfLines={descriptionExpanded ? undefined : 1}
							>
								{descriptionText}
							</Text>
						);
					}
					description = (
						<View style={[descriptionStyle, { marginVertical: 12 }]}>
							{description}
							{truncateDescription && (
								<TouchableOpacity
									onPress={() => {
										const index = collapsedSections.indexOf(
											`${section.title}-description`,
										);
										if (index === -1) {
											collapsedSections.push(`${section.title}-description`);
										} else collapsedSections.splice(index, 1);
										setCollapseMarker(collapseMarker + 1);
									}}
								>
									<Text
										style={[
											listItemStyles.title,
											styles.link,
											!descriptionExpanded ? { marginLeft: 12 } : { marginTop: 8 },
										]}
									>
										View {descriptionExpanded ? "less" : "more"}
									</Text>
								</TouchableOpacity>
							)}
						</View>
					);
				}
				return (
					<>
						<SectionHeader
							title={section.title}
							collapsed={collapsed}
							style={{
								marginBottom: description ? 0 : 8,
								...(nested ? Typography.Subheading : Typography.Heading),
							}}
							onPress={() => {
								const collapsedIndex = collapsedSections.indexOf(section.title);
								if (collapsedIndex !== -1) {
									collapsedSections.splice(collapsedSections.indexOf(section.title), 1);
								} else {
									collapsedSections.push(section.title);
								}
								setCollapseMarker(collapseMarker + 1);
							}}
							{...(section.showCount && { count: section.data?.length })}
						/>
						{description
							? (
								<View
									style={{
										paddingLeft: 24,
										paddingRight: 8,
										backgroundColor: Colors.Background,
									}}
								>
									{description}
									{section.data.length && section.data.some((i) => !isSection(i))
										? <ItemSeparator />
										: null}
								</View>
							)
							: null}
					</>
				);
			}}
			renderItem={({ item: _item, section, index }) => {
				const [pressed, setPressed] = useState(false);
				const backgroundColor = pressed ? Colors.Card : "transparent";
				const { showCount } = section;
				const collapsed = collapsedSections.includes(section.title);
				if (collapsed) return null;
				if (isSection(_item)) {
					const item = _item as Section<T>;
					return (
						<SectionList
							sections={[{ ...item, showCount }]}
							collapsedSections={collapsedSections}
							nested={true}
							onItemPress={onItemPress}
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
				if (typeof item.label === "string" && item.label.startsWith("<")) {
					item.label = stripTags(item.label);
				}
				return (
					<>
						{index !== 0 ? <ItemSeparator style={{ marginLeft: 24 }} /> : null}
						<ListItem
							key={item.title ? `${item.title}` : null}
							icon={icon}
							onPress={() => onItemPress(item)}
							onPressIn={(event) => {
								setPressed(true);
								onItemPressIn?.(event);
							}}
							onPressOut={(event) => {
								setPressed(false);
								onItemPressOut?.(event);
							}}
							styles={{
								...listItemStyles,
								container: { ...listItemStyles.container, backgroundColor },
							}}
							{...item}
						/>
					</>
				);
			}}
			sections={sections as never}
			keyExtractor={(item) => `${item.title}-${item.label || ""}`}
			getItemCount={(items) => items?.data?.length || items?.length || 0}
			keyboardShouldPersistTaps="handled"
			stickySectionHeadersEnabled={true}
			extraData={{ collapseMarker }}
			{...props}
		/>
	);

	function isSection(item: T | Section<T>): item is Section<T> {
		return "data" in item && item.data != null;
	}
}

const createStyles = (Colors: ColorTheme) =>
	StyleSheet.create({
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
		sectionHeaderContainer: { backgroundColor: Colors.Background, paddingTop: 8 },
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
		link: { color: Colors.Active },
	});

export interface SectionHeaderProps {
	title: string;
	count?: number;
	collapsed: boolean;
	style?: ViewStyle;
	onPress?: () => void;
}
function SectionHeader({ title, count, collapsed, style, onPress }: SectionHeaderProps) {
	const { Colors } = useColorTheme();
	const styles = createStyles(Colors);

	const ChevronIcon = collapsed ? ChevronDownIcon : ChevronUpIcon;
	const containerStyle = { ...styles.sectionHeader, ...(style || {}) };

	const [pressed, setPressed] = useState(false);
	const backgroundColor = pressed ? Colors.Button : containerStyle.backgroundColor;
	return (
		<View style={styles.sectionHeaderContainer}>
			<Pressable
				style={[containerStyle, { backgroundColor }]}
				onPress={onPress}
				onPressIn={() => setPressed(true)}
				onPressOut={() => setPressed(false)}
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
		</View>
	);
}
