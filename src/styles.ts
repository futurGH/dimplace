export const Colors = {
	Background: "#131720",
	Card: "#181D2B",
	Border: "#374151",
	TextPrimary: "#E5E7EB",
	TextSecondary: "#D1D5DB",
	TextLabel: "#9CA3AF",
	Inactive: "#6B7280",
	Active: "#06B6D4",
} as const;

export const FontWeight = { Regular: 400, Medium: 500, Bold: 700 } as const;

export const Text = {
	Caption: { fontSize: 12, fontWeight: FontWeight.Regular },
	Label: { fontSize: 13, fontWeight: FontWeight.Regular },
	Footnote: { fontSize: 13, fontWeight: FontWeight.Medium },
	Body: { fontSize: 15, fontWeight: FontWeight.Regular },
	// not a fan of this naming; it's the name of an assignment, grade, or content item
	ListHeading: { fontSize: 17, fontWeight: FontWeight.Regular },
	Subheading: { fontSize: 17, fontWeight: FontWeight.Medium },
	Heading: { fontSize: 18, fontWeight: FontWeight.Medium },
	Title: { fontSize: 20, fontWeight: FontWeight.Medium },
} as const;
