import { useNavigation } from "@react-navigation/native";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";
import { gqlClient } from "../../api/gqlClient";
import type { CourseCardProps } from "../../components/home/CourseCard";
import { CourseCard } from "../../components/home/CourseCard";
import { Container } from "../../components/layout/Container";
import { HeaderlessContainer } from "../../components/layout/HeaderlessContainer";
import { graphql } from "../../gql";
import { useStoreActions, useStoreState } from "../../store/store";
import { handleErrors } from "../../util/errors";
import { getYearStartAndEnd } from "../../util/formatDate";
import { fetchCourseFeed } from "../course/CourseNavigation";

export function Home() {
	const navigation = useNavigation();
	navigation.addListener("beforeRemove", (e) => e.preventDefault());

	const queryClient = useQueryClient();

	const config = useStoreState((state) => state.config);
	const actions = useStoreActions((actions) => actions.config);
	const { data, error, isLoading } = useQuery({
		queryKey: ["home"],
		queryFn: async () => {
			gqlClient.setHeader("Authorization", "Bearer " + config.accessToken);
			const { start, end } = getYearStartAndEnd();
			return gqlClient.request(COURSE_LIST_QUERY, {
				startDate: start.toISOString(),
				endDate: end.toISOString(),
			});
		},
		retry: (failureCount, error) => {
			return handleErrors({ error, failureCount, navigation, config, actions });
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
	if (error) {
		handleErrors({ error, navigation, config, actions });
	}

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
				assignments: data.activities.filter((activity) =>
					activity.organization?.id === organization.id
					&& activity.source?.name
					&& activity.dueDate
					&& activity.completed === false
				).map((activity) => {
					return {
						id: activity.id,
						name: activity.source?.name || "Assignment not found",
						dueDate: new Date(activity.dueDate || Date.now()),
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
				showsVerticalScrollIndicator={false}
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
