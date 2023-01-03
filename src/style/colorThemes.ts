export type ColorName =
	| "Background"
	| "Card"
	| "Input"
	| "Button"
	| "Border"
	| "TextPrimary"
	| "TextSecondary"
	| "TextLabel"
	| "Inactive"
	| "Active"
	| "ErrorBackground";
export type ColorTheme = Record<ColorName, string>;
export type ColorThemeName = keyof typeof ColorThemes;
export const ColorThemes = {
	Sapphire: {
		Background: "#131720",
		Card: "#181D2B",
		Input: "#1A212E",
		Button: "#1F2937",
		Border: "#2F3846",
		TextPrimary: "#E5E7EB",
		TextSecondary: "#D1D5DB",
		TextLabel: "#9CA3AF",
		Inactive: "#6B7280",
		Active: "#06B6D4",
		ErrorBackground: "#371F1F",
	},
	Amethyst: {
		Background: "#19121D",
		Card: "#201921",
		Input: "#201A24",
		Button: "#27212D",
		Border: "#302834",
		TextPrimary: "#E5E0E5",
		TextSecondary: "#D8D1DB",
		TextLabel: "#A7A1AA",
		Inactive: "#737074",
		Active: "#E273D7",
		ErrorBackground: "#371F1F",
	},
	Emerald: {
		Background: "#141815",
		Card: "#171C19",
		Input: "#1C221C",
		Button: "#1F261F",
		Border: "#222925",
		TextPrimary: "#E0E5E0",
		TextSecondary: "#D2DBD1",
		TextLabel: "#868A86",
		Inactive: "#717470",
		Active: "#10B981",
		ErrorBackground: "#32251E",
	},
} as const satisfies Record<string, ColorTheme>;
