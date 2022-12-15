import { Pressable, StyleSheet, Text } from "react-native";
import { Colors, Typography } from "../../styles";
import { formatDate } from "../../util/formatDate";

export interface CourseCardAssignmentProps {
	id: string;
	name: string;
	dueDate: Date;
	onPress?: () => void;
}
export function CourseCardAssignment({ name, dueDate, onPress }: CourseCardAssignmentProps) {
	const due = formatDate(dueDate);
	return (
		<Pressable style={styles.container} onPress={onPress}>
			<Text numberOfLines={1} style={styles.name}>{name}</Text>
			<Text style={styles.dueDate}>Due {due}</Text>
		</Pressable>
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
