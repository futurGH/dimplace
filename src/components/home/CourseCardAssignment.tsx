import { StyleSheet, Text, View } from "react-native";
import { Colors, Typography } from "../../styles";

export interface CourseCardAssignmentProps {
	name: string;
	dueDate: Date;
}
export function CourseCardAssignment({ name, dueDate }: CourseCardAssignmentProps) {
	const due = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(
		dueDate,
	);
	return (
		<View style={styles.container}>
			<Text numberOfLines={1} style={styles.name}>{name}</Text>
			<Text style={styles.dueDate}>{due}</Text>
		</View>
	);
}

const styles = StyleSheet.create({
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
