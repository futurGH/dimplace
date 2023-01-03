import { Pressable, StyleSheet, Text } from "react-native";
import { useColorTheme } from "../../style/ColorThemeProvider";
import type { ColorTheme } from "../../style/colorThemes";
import { Typography } from "../../style/typography";
import { formatDate } from "../../util/formatDate";

export interface CourseCardAssignmentProps {
	id: string;
	name: string;
	dueDate: Date;
	highlightOverdue?: boolean;
	onPress?: () => void;
}
export function CourseCardAssignment(
	{ name, dueDate, highlightOverdue = false, onPress }: CourseCardAssignmentProps,
) {
	const { Colors } = useColorTheme();
	const styles = createStyles(Colors);
	const due = formatDate(dueDate);
	const overdue = highlightOverdue && dueDate < new Date();
	return (
		<Pressable
			style={[styles.container, overdue && { backgroundColor: Colors.ErrorBackground }]}
			onPress={onPress}
		>
			<Text numberOfLines={1} style={styles.name}>{name}</Text>
			<Text style={styles.dueDate}>Due {due}</Text>
		</Pressable>
	);
}

const createStyles = (Colors: ColorTheme) =>
	StyleSheet.create({
		container: {
			flex: 1,
			flexDirection: "row",
			justifyContent: "space-between",
			alignItems: "center",
			paddingHorizontal: 16,
			paddingVertical: 12,
		},
		name: { ...Typography.Footnote, color: Colors.TextPrimary, maxWidth: "80%" },
		dueDate: { ...Typography.Label, color: Colors.TextLabel },
	});
