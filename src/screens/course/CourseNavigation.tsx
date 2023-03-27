import { type BottomTabScreenProps, createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import type { CompositeScreenProps, NavigationProp } from "@react-navigation/native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { QueryClient, type QueryFunctionContext, useQuery, useQueryClient } from "@tanstack/react-query";
import * as Linking from "expo-linking";
import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";
import type { SvgProps } from "react-native-svg";
import { gqlClient } from "../../api/gqlClient";
import { DocumentListIcon } from "../../assets/icons/document-list";
import { DocumentStackIcon } from "../../assets/icons/document-stack";
import { ExitIcon } from "../../assets/icons/exit";
import { ExternalIcon } from "../../assets/icons/external";
import { MessageWritingIcon } from "../../assets/icons/message-writing";
import { WriteIcon } from "../../assets/icons/write";
import type { AnnouncementCardProps } from "../../components/course/feed/AnnouncementCard";
import { Header } from "../../components/layout/Header";
import { HeaderlessContainer } from "../../components/layout/HeaderlessContainer";
import type { RootStackScreenProps, StackParamList } from "../../components/layout/NavigationWrapper";
import { TabBar } from "../../components/layout/TabBar";
import { graphql } from "../../gql";
import type { CoursePageQuery } from "../../gql/graphql";
import { useStoreActions, useStoreState } from "../../store/store";
import { useColorTheme } from "../../style/ColorThemeProvider";
import type { ColorTheme } from "../../style/colorThemes";
import { Typography } from "../../style/typography";
import { handleErrors } from "../../util/errors";
import { query } from "../../util/query";
import { CourseAssignments, fetchCourseAssignments } from "./assignments/CourseAssignments";
import { CourseContent, fetchCourseContent } from "./content/CourseContent";
import { CourseFeed } from "./feed/CourseFeed";
import { CourseGrades, fetchCourseGrades } from "./grades/CourseGrades";

export type CourseTabNavigatorParamList = {
	CourseFeed: Partial<
		& Pick<NonNullable<CoursePageQuery["activityFeedArticlePage"]>, "activityFeedArticles">
		& Pick<CoursePageQuery, "organization">
	>;
	CourseContent: { orgId: string; filterQuery: string };
	CourseAssignments: { orgId: string; orgName: string };
	CourseGrades: { orgId: string };
};
export type CourseTabNavigatorScreenProps<T extends keyof CourseTabNavigatorParamList> = CompositeScreenProps<
	BottomTabScreenProps<CourseTabNavigatorParamList, T>,
	RootStackScreenProps<keyof StackParamList>
>;

const Tab = createBottomTabNavigator<CourseTabNavigatorParamList>();

export function CourseNavigation() {
	const { Colors } = useColorTheme();
	const route = useRoute<RootStackScreenProps<"CourseNavigation">["route"]>();
	const navigation = useNavigation<RootStackScreenProps<"CourseNavigation">["navigation"]>();
	const config = useStoreState((state) => state.config);
	const configActions = useStoreActions((actions) => actions.config);
	const queryClient = useQueryClient();

	const { id: courseId } = route.params || {};
	const id = courseId?.startsWith("https")
		? courseId
		: `https://${config.tenantId}.organizations.api.brightspace.com/${courseId}`;

	gqlClient.setHeader("Authorization", "Bearer " + config.accessToken);

	const errorHandling = (error: unknown) =>
		handleErrors({ error, navigation, config, actions: configActions });
	const { data, error, isLoading } = useQuery({
		queryKey: ["course", { id, courseId, demoMode: config.__DEMO__ }],
		queryFn: query(errorHandling, fetchCourseFeed),
	});

	if (isLoading || error) {
		return (
			<HeaderlessContainer style={{ justifyContent: "center", alignItems: "center", height: "100%" }}>
				<ActivityIndicator />
			</HeaderlessContainer>
		);
	}

	prefetchCoursePages(queryClient, {
		orgId: id,
		accessToken: config.accessToken,
		demoMode: config.__DEMO__,
	});

	return (
		<Tab.Navigator
			tabBar={(props) => <TabBar {...props} Colors={Colors} />}
			screenOptions={{
				header: Header,
				headerLeft: () => <CoursePageHeaderLeftButton />,
				headerRight: () => <CoursePageHeaderRightButton url={data?.organization?.homeUrl} />,
				headerTitle: data?.organization?.name,
			}}
		>
			<Tab.Screen
				name="CourseFeed"
				component={CourseFeed}
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
				name="CourseAssignments"
				component={CourseAssignments}
				options={{
					headerTitle: data?.organization?.name || "Assignments",
					title: "Assignments",
					tabBarIcon: ({ color, size }) => <WriteIcon width={size} height={size} fill={color} />,
				}}
				initialParams={{ orgName: data?.organization?.name, orgId: id }}
			/>
			<Tab.Screen
				name="CourseGrades"
				component={CourseGrades}
				options={{
					headerTitle: data?.organization?.name || "Grades",
					title: "Grades",
					tabBarIcon: ({ color, size }) => (
						<DocumentStackIcon width={size} height={size} fill={color} />
					),
				}}
				initialParams={{ orgId: id }}
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
	const { Colors } = useColorTheme();
	const styles = createStyles(Colors);
	const iconStyles = createIconStyles(Colors);
	const navigation = useNavigation();
	return (
		<Pressable style={styles.leftButton} onPress={() => onPress(navigation)}>
			<Icon {...iconStyles} />
			{text && <Text style={styles.leftButtonText}>{text}</Text>}
		</Pressable>
	);
}

export function CoursePageHeaderRightButton({ url }: { url?: string | undefined | null }) {
	const { Colors } = useColorTheme();
	const iconStyles = createIconStyles(Colors);
	return (
		<Pressable onPress={() => url && Linking.openURL(url)} style={iconStyles}>
			<ExternalIcon {...iconStyles} />
		</Pressable>
	);
}

const createStyles = (Colors: ColorTheme) =>
	StyleSheet.create({
		leftButton: { flexDirection: "row", alignItems: "center", height: 24 },
		leftButtonText: { ...Typography.Body, color: Colors.TextSecondary, marginLeft: 8 },
	});
const createIconStyles = (Colors: ColorTheme) => ({ width: 24, height: 24, fill: Colors.TextSecondary });

export function fetchCourseFeed(
	{ queryKey }: QueryFunctionContext<[string, { id: string; courseId: string; demoMode: boolean }]>,
) {
	const [, { id, courseId, demoMode }] = queryKey;
	if (demoMode) {
		return Promise.resolve(MOCK_COURSE_PAGE_DATA) as unknown as Promise<CoursePageQuery>;
	}
	return gqlClient.request(COURSE_PAGE_QUERY, { id, orgUnitId: courseId });
}

export function prefetchCoursePages(
	queryClient: QueryClient,
	key: { [K in "orgId" | "accessToken"]: string } & { [K in "demoMode"]: boolean },
) {
	Promise.allSettled([
		queryClient.prefetchQuery(["courseContent", key], fetchCourseContent),
		queryClient.prefetchQuery(["courseAssignments", key], fetchCourseAssignments),
		queryClient.prefetchQuery(["courseGrades", key], fetchCourseGrades),
	]).then((results) => {
		results.forEach((result) => {
			if (result.status === "rejected") {
				console.error("Prefetch failed", result.reason);
			}
		});
	});
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

const MOCK_COURSE_PAGE_DATA: Omit<CoursePageQuery, "activityFeedArticlePage"> & {
	activityFeedArticlePage: { id: string; activityFeedArticles: Array<AnnouncementCardProps> };
} = {
	organization: {
		name: "Demo Course",
		imageUrl: "https://picsum.photos/1080/460.jpg",
		homeUrl: "https://dimplace.com",
	},
	activityFeedArticlePage: {
		id: "1",
		activityFeedArticles: [{
			id: "1",
			author: { displayName: "John Appleseed", imageUrl: "https://picsum.photos/128.jpg" },
			publishedDate: "2022-01-05T00:00:00Z",
			message:
				"As we approach the midpoint of the semester, don't forget to start thinking about any projects or papers that may be due. Start brainstorming ideas and outlining your work as soon as possible, and don't hesitate to reach out to me or your TA for feedback and guidance. With some careful planning and hard work, you can successfully complete all of the assignments and achieve your academic goals for the course.",
			commentsCount: "0",
			attachmentLinks: [],
		}, {
			id: "2",
			author: { displayName: "John Appleseed", imageUrl: "https://picsum.photos/128.jpg" },
			publishedDate: "2021-09-18T00:00:00Z",
			message:
				"Welcome to the course! I'm excited to be working with all of you this semester. Before we dive into the material, I wanted to go over a few course logistics. Make sure to check the syllabus for important dates and deadlines, and don't hesitate to reach out to me if you have any questions or concerns.",
			commentsCount: "0",
			attachmentLinks: [],
		}],
	},
};
