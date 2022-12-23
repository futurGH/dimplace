import { useNavigation, useRoute } from "@react-navigation/native";
import { QueryFunctionContext, useQuery } from "@tanstack/react-query";
import { ActivityIndicator, StyleSheet } from "react-native";
import { gqlClient } from "../../../api/gqlClient";
import { WriteIcon } from "../../../assets/icons/write";
import type { ListItemProps } from "../../../components/elements/List";
import { List } from "../../../components/elements/List";
import { Container } from "../../../components/layout/Container";
import { HeaderlessContainer } from "../../../components/layout/HeaderlessContainer";
import { graphql } from "../../../gql";
import type { AssignmentFragment, CourseAssignmentsQuery } from "../../../gql/graphql";
import { useStoreActions, useStoreState } from "../../../store/store";
import { Colors, Typography } from "../../../styles";
import { handleErrors } from "../../../util/errors";
import { formatDate, getYearStartAndEnd } from "../../../util/formatDate";
import { formatGrade } from "../../../util/formatGrade";
import { useRefreshing } from "../../../util/useRefreshing";
import type { CourseAssignmentsStackScreenProps } from "./CourseAssignmentsStack";

export function CourseAssignments() {
	const route = useRoute<CourseAssignmentsStackScreenProps<"CourseAssignments">["route"]>();
	const navigation = useNavigation<
		CourseAssignmentsStackScreenProps<"CourseAssignments">["navigation"]
	>();
	const config = useStoreState((state) => state.config);
	const configActions = useStoreActions((actions) => actions.config);
	const { orgId, orgName } = route.params || {};

	const { data, error, isLoading, refetch } = useQuery({
		queryKey: ["courseAssignments", {
			accessToken: config.accessToken,
			orgId,
			demoMode: config.__DEMO__,
		}],
		queryFn: fetchCourseAssignments,
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
	const errorHandling = (error: unknown) =>
		handleErrors({ error, navigation, config, actions: configActions });
	const [isRefreshing, refresh] = useRefreshing(refetch, errorHandling);

	if (isLoading && !isRefreshing) {
		return (
			<HeaderlessContainer
				style={{ justifyContent: "center", alignItems: "center", height: "100%" }}
			>
				<ActivityIndicator />
			</HeaderlessContainer>
		);
	}
	if (error) {
		errorHandling(error);
		refresh();
	}

	const { complete, incomplete } = (data?.activities as Array<AssignmentFragment>).reduce<
		Record<"complete" | "incomplete", Array<ListItemProps & { date: Date }>>
	>((acc, activity) => {
		if (activity.organization?.id !== orgId) return acc;
		if (!activity.source?.name || !activity.id) return acc;
		const matchingGrade = formatGrade(
			data?.userGrades.find((grade) => grade.activity?.id === activity.id)?.value,
		);
		let label;
		if (activity.completed) {
			label = matchingGrade;
		} else {
			const { dueDate } = activity;
			if (!dueDate) {
				label = "Due date unknown";
			} else label = `Due ${formatDate(new Date(dueDate))}`;
		}
		const item = {
			date: activity.dueDate ? new Date(activity.dueDate) : new Date(),
			title: activity.source.name,
			label,
			icon: (
				<WriteIcon
					{...styles.icon}
					fill={activity.completed ? Colors.TextPrimary : Colors.Active}
				/>
			),
			numberOfLines: 1,
			styles: {
				label: {
					...(activity.completed ? Typography.Subheading : Typography.Body),
					color: activity.completed ? Colors.TextPrimary : Colors.TextLabel,
				},
			},
			onPress: () =>
				navigation.navigate("CourseAssignmentView", {
					orgId,
					orgName,
					activityId: activity.id,
				}),
		};
		if (activity.completed) {
			acc.complete.push(item);
		} else {
			acc.incomplete.push(item);
		}
		return acc;
	}, { complete: [], incomplete: [] });
	const assignments = [
		...incomplete.sort((a, b) => b.date.getTime() - a.date.getTime()),
		...complete.sort((a, b) => b.date.getTime() - a.date.getTime()),
	];

	return (
		<Container>
			<List data={assignments} labelAlignment="right" />
		</Container>
	);
}

const styles = StyleSheet.create({ icon: { width: 24, height: 24 }, labelIncomplete: {} });

export type CourseContent = {
	__typename?: string;
	title: string;
	viewUrl?: string;
	downloadHref?: string;
	pdfHref?: string;
	modifiedDate?: string;
	type?: string;
	showCount?: boolean;
	collapsed?: boolean;
	children?: Array<CourseContent>;
};

export function fetchCourseAssignments(
	{ queryKey: [, { accessToken, orgId, demoMode }] }: QueryFunctionContext<
		[string, { accessToken: string; orgId: string; demoMode: boolean }]
	>,
) {
	if (demoMode) return MOCK_COURSE_ASSIGNMENTS;
	gqlClient.setHeader("Authorization", "Bearer " + accessToken);
	const { start, end } = getYearStartAndEnd();
	return gqlClient.request(COURSE_ASSIGNMENTS_QUERY, {
		startDate: start.toISOString(),
		endDate: end.toISOString(),
		orgId,
	});
}
export const COURSE_ASSIGNMENTS_QUERY = graphql(/* GraphQL */ `
    query CourseAssignments($startDate: String!, $endDate: String!, $orgId: String!) {
        activities(start: $startDate, end: $endDate) {
			...Assignment
        }
		userGrades(organization: $orgId) {
			activity {
				id
			}
			feedback {
				text
			}
			value
		}
    }
	fragment Assignment on Activity {
        organization {
            id
        }
        id
        source {
            name
            url
        }
        dueDate
        completed
		gradeInfo {
			type
			value
		}
		feedback {
			text
		}
    }
`);

export const MOCK_COURSE_ASSIGNMENTS: CourseAssignmentsQuery = {
	activities: [{
		__typename: "Activity",
		id: "1",
		organization: { id: "https://.organizations.api.brightspace.com/1" },
		source: { name: "Assignment 1", url: "https://dimplace.com" },
		completed: false,
	}] as Array<AssignmentFragment>,
	userGrades: [],
} as never;
