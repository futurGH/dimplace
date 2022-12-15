import { useNavigation, useRoute } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { gqlClient } from "../../../api/gqlClient";
import { Container } from "../../../components/layout/Container";
import { Header } from "../../../components/layout/Header";
import { HeaderlessContainer } from "../../../components/layout/HeaderlessContainer";
import type { AssignmentFragment } from "../../../gql/graphql";
import { useStoreActions, useStoreState } from "../../../store/store";
import { Colors, Typography } from "../../../styles";
import { handleErrors } from "../../../util/errors";
import { formatDate, getYearStartAndEnd } from "../../../util/formatDate";
import { formatGrade } from "../../../util/formatGrade";
import { CoursePageHeaderLeftButton, CoursePageHeaderRightButton } from "../CourseNavigation";
import { COURSE_ASSIGNMENTS_QUERY } from "./CourseAssignments";
import type { CourseAssignmentsStackScreenProps } from "./CourseAssignmentsStack";

export function CourseAssignmentView() {
	const route = useRoute<CourseAssignmentsStackScreenProps<"CourseAssignmentView">["route"]>();
	const navigation = useNavigation();
	const { activityId, orgName, orgId } = route.params;
	if (!activityId) {
		navigation.canGoBack() ? navigation.goBack() : navigation.navigate("Home");
	}
	const config = useStoreState((state) => state.config);
	const configActions = useStoreActions((actions) => actions.config);

	const { data, error, isLoading } = useQuery({
		queryKey: ["courseAssignments", { orgId }],
		queryFn: () => {
			gqlClient.setHeader("Authorization", "Bearer " + config.accessToken);
			const { start, end } = getYearStartAndEnd();
			return gqlClient.request(COURSE_ASSIGNMENTS_QUERY, {
				startDate: start.toISOString(),
				endDate: end.toISOString(),
				orgId,
			});
		},
		retry: (failureCount, error) => {
			return handleErrors({
				error,
				failureCount,
				navigation,
				config,
				actions: configActions,
			});
		},
	});

	if (isLoading) {
		return (
			<HeaderlessContainer
				style={{ justifyContent: "center", alignItems: "center", height: "100%" }}
			>
				<ActivityIndicator />
			</HeaderlessContainer>
		);
	}

	if (error || !data?.activities || !data?.userGrades) {
		handleErrors({ error, navigation, config, actions: configActions });
		return null;
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
					headerLeft: () => <CoursePageHeaderLeftButton text="" />,
					headerRight: () => (
						<CoursePageHeaderRightButton url={assignment?.source?.url} />
					),
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

const styles = StyleSheet.create({
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
	feedbackText: { ...Typography.Body, lineHeight: 22, color: Colors.TextPrimary, marginTop: 16 },
});
