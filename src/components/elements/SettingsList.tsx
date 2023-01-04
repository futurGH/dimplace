import type { Computed } from "easy-peasy";
import type { ReactNode } from "react";
import type { FlatListProps } from "react-native";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import type { Setting, Settings, SettingsTypeMap } from "../../store/settingsModel";
import { useStoreActions } from "../../store/store";
import { useColorTheme } from "../../style/ColorThemeProvider";
import type { ColorTheme } from "../../style/colorThemes";
import { ColorThemes } from "../../style/colorThemes";
import { Typography } from "../../style/typography";
import { ToggleSwitch } from "./ToggleSwitch";

export type SettingsListItemProps<T extends keyof SettingsTypeMap = keyof SettingsTypeMap> = {
	key: keyof Settings;
	type: T;
	title: string;
	value: SettingsTypeMap[T];
	description?: string | ReactNode;
	first?: boolean;
	last?: boolean;
	enabled?: boolean | Computed<any, boolean>;
	onValueChange?: (value: SettingsTypeMap[T]) => void;
};
export function SettingsListItem<T extends keyof SettingsTypeMap>(
	{ type, title, description, first = false, last = false, enabled = true, value, onValueChange }:
		SettingsListItemProps<T>,
) {
	const { Colors, setColors } = useColorTheme();
	const listItemStyles = createListItemStyles(Colors);
	let rightSide: ReactNode = null;
	if (type === "boolean" && typeof value === "boolean") {
		rightSide = (
			<ToggleSwitch
				value={value}
				disabled={!enabled}
				onToggle={(newValue) => {
					// @ts-expect-error
					onValueChange?.(newValue);
				}}
			/>
		);
	} else if (type === "colorTheme" && typeof value === "string") {
		const currentThemeName = value as keyof typeof ColorThemes;
		const currentTheme = ColorThemes[currentThemeName];
		const colorThemes = Object.keys(ColorThemes) as Array<keyof typeof ColorThemes>;
		rightSide = (
			<View style={{ flexDirection: "row" }}>
				{colorThemes.map((themeName, index) => {
					const theme = ColorThemes[themeName];
					return (
						<Pressable
							key={themeName}
							style={[
								{ width: 28, height: 28, borderRadius: 999, backgroundColor: theme.Active },
								themeName === currentThemeName
								&& { borderWidth: 2, borderColor: currentTheme.TextPrimary },
								index !== 0 && { marginLeft: 16 },
							]}
							onPress={() => {
								setColors(themeName);
							}}
						/>
					);
				})}
			</View>
		);
	}
	return (
		<>
			<View
				style={[
					listItemStyles.container,
					first ? listItemStyles.first : listItemStyles.middle,
					(description || last) ? listItemStyles.last : null,
				]}
			>
				<Text numberOfLines={1} style={listItemStyles.title}>{title}</Text>
				{rightSide}
			</View>
			{description ? <Text style={listItemStyles.description}>{description}</Text> : null}
		</>
	);
}

const createListItemStyles = (Colors: ColorTheme) =>
	StyleSheet.create({
		container: {
			flex: 1,
			flexDirection: "row",
			alignItems: "center",
			justifyContent: "space-between",
			padding: 16,
			backgroundColor: Colors.Card,
		},
		first: { borderTopLeftRadius: 16, borderTopRightRadius: 16, marginTop: 24 },
		middle: { borderTopWidth: 1, borderTopColor: Colors.Border },
		last: { borderBottomLeftRadius: 16, borderBottomRightRadius: 16 },
		title: { ...Typography.ListHeading, color: Colors.TextPrimary },
		description: {
			...Typography.Caption,
			color: Colors.TextLabel,
			width: "100%",
			marginTop: 12,
			paddingHorizontal: 16,
		},
	});

export function SettingsList<
	T extends Setting & { key: keyof Settings; name: string; first: boolean; last: boolean },
>(props: Partial<FlatListProps<T>> & { data: Array<T> }) {
	const settings = useStoreActions((actions) => actions.settings);
	return (
		<FlatList
			keyboardShouldPersistTaps="handled"
			renderItem={({ item: setting }) => {
				return (
					<SettingsListItem
						key={setting.key}
						type={setting.type}
						title={setting.name}
						first={setting.first}
						last={setting.last}
						description={setting.description}
						value={setting.value}
						enabled={setting.enabled}
						onValueChange={(value: SettingsTypeMap[keyof SettingsTypeMap]) => {
							// @ts-expect-error
							settings.set([setting.key, value]);
						}}
					/>
				);
			}}
			{...props}
		/>
	);
}
