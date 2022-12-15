export function formatDate(date: Date) {
	return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(date);
}

export function formatDateAndTime(date: Date) {
	return new Intl.DateTimeFormat("en-US", {
		month: "short",
		day: "numeric",
		hour: "numeric",
		minute: "numeric",
	}).format(date).replace(" at ", ", ");
}

export function getYearStartAndEnd(): { start: Date; end: Date } {
	const date = new Date();
	const currentYear = date.getFullYear();
	const currentMonth = date.getMonth();
	const isAfterNewYear = currentMonth <= 7;
	const startYear = isAfterNewYear ? currentYear - 1 : currentYear;
	const endYear = isAfterNewYear ? currentYear : currentYear + 1;
	const start = new Date(startYear, 8, 1);
	const end = new Date(endYear, 6, 1);
	return { start, end };
}
