import { BottomTabScreenProps, createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import type { CompositeScreenProps, NavigatorScreenParams } from "@react-navigation/native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import * as Linking from "expo-linking";
import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";
import type { SvgProps } from "react-native-svg";
import { gqlClient } from "../../api/gqlClient";
import { ExitIcon } from "../../assets/icons/exit";
import { ExternalIcon } from "../../assets/icons/external";
import { Header } from "../../components/layout/Header";
import { HeaderlessContainer } from "../../components/layout/HeaderlessContainer";
import type {
	RootStackScreenProps,
	StackParamList,
} from "../../components/layout/NavigationWrapper";
import { graphql } from "../../gql";
import type { CoursePageQuery } from "../../gql/graphql";
import { useStoreActions, useStoreState } from "../../store/store";
import { Colors, Typography } from "../../styles";
import { handleErrors } from "../../util/errors";
import { CourseHomeStack, CourseHomeStackParamList } from "./CourseHomeStack";

export type CourseTabNavigatorParamList = {
	CourseHomeStack:
		& NavigatorScreenParams<CourseHomeStackParamList>
		& Partial<
			& Pick<NonNullable<CoursePageQuery["activityFeedArticlePage"]>, "activityFeedArticles">
			& Pick<CoursePageQuery, "organization">
		>;
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
	const config = useStoreState((state) => state.config);
	const configActions = useStoreActions((actions) => actions.config);

	const { id: courseId } = route.params;
	const id = `https://${config.tenantId}.organizations.api.brightspace.com/${courseId}`;

	const { data, error: errors, isLoading, refetch } = useQuery({
		queryKey: ["course", id],
		queryFn: async () => {
			gqlClient.setHeader("Authorization", "Bearer " + config.accessToken);
			return gqlClient.request(COURSE_PAGE_QUERY, { id, orgUnitId: courseId });
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

	if (errors) {
		handleErrors({ errors, refetch, config, actions: configActions });
		console.error(errors);
	}

	return (
		<Tab.Navigator
			screenOptions={{
				header: Header,
				headerLeft: CoursePageHeaderLeftButton,
				headerRight: () => (
					<CoursePageHeaderRightButton url={data?.organization?.homeUrl} />
				),
				headerTitle: data?.organization?.name,
				title: "Feed",
			}}
		>
			<Tab.Screen
				name="CourseHomeStack"
				component={CourseHomeStack}
				options={{ headerTitle: "" }}
				/* pass through route parameters because nested screens otherwise can't access them */
				initialParams={{
					activityFeedArticles: data?.activityFeedArticlePage?.activityFeedArticles,
					organization: data?.organization,
				}}
			/>
		</Tab.Navigator>
	);
}

export function CoursePageHeaderLeftButton() {
	const navigation = useNavigation();
	return (
		<Pressable style={styles.leftButton} onPress={() => navigation.navigate("Home")}>
			<ExitIcon {...iconStyles} />
			<Text style={styles.leftButtonText}>Courses</Text>
		</Pressable>
	);
}

export function CoursePageHeaderRightButton({ url }: { url?: string | undefined | null }) {
	return (
		<Pressable onPress={() => url && Linking.openURL(url)}>
			<ExternalIcon {...iconStyles} />
		</Pressable>
	);
}

const styles = StyleSheet.create({
	leftButton: { flexDirection: "row", alignItems: "center", height: 24 },
	leftButtonText: {
		...Typography.Body,
		fontFamily: "WorkMedium",
		color: Colors.TextPrimary,
		marginLeft: 8,
	},
});
const iconStyles: SvgProps = { width: 24, height: 24, fill: Colors.TextPrimary };

const COURSE_PAGE_QUERY = graphql(/* GraphQL */ `
	query CoursePage($id: String!, $orgUnitId: String!) {
		organization(id: $id) {
			name
			imageUrl
			homeUrl
        }
		activityFeedArticlePage(orgUnitId: $orgUnitId) {
			activityFeedArticles {
				...ArticleDetails
				...AssignmentDetails
			}
		}
	}
    fragment ArticleDetails on ActivityFeedArticle {
        id
        type
        author {
            ...UserDetails
        }
        message
        publishedDate
        attachmentLinks {
            ...LinkDetails
        }
        allCommentsLink
        commentsCount
        firstComment {
            ...CommentDetails
        }
        isPinned
    }
    fragment AssignmentDetails on ActivityFeedAssignment {
        id
        type
        author {
            ...UserDetails
        }
        publishedDate
        allCommentsLink
        commentsCount
        name
        instructions
        dueDate
        attachmentLinks {
            ...LinkDetails
        }
        firstComment {
            ...CommentDetails
        }
        submissionLink
        isPinned
    }
    fragment UserDetails on User {
        id
        displayName
        firstName
        lastName
        imageUrl
    }
    fragment LinkDetails on ActivityFeedLink {
        id
        type
        name
        href
    }
    fragment CommentDetails on ActivityFeedComment {
        id
        author {
            ...UserDetails
        }
        message
        publishedDate
    }
`);
