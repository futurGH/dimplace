import { BottomTabScreenProps, createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import type {
	CompositeScreenProps,
	NavigationProp,
	NavigatorScreenParams,
} from "@react-navigation/native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { QueryFunctionContext, useQuery } from "@tanstack/react-query";
import * as Linking from "expo-linking";
import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";
import type { SvgProps } from "react-native-svg";
import { gqlClient } from "../../api/gqlClient";
import { DocumentListIcon } from "../../assets/icons/document-list";
import { ExitIcon } from "../../assets/icons/exit";
import { ExternalIcon } from "../../assets/icons/external";
import { MessageWritingIcon } from "../../assets/icons/message-writing";
import { WriteIcon } from "../../assets/icons/write";
import { Header } from "../../components/layout/Header";
import { HeaderlessContainer } from "../../components/layout/HeaderlessContainer";
import type {
	RootStackScreenProps,
	StackParamList,
} from "../../components/layout/NavigationWrapper";
import { TabBar } from "../../components/layout/TabBar";
import { graphql } from "../../gql";
import type { CoursePageQuery } from "../../gql/graphql";
import { useStoreActions, useStoreState } from "../../store/store";
import { Colors, Typography } from "../../styles";
import { handleErrors } from "../../util/errors";
import { CourseAssignmentsStack } from "./assignments/CourseAssignmentsStack";
import { CourseContent } from "./content/CourseContent";
import { CourseHomeStack, type CourseHomeStackParamList } from "./feed/CourseHomeStack";

export type CourseTabNavigatorParamList = {
	CourseHomeStack:
		& NavigatorScreenParams<CourseHomeStackParamList>
		& Partial<
			& Pick<NonNullable<CoursePageQuery["activityFeedArticlePage"]>, "activityFeedArticles">
			& Pick<CoursePageQuery, "organization">
		>;
	CourseContent: { orgId: string };
	CourseAssignmentsStack: { orgName: string; orgId: string };
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
	const configActions = useStoreActions((actions) => actions.config);

	const { id: courseId } = route.params;
	const id = `https://${config.tenantId}.organizations.api.brightspace.com/${courseId}`;

	gqlClient.setHeader("Authorization", "Bearer " + config.accessToken);

	const { data, error, isLoading } = useQuery({
		queryKey: ["course", { id, courseId }],
		queryFn: fetchCourseFeed,
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

	if (error) {
		handleErrors({ error, navigation, config, actions: configActions });
		return null;
	}
	return (
		<Tab.Navigator
			tabBar={TabBar}
			screenOptions={{
				header: Header,
				headerLeft: () => <CoursePageHeaderLeftButton />,
				headerRight: () => (
					<CoursePageHeaderRightButton url={data?.organization?.homeUrl} />
				),
				headerTitle: data?.organization?.name,
			}}
		>
			<Tab.Screen
				name="CourseHomeStack"
				component={CourseHomeStack}
				options={{
					headerTitle: "",
					title: "Feed",
					tabBarIcon: ({ color, size }) => (
						<MessageWritingIcon width={size} height={size} fill={color} />
					),
				}}
				/* pass through route parameters because nested screens otherwise can't access them */
				initialParams={{
					activityFeedArticles: data?.activityFeedArticlePage?.activityFeedArticles,
					organization: data?.organization,
				}}
			/>
			<Tab.Screen
				name="CourseContent"
				component={CourseContent}
				options={{
					headerTitle: data?.organization?.name || "Content",
					title: "Content",
					tabBarIcon: ({ color, size }) => (
						<DocumentListIcon width={size} height={size} fill={color} />
					),
				}}
				initialParams={{ orgId: id }}
			/>
			<Tab.Screen
				name="CourseAssignmentsStack"
				component={CourseAssignmentsStack}
				options={{
					headerTitle: data?.organization?.name || "Assignments",
					title: "Assignments",
					tabBarIcon: ({ color, size }) => (
						<WriteIcon width={size} height={size} fill={color} />
					),
				}}
				initialParams={{ orgName: data?.organization?.name, orgId: id }}
			/>
		</Tab.Navigator>
	);
}

export function CoursePageHeaderLeftButton(
	{
		onPress = (navigation: NavigationProp<any>) => navigation.navigate("Home"),
		icon: Icon = ExitIcon,
		text = "Courses",
	}: {
		onPress?: (navigation: NavigationProp<any>) => void;
		icon?: (props: SvgProps) => JSX.Element;
		text?: string;
	},
) {
	const navigation = useNavigation();
	return (
		<Pressable style={styles.leftButton} onPress={() => onPress(navigation)}>
			<Icon {...iconStyles} />
			{text && <Text style={styles.leftButtonText}>{text}</Text>}
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
	leftButtonText: { ...Typography.Body, color: Colors.TextSecondary, marginLeft: 8 },
});
const iconStyles: SvgProps = { width: 24, height: 24, fill: Colors.TextSecondary };

export function fetchCourseFeed(
	{ queryKey }: QueryFunctionContext<[string, { id: string; courseId: string }]>,
) {
	const [, { id, courseId }] = queryKey;
	return gqlClient.request(COURSE_PAGE_QUERY, { id, orgUnitId: courseId });
}

const COURSE_PAGE_QUERY = graphql(/* GraphQL */ `
    query CoursePage($id: String!, $orgUnitId: String!) {
        organization(id: $id) {
            name
            imageUrl
            homeUrl
        }
        activityFeedArticlePage(orgUnitId: $orgUnitId) {
            id
            activityFeedArticles {
                __typename
                ... on ActivityFeedEntity {
                    ...FeedItemFragment
                }
                ... on ActivityFeedTopLevelPost {
                    ...FeedPostFragment
                }
                ... on ActivityFeedArticle {
                    ...ArticleDetailsFragment
                }
                ... on ActivityFeedAssignment {
                    ...AssignmentDetailsFragment
                }
            }
        }
    }
    fragment FeedItemFragment on ActivityFeedEntity {
        id
        type
        author {
            displayName
            imageUrl
        }
        publishedDate
    }
    fragment FeedPostFragment on ActivityFeedTopLevelPost {
        commentsLink
        commentsCount
        attachmentLinks {
            id
            type
            name
            href
            iconHref
        }
        isPinned
    }
    fragment ArticleDetailsFragment on ActivityFeedArticle {
        message
    }
    fragment AssignmentDetailsFragment on ActivityFeedAssignment {
        name
        instructions
        dueDate
        submissionLink
    }
`);
