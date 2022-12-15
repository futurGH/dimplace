export function formatGrade(grade?: string | null | undefined) {
	return grade?.replace(/\s/g, "") || "-/-";
}
