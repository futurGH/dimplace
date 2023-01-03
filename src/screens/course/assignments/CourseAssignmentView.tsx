import { useNavigation, useRoute } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { Container } from "../../../components/layout/Container";
import { Header } from "../../../components/layout/Header";
import { HeaderlessContainer } from "../../../components/layout/HeaderlessContainer";
import type { AssignmentFragment } from "../../../gql/graphql";
import { useStoreActions, useStoreState } from "../../../store/store";
import { useColorTheme } from "../../../style/ColorThemeProvider";
import type { ColorTheme } from "../../../style/colorThemes";
import { Typography } from "../../../style/typography";
import { handleErrors } from "../../../util/errors";
import { formatDate } from "../../../util/formatDate";
import { formatGrade } from "../../../util/formatGrade";
import { query } from "../../../util/query";
import { CoursePageHeaderLeftButton, CoursePageHeaderRightButton } from "../CourseNavigation";
import { fetchCourseAssignments } from "./CourseAssignments";
import type { CourseAssignmentsStackScreenProps } from "./CourseAssignmentsStack";

export function CourseAssignmentView() {
	const { Colors } = useColorTheme();
	const styles = createStyles(Colors);

	const route = useRoute<CourseAssignmentsStackScreenProps<"CourseAssignmentView">["route"]>();
	const navigation = useNavigation<
		CourseAssignmentsStackScreenProps<"CourseAssignmentView">["navigation"]
	>();
	const config = useStoreState((state) => state.config);
	const configActions = useStoreActions((actions) => actions.config);

	const { orgName, orgId } = route.params || {};
	let activityId: string;
	if (route.params.usage && route.params.userId && route.params.activityId) {
		// Got here via deep link
		activityId =
			`https://${config.tenantId}.activities.api.brightspace.com/old/activities/${route.params.activityId}/usages/${route.params.usage}/users/${route.params.userId}`;
	} else if (route.params.activityId) {
		// Got here via navigator; most likely assignments list
		activityId = route.params.activityId;
	} else if (!config.__DEMO__) {
		navigation.canGoBack() ? navigation.goBack() : navigation.navigate("Home");
		return null;
	}

	const errorHandling = (error: unknown) =>
		handleErrors({ error, navigation, config, actions: configActions });
	const { data, error, isLoading } = useQuery({
		queryKey: ["courseAssignments", {
			accessToken: config.accessToken,
			orgId,
			demoMode: config.__DEMO__,
		}],
		queryFn: query(errorHandling, fetchCourseAssignments),
	});

	if (isLoading || error || !data) {
		return (
			<HeaderlessContainer
				style={{ justifyContent: "center", alignItems: "center", height: "100%" }}
			>
				<ActivityIndicator />
			</HeaderlessContainer>
		);
	}

	const assignment = (data.activities as Array<AssignmentFragment>).find((a) =>
		a.id === activityId
	);
	if (!assignment) {
		navigation.canGoBack() ? navigation.goBack() : navigation.navigate("Home");
		return null;
	}

	const title = assignment.source?.name;
	const dueDate = assignment.dueDate ? formatDate(new Date(assignment.dueDate)) : null;
	const grade = data.userGrades.find((g) => g.activity?.id === activityId);
	const gradeValue = grade?.value ? formatGrade(grade.value) : null;
	const feedbackText = grade?.feedback?.text || assignment.feedback?.text;
	const weight = assignment.gradeInfo?.type === "weighted"
		? assignment.gradeInfo?.value
			? new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(
				assignment.gradeInfo.value,
			)
			: null
		: null;

	return (
		<Container>
			<Header
				route={{ name: orgName }}
				options={{
					headerLeft: () => (
						<CoursePageHeaderLeftButton
							text=""
							onPress={() =>
								navigation.navigate("CourseAssignments", { orgId, orgName })}
						/>
					),
					headerRight: () => <CoursePageHeaderRightButton
						url={assignment?.source?.url}
					/>,
				}}
				paddingTop={0}
			/>
			<View style={styles.content}>
				<View>
					{title ? <Text style={styles.title}>{title}</Text> : null}
					{dueDate ? <Text style={styles.dueDate}>Due {dueDate}</Text> : null}
					{grade?.value ? <Text style={styles.grade}>{gradeValue}</Text> : null}
					{weight ? <Text style={styles.weight}>Weight: {weight}%</Text> : null}
				</View>
				{feedbackText
					? (
						<View style={styles.feedbackContainer}>
							<Text style={styles.feedbackTitle}>Feedback</Text>
							<Text style={styles.feedbackText}>{feedbackText}</Text>
						</View>
					)
					: null}
			</View>
		</Container>
	);
}

const createStyles = (Colors: ColorTheme) =>
	StyleSheet.create({
		content: { marginTop: 24 },
		title: { ...Typography.Subheading, color: Colors.TextPrimary },
		dueDate: { ...Typography.Body, color: Colors.TextLabel, marginTop: 4 },
		grade: {
			fontSize: 28,
			lineHeight: 34,
			fontFamily: "WorkMedium",
			color: Colors.Active,
			marginTop: 10,
		},
		weight: { ...Typography.Body, color: Colors.TextLabel },
		feedbackContainer: { marginTop: 32 },
		feedbackTitle: { ...Typography.Subheading, color: Colors.TextLabel },
		feedbackText: {
			...Typography.Body,
			lineHeight: 22,
			color: Colors.TextPrimary,
			marginTop: 16,
		},
	});
