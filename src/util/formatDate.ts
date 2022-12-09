export function formatDate(date: Date) {
	return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(date);
}
