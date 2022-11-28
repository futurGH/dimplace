import { useNavigation } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";
import { gqlClient } from "../../api/gqlClient";
import type { CourseCardProps } from "../../components/home/CourseCard";
import { CourseCard } from "../../components/home/CourseCard";
import { Container } from "../../components/layout/Container";
import { HeaderlessContainer } from "../../components/layout/HeaderlessContainer";
import { graphql } from "../../gql";
import { useStoreActions, useStoreState } from "../../store/store";
import { buildAuthUrl } from "../onboarding/AuthWebView";

export function Home() {
	const navigation = useNavigation();
	const config = useStoreState((state) => state.config);
	const configActions = useStoreActions((actions) => actions.config);
	const { data, error: errors, isLoading, refetch } = useQuery({
		queryKey: ["home"],
		queryFn: async () => {
			const currentYear = new Date().getFullYear();
			const startDate = new Date(currentYear, 0, 1, 0, 0, 0, 0).toISOString();
			const endDate = new Date(currentYear, 11, 31, 23, 59, 59, 999).toISOString();
			gqlClient.setHeader("Authorization", "Bearer " + config.accessToken);
			return gqlClient.request(COURSE_LIST_QUERY, { startDate, endDate });
		},
	});
	if (isLoading) {
		return (
			<HeaderlessContainer>
				<ActivityIndicator />
			</HeaderlessContainer>
		);
	}
	if (errors) {
		console.error(errors);
		if (Array.isArray(errors) && errors.length) {
			const error = errors[0];
			const errorCode = error.response.status;
			if (errorCode === 401) {
				configActions.updateAccessToken(config.refreshToken);
				// TODO: alert or something when repeated fetching fails
				refetch().catch(() => {
					navigation.navigate("AuthWebView", { source: buildAuthUrl(config) });
				});
			}
		}
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
					activity.organization?.id === organization.id && !activity.completed
				).map((activity) => {
					return {
						name: activity.source?.name || "Assignment not found",
						dueDate: new Date(activity.dueDate || Date.now()),
					};
				}),
			};
		}) || [];
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
