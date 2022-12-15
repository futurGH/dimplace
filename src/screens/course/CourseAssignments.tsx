import { useNavigation, useRoute } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { ActivityIndicator, StyleSheet } from "react-native";
import { gqlClient } from "../../api/gqlClient";
import { WriteIcon } from "../../assets/icons/write";
import type { ListItemProps } from "../../components/elements/List";
import { List } from "../../components/elements/List";
import { Container } from "../../components/layout/Container";
import { HeaderlessContainer } from "../../components/layout/HeaderlessContainer";
import { graphql } from "../../gql";
import type { AssignmentFragment } from "../../gql/graphql";
import { useStoreActions, useStoreState } from "../../store/store";
import { Colors, Typography } from "../../styles";
import { handleErrors } from "../../util/errors";
import { formatDate, getYearStartAndEnd } from "../../util/formatDate";
import type { CourseTabNavigatorScreenProps } from "./CourseNavigation";

export function CourseAssignments() {
	const route = useRoute<CourseTabNavigatorScreenProps<"CourseContent">["route"]>();
	const navigation = useNavigation<
		CourseTabNavigatorScreenProps<"CourseContent">["navigation"]
	>();
	const config = useStoreState((state) => state.config);
	const configActions = useStoreActions((actions) => actions.config);
	const { orgId } = route.params || {};

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

	const { complete, incomplete } = (data.activities as Array<AssignmentFragment>).reduce<
		Record<"complete" | "incomplete", Array<ListItemProps>>
	>((acc, activity) => {
		if (activity.organization?.id !== orgId) return acc;
		if (!activity.source?.name || !activity.id) return acc;
		const matchingGrade = data.userGrades.find((grade) =>
			grade.activity?.id === activity.id
		)?.value?.replace(/\s/g, "") || "-/-";
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
			onPress: () => {
			},
		};
		if (activity.completed) {
			acc.complete.push(item);
		} else {
			acc.incomplete.push(item);
		}
		return acc;
	}, { complete: [], incomplete: [] });
	const assignments = [...incomplete, ...complete];

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

const COURSE_ASSIGNMENTS_QUERY = graphql(/* GraphQL */ `
    query CourseAssignments($startDate: String!, $endDate: String!, $orgId: String!) {
        activities(start: $startDate, end: $endDate) {
			...Assignment
        }
		userGrades(organization: $orgId) {
			activity {
				id
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
    }
`);
