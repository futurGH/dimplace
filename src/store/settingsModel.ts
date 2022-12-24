import { Action, action, Computed, computed } from "easy-peasy";

export const TimeUnits = { Minutes: 60, Hours: 3600, Days: 86400 } as const;
export type TimeUnits = typeof TimeUnits[keyof typeof TimeUnits];
export type SettingsTypeMap = { boolean: boolean; time: { number: number; unit: TimeUnits } };
export type Setting<T extends keyof SettingsTypeMap = keyof SettingsTypeMap> = {
	name: string;
	type: T;
	description?: string;
	value: SettingsTypeMap[T];
	enabled: boolean | Computed<SettingsModel, boolean, { settings: SettingsModel }>;
};
export type TransformSettings<T extends Record<string, keyof SettingsTypeMap>> = {
	[K in keyof T]: Setting<T[K]>;
};
export type Settings = TransformSettings<
	{ highlightOverdueAssignments: "boolean"; showOverdueAssignments: "boolean" }
>;

export type SettingsModel = Settings & {
	set: {
		[K in keyof Settings]: Action<SettingsModel, [name: K, value: Settings[K]["value"]]>;
	}[keyof Settings];
};

export const settingsModel = {
	highlightOverdueAssignments: {
		name: "Highlight overdue assignments",
		type: "boolean",
		value: false,
		enabled: computed(
			[(_, state) => state.settings.showOverdueAssignments],
			(showOverdue) => showOverdue.value,
		),
	},
	showOverdueAssignments: {
		name: "Show overdue assignments",
		type: "boolean",
		description:
			"Show overdue assignments on the home page. Assignments are always visible in Course Assignments.",
		value: true,
		enabled: true,
	},
	// @ts-expect-error
	set: action((settings, [name, value]) => {
		settings[name].value = value;
	}),
} satisfies SettingsModel;
