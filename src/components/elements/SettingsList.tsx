import type { Computed } from "easy-peasy";
import type { ReactNode } from "react";
import type { FlatListProps } from "react-native";
import { FlatList, StyleSheet, Text, View } from "react-native";
import type { Setting, Settings, SettingsTypeMap } from "../../store/settingsModel";
import { useStoreActions } from "../../store/store";
import { Colors, Typography } from "../../styles";
import { ToggleSwitch } from "./ToggleSwitch";

export type SettingsListItemProps<T extends keyof SettingsTypeMap = keyof SettingsTypeMap> = {
	key: keyof Settings;
	type: T;
	title: string;
	value: SettingsTypeMap[T];
	description?: string | ReactNode;
	first?: boolean;
	enabled?: boolean | Computed<any, boolean>;
	onValueChange?: (value: SettingsTypeMap[T]) => void;
};
export function SettingsListItem<T extends keyof SettingsTypeMap>(
	{ type, title, description, first = false, enabled = true, value, onValueChange }:
		SettingsListItemProps<T>,
) {
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
	}
	return (
		<>
			<View
				style={[
					listItemStyles.container,
					first ? listItemStyles.first : listItemStyles.middle,
					description ? listItemStyles.last : null,
				]}
			>
				<Text numberOfLines={1} style={listItemStyles.title}>{title}</Text>
				{rightSide}
			</View>
			{description ? <Text style={listItemStyles.description}>{description}</Text> : null}
		</>
	);
}

const listItemStyles = StyleSheet.create({
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
	T extends Setting & { key: keyof Settings; name: string; first: boolean },
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
