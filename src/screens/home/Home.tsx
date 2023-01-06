import { useNavigation } from "@react-navigation/native";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, View } from "react-native";
import { gqlClient } from "../../api/gqlClient";
import type { CourseCardProps } from "../../components/home/CourseCard";
import { CourseCard } from "../../components/home/CourseCard";
import type { CourseCardAssignmentProps } from "../../components/home/CourseCardAssignment";
import { Container } from "../../components/layout/Container";
import { HeaderlessContainer } from "../../components/layout/HeaderlessContainer";
import { graphql } from "../../gql";
import type { CourseListQuery } from "../../gql/graphql";
import { useStoreActions, useStoreState } from "../../store/store";
import { useColorTheme } from "../../style/ColorThemeProvider";
import { handleErrors } from "../../util/errors";
import { getYearStartAndEnd } from "../../util/formatDate";
import { query } from "../../util/query";
import { useRefreshing } from "../../util/useRefreshing";
import { fetchCourseFeed } from "../course/CourseNavigation";

export function Home() {
	const { Colors } = useColorTheme();

	const navigation = useNavigation();
	navigation.addListener("beforeRemove", (e) => e.preventDefault());

	const queryClient = useQueryClient();

	const config = useStoreState((state) => state.config);
	const actions = useStoreActions((actions) => actions.config);
	const settings = useStoreState((state) => state.settings);

	gqlClient.setHeader("Authorization", "Bearer " + config.accessToken);
	const errorHandling = (error: any) => handleErrors({ error, navigation, config, actions });
	const { data, error, isLoading, refetch, isRefetching } = useQuery({
		queryKey: ["home"],
		queryFn: query(errorHandling, async () => {
			if (config.__DEMO__) return MOCK_COURSE_LIST_DATA;
			const { start, end } = getYearStartAndEnd();
			return await gqlClient.request(COURSE_LIST_QUERY, {
				startDate: start.toISOString(),
				endDate: end.toISOString(),
			});
		}),
	});
	const [isRefreshing, refresh] = useRefreshing(refetch, errorHandling);

	if (isLoading && !isRefetching || error) {
		return (
			<HeaderlessContainer style={{ justifyContent: "center", alignItems: "center", height: "100%" }}>
				<ActivityIndicator />
			</HeaderlessContainer>
		);
	}

	const currentDate = new Date();
	const courses: Array<CourseCardProps> =
		data?.enrollmentPage?.enrollments?.filter((
			enrollment,
		): enrollment is NonNullable<typeof enrollment> & {
			organization: NonNullable<typeof enrollment.organization>;
		} => !!enrollment.organization).map(({ organization }) => {
			return {
				name: organization.name || "Course not found",
				id: organization.id || "",
				imageUrl: organization.imageUrl || "",
				assignments: data.activities.filter((activity) => {
					// if the user wants to see overdue assignments,
					const overdueFilter = settings.showOverdueAssignments
						// pass filter regardless of due date
						? true
						// otherwise, only pass filter if the due date is in the future
						: activity.dueDate && new Date(activity.dueDate) >= currentDate;
					return activity.organization?.id === organization.id
						&& activity.source?.name
						&& activity.dueDate
						&& overdueFilter
						&& activity.completed === false
						&& (activity.endDate ? new Date(activity.endDate) > currentDate : true);
				}).map<CourseCardAssignmentProps>((activity) => {
					return {
						id: activity.id,
						name: activity.source?.name || "Assignment not found",
						dueDate: new Date(activity.dueDate || Date.now()),
						highlightOverdue: settings.highlightOverdueAssignments.value,
					};
				}),
			};
		}) || [];

	// Unfortunately react-query doesn't provide a built-in way to parallelize prefetching
	courses.forEach((course) =>
		queryClient.prefetchQuery({
			queryKey: ["course", {
				id: `https://${config.tenantId}.organizations.api.brightspace.com/${course.id}`,
				courseId: course.id,
				demoMode: config.__DEMO__,
			}],
			queryFn: fetchCourseFeed,
		}).catch(() => {})
	);
	return (
		<Container>
			<FlatList
				data={courses}
				renderItem={({ item: props }) => <CourseCard key={props.id} {...props} />}
				ItemSeparatorComponent={() => <View style={styles.separator} />}
				refreshControl={<RefreshControl onRefresh={refresh} refreshing={isRefreshing} />}
				showsVerticalScrollIndicator={false}
				extraData={Colors.Active}
			/>
		</Container>
	);
}

const styles = StyleSheet.create({
	content: { flex: 1, width: "100%", height: "100%", alignItems: "center" },
	separator: { height: 24 },
});

const COURSE_LIST_QUERY = graphql(/* GraphQL */ `
    query CourseList($startDate: String!, $endDate: String!) {
        activities(start: $startDate, end: $endDate) {
            id
            source {
                id
                name
            }
            organization {
                id
            }
            completed
			completionDate
			dueDate
			endDate
        }
		enrollmentPage {
			enrollments {
				organization {
					id
					name
					imageUrl
					startDate
					endDate
				}
			}
		}
	}
`);

const MOCK_COURSE_LIST_DATA: CourseListQuery = {
	enrollmentPage: {
		enrollments: [{
			organization: {
				__typename: "Organization",
				id: "1",
				name: "Demo Course",
				imageUrl: "https://picsum.photos/1080/460.jpg",
			},
		}, {
			organization: {
				__typename: "Organization",
				id: "2",
				name: "Demo Course",
				imageUrl: "https://picsum.photos/1080/460.jpg",
			},
		}],
	},
	activities: [{
		organization: { id: "1" },
		id: "1",
		source: { id: "1", name: "Demo Assignment" },
		completed: false,
		completionDate: null,
		dueDate: "2022-12-23T00:00:00.000Z",
	}],
};
