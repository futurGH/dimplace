export const Typography = {
	Caption: { fontSize: 12, fontFamily: "WorkRegular", lineHeight: 16 },
	Label: { fontSize: 13, fontFamily: "WorkRegular", lineHeight: 18 },
	Footnote: { fontSize: 13, fontFamily: "WorkMedium", lineHeight: 18 },
	Body: { fontSize: 15, fontFamily: "WorkRegular", lineHeight: 22 },
	Callout: { fontSize: 15, fontFamily: "WorkMedium", lineHeight: 22 },
	// not a fan of this naming; it's the name of an assignment, grade, or content item
	ListHeading: { fontSize: 17, fontFamily: "WorkRegular", lineHeight: 22 },
	Subheading: { fontSize: 17, fontFamily: "WorkMedium", lineHeight: 22 },
	Heading: { fontSize: 18, fontFamily: "WorkMedium", lineHeight: 24 },
	Title: { fontSize: 20, fontFamily: "WorkMedium", lineHeight: 25 },
} as const satisfies Record<string, { fontSize: number; fontFamily: string; lineHeight: number }>;
