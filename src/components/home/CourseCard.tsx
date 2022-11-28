import { useLinkTo } from "@react-navigation/native";
import { Image, StyleSheet, Text, View } from "react-native";
import { Colors, Typography } from "../../styles";
import { Card } from "../elements/Card";
import type { CourseCardAssignmentProps } from "./CourseCardAssignment";
import { CourseCardAssignment } from "./CourseCardAssignment";

export interface CourseCardProps {
	id: string;
	name: string;
	imageUrl: string;
	assignments: Array<CourseCardAssignmentProps>;
}
export function CourseCard({ id, name, imageUrl, assignments }: CourseCardProps) {
	const linkTo = useLinkTo();
	return (
		<Card
			content={
				<View
					style={[
						styles.content,
						assignments.length
							? { paddingVertical: 24 }
							: { paddingTop: 24, paddingBottom: 20 },
					]}
				>
					<Image style={styles.image} source={{ uri: imageUrl }} />
					<Text style={styles.title}>{name}</Text>
				</View>
			}
			footer={
				<View style={styles.footer}>
					{assignments.map((props) => <CourseCardAssignment {...props} />)}
				</View>
			}
			onPress={() => linkTo("/courses/" + id)}
		/>
	);
}

const styles = StyleSheet.create({
	content: { width: "100%", flex: 1, justifyContent: "center", paddingHorizontal: 16 },
	image: { height: 96, resizeMode: "cover", borderRadius: 16 },
	title: { ...Typography.Subheading, color: Colors.TextPrimary, maxWidth: "100%", marginTop: 20 },
	footer: { backgroundColor: Colors.Button, width: "100%", flex: 1, flexShrink: 1 },
});
