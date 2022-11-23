export const Colors = {
	Background: "#131720",
	Button: "#1F2937",
	Input: "#1A212E",
	Card: "#181D2B",
	Border: "#2F3846",
	TextPrimary: "#E5E7EB",
	TextSecondary: "#D1D5DB",
	TextLabel: "#9CA3AF",
	Inactive: "#6B7280",
	Active: "#06B6D4",
} as const;

export const Typography = {
	Caption: { fontSize: 12, fontFamily: "WorkRegular", lineHeight: 16 },
	Label: { fontSize: 13, fontFamily: "WorkRegular", lineHeight: 18 },
	Footnote: { fontSize: 13, fontFamily: "WorkMedium", lineHeight: 18 },
	Body: { fontSize: 15, fontFamily: "WorkRegular", lineHeight: 20 },
	// not a fan of this naming; it's the name of an assignment, grade, or content item
	ListHeading: { fontSize: 17, fontFamily: "WorkRegular", lineHeight: 22 },
	Subheading: { fontSize: 17, fontFamily: "WorkMedium", lineHeight: 22 },
	Heading: { fontSize: 18, fontFamily: "WorkMedium", lineHeight: 24 },
	Title: { fontSize: 20, fontFamily: "WorkMedium", lineHeight: 25 },
};
