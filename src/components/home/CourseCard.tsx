import { useLinkTo } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { ImageBackground, StyleSheet, Text, View } from "react-native";
import { useColorTheme } from "../../style/ColorThemeProvider";
import type { ColorTheme } from "../../style/colorThemes";
import { Typography } from "../../style/typography";
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
	const { Colors } = useColorTheme();
	console.log(Colors.Active);
	const styles = createStyles(Colors);
	const linkTo = useLinkTo();
	const courseIdFragments = id.split("/");
	const courseId = courseIdFragments[courseIdFragments.length - 1];
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
					<ImageBackground style={styles.image} source={{ uri: imageUrl }}>
						<LinearGradient
							colors={[Colors.Card + "00", Colors.Card]}
							style={styles.gradient}
						/>
					</ImageBackground>
					<Text style={styles.title}>{name}</Text>
				</View>
			}
			footer={
				<View style={styles.footer}>
					{assignments.map((props) => {
						// https://<tenant-id>.activites.api.brightspace.com/old/activities/:activityId/usages/:usage/users/:userId
						const activityIdFragments = props.id.split("/");
						const activityId = activityIdFragments[activityIdFragments.length - 5];
						const usage = activityIdFragments[activityIdFragments.length - 3];
						const userId = activityIdFragments[activityIdFragments.length - 1];
						return (
							<CourseCardAssignment
								key={props.name}
								onPress={() => {
									linkTo(
										`/courses/${courseId}/assignments/${activityId}/usages/${usage}/users/${userId}`,
									);
								}}
								{...props}
							/>
						);
					})}
				</View>
			}
			onPress={() => linkTo("/courses/" + courseId)}
		/>
	);
}

const createStyles = (Colors: ColorTheme) =>
	StyleSheet.create({
		content: { width: "100%", flex: 1, justifyContent: "center", paddingHorizontal: 16 },
		image: {
			height: 96,
			flex: 1,
			justifyContent: "center",
			alignItems: "center",
			resizeMode: "cover",
			borderRadius: 16,
			overflow: "hidden",
		},
		gradient: { width: "100%", height: "100%" },
		title: {
			...Typography.Subheading,
			color: Colors.TextPrimary,
			maxWidth: "100%",
			marginTop: 16,
		},
		footer: { backgroundColor: Colors.Button, width: "100%", flex: 1, flexShrink: 1 },
	});
