import { BottomTabScreenProps, createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import type { CompositeScreenProps, NavigatorScreenParams } from "@react-navigation/native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { ActivityIndicator } from "react-native";
import { gqlClient } from "../../api/gqlClient";
import { Header } from "../../components/layout/Header";
import { HeaderlessContainer } from "../../components/layout/HeaderlessContainer";
import type {
	RootStackScreenProps,
	StackParamList,
} from "../../components/layout/NavigationWrapper";
import { graphql } from "../../gql";
import { useStoreState } from "../../store/store";
import { CourseHomeStack, CourseHomeStackParamList } from "./CourseHomeStack";

export type CourseTabNavigatorParamList = {
	CourseHomeStack: NavigatorScreenParams<CourseHomeStackParamList>;
	CourseContent: undefined;
	CourseAssignments: undefined;
	CourseGrades: undefined;
};
export type CourseTabNavigatorScreenProps<T extends keyof CourseTabNavigatorParamList> =
	CompositeScreenProps<
		BottomTabScreenProps<CourseTabNavigatorParamList, T>,
		RootStackScreenProps<keyof StackParamList>
	>;

const Tab = createBottomTabNavigator<CourseTabNavigatorParamList>();

export function CourseNavigation() {
	const route = useRoute<RootStackScreenProps<"CourseNavigation">["route"]>();
	const navigation = useNavigation<RootStackScreenProps<"CourseNavigation">["navigation"]>();
	const config = useStoreState((state) => state.config);

	const { id: courseId } = route.params;
	const id = `https://${config.tenantId}.organizations.api.brightspace.com/${courseId}`;

	const { data, error, isLoading } = useQuery({
		queryKey: ["course", id],
		queryFn: async () => {
			gqlClient.setHeader("Authorization", "Bearer " + config.accessToken);
			return gqlClient.request(COURSE_PAGE_QUERY, { id, orgUnitId: courseId });
		},
	});

	if (isLoading) {
		return (
			<HeaderlessContainer style={{ justifyContent: "center", alignItems: "center" }}>
				<ActivityIndicator />
			</HeaderlessContainer>
		);
	}

	if (error) navigation.goBack();

	return (
		<Tab.Navigator
			screenOptions={{ header: Header, headerTitle: data?.organization?.name, title: "Feed" }}
		>
			<Tab.Screen
				name="CourseHomeStack"
				component={CourseHomeStack}
				/* pass through route parameters because nested screens otherwise can't access them */
				initialParams={route.params as never}
			/>
		</Tab.Navigator>
	);
}

const COURSE_PAGE_QUERY = graphql(/* GraphQL */ `
	query CoursePage($id: String!, $orgUnitId: String!) {
		organization(id: $id) {
			name
			imageUrl
		}
		activityFeedArticlePage(id: null, orgUnitId: $orgUnitId) {
			id
			activityFeedArticles {
				__typename
			}
		}
	}
`);
