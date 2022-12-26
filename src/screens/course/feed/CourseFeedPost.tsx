import { useNavigation, useRoute } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import {
	ActivityIndicator,
	Dimensions,
	FlatList,
	Image,
	Linking,
	StyleSheet,
	Text,
	View,
} from "react-native";
import { gqlClient } from "../../../api/gqlClient";
import { DocumentIcon } from "../../../assets/icons/document";
import { ImageIcon } from "../../../assets/icons/image";
import { LinkIcon } from "../../../assets/icons/link";
import { UserProfileIcon } from "../../../assets/icons/user-profile";
import { Chip } from "../../../components/elements/Chip";
import { Html } from "../../../components/elements/Html";
import { Container } from "../../../components/layout/Container";
import { Header } from "../../../components/layout/Header";
import { HeaderlessContainer } from "../../../components/layout/HeaderlessContainer";
import { graphql } from "../../../gql";
import type {
	ActivityFeedCommentPage,
	ArticleDetailsFragmentFragment,
	AssignmentDetailsFragmentFragment,
	FeedItemFragmentFragment,
	FeedPostFragmentFragment,
} from "../../../gql/graphql";
import { useStoreActions, useStoreState } from "../../../store/store";
import { Colors, Typography } from "../../../styles";
import { handleErrors } from "../../../util/errors";
import { formatDate } from "../../../util/formatDate";
import { query } from "../../../util/query";
import { CoursePageHeaderLeftButton } from "../CourseNavigation";
import type { CourseHomeStackScreenProps } from "./CourseHomeStack";

type ActivityFeedArticle =
	& FeedItemFragmentFragment
	& FeedPostFragmentFragment
	& (ArticleDetailsFragmentFragment | AssignmentDetailsFragmentFragment);

export function CourseFeedPost() {
	const route = useRoute<CourseHomeStackScreenProps<"CourseFeedPost">["route"]>();
	const navigation = useNavigation();
	const { articleId, orgName } = route.params;
	if (!articleId) {
		navigation.canGoBack() ? navigation.goBack() : navigation.navigate("Home");
	}
	const commentsId = `${articleId}/comment/all`;
	const config = useStoreState((state) => state.config);
	const configActions = useStoreActions((actions) => actions.config);

	const errorHandling = (error: unknown) =>
		handleErrors({ error, navigation, config, actions: configActions });
	const { data, error, isLoading } = useQuery({
		queryKey: ["article", articleId],
		queryFn: query(errorHandling, async () => {
			if (config.__DEMO__) return MOCK_COURSE_FEED_POST;
			gqlClient.setHeader("Authorization", "Bearer " + config.accessToken);
			return gqlClient.request(COURSE_FEED_POST_QUERY, { articleId, commentsId });
		}),
	});

	if (isLoading || error || !data?.activityFeedCommentPage) {
		return (
			<HeaderlessContainer
				style={{ justifyContent: "center", alignItems: "center", height: "100%" }}
			>
				<ActivityIndicator />
			</HeaderlessContainer>
		);
	}

	const { activityFeedComments } = data.activityFeedCommentPage;
	const activityFeedArticle = data.activityFeedArticle as ActivityFeedArticle;

	const body =
		("message" in activityFeedArticle
			? activityFeedArticle.message
			: activityFeedArticle.instructions) || "Failed to fetch post content.";

	const publishedDate = new Date(activityFeedArticle.publishedDate);
	const formattedDate = formatDate(isNaN(publishedDate.getTime()) ? new Date() : publishedDate);

	const authorIcon = activityFeedArticle.author?.imageUrl?.includes("Framework.UserProfileBadge")
		? <UserProfileIcon style={styles.authorIcon} fill={Colors.Inactive} />
		: (
			<Image
				style={[styles.authorIcon, styles.authorImageIcon]}
				source={{ uri: activityFeedArticle.author.imageUrl || undefined }}
			/>
		);

	const { author } = activityFeedArticle;

	const width = Dimensions.get("window").width;
	return (
		<Container>
			<Header
				route={{ name: orgName }}
				options={{
					headerLeft: () => <CoursePageHeaderLeftButton text="" />,
					headerRight: () => null,
				}}
				paddingTop={0}
			/>
			<FlatList
				data={activityFeedComments}
				ListHeaderComponent={() => (
					<View style={styles.post}>
						<View style={styles.author}>
							{authorIcon}
							<View style={styles.authorText}>
								<Text style={styles.authorName}>{author.displayName}</Text>
								<Text style={styles.authorDate}>{formattedDate}</Text>
							</View>
						</View>
						<View style={styles.body}>
							{"name" in activityFeedArticle
								? <Text style={styles.bodyTitle}>{activityFeedArticle.name}</Text>
								: null}
							<Html width={width} body={body} />
							{"dueDate" in activityFeedArticle
								? (
									<Text style={styles.bodyFootnote}>
										{activityFeedArticle.dueDate}
									</Text>
								)
								: null}
							<FlatList
								style={styles.attachments}
								data={activityFeedArticle.attachmentLinks || []}
								keyExtractor={(item) => item.id}
								renderItem={({ item }) => {
									let icon;
									switch (item.type) {
										case "PNG":
										case "JPG":
										case "JPEG":
										case "GIF":
											icon = ImageIcon;
											break;
										case "PDF":
										case "DOC":
										case "DOCX":
											icon = DocumentIcon;
											break;
										default:
											icon = LinkIcon;
									}
									return (
										<Chip
											icon={icon}
											text={item.name.replace(/%20/g, " ")}
											onPress={() => Linking.openURL(item.href)}
											key={item.id || item.name}
										/>
									);
								}}
								ItemSeparatorComponent={() => <View style={styles.separator} />}
								showsVerticalScrollIndicator={false}
							/>
						</View>
					</View>
				)}
				renderItem={({ item: comment }) => {
					const authorIcon =
						comment.author?.imageUrl?.includes("Framework.UserProfileBadge")
							? <UserProfileIcon style={styles.authorIcon} fill={Colors.Inactive} />
							: (
								<Image
									style={[styles.authorIcon, styles.authorImageIcon]}
									source={{ uri: comment.author.imageUrl || undefined }}
								/>
							);
					const publishedDate = new Date(comment.publishedDate);
					const formattedDate = formatDate(
						isNaN(publishedDate.getTime()) ? new Date() : publishedDate,
					);
					return (
						<View>
							<View style={styles.author}>
								{authorIcon}
								<View style={styles.authorText}>
									<Text style={styles.authorName}>
										{comment.author.displayName}
										<Text style={styles.authorDate}>• {formattedDate}</Text>
									</Text>
								</View>
							</View>
							<View style={styles.body}>
								<Html width={width} body={comment.message} />
							</View>
						</View>
					);
				}}
				ItemSeparatorComponent={() => <View style={styles.separator} />}
				showsVerticalScrollIndicator={false}
			/>
		</Container>
	);
}

const styles = StyleSheet.create({
	post: { marginTop: 24 },
	author: {
		width: "100%",
		flex: 1,
		flexDirection: "row",
		justifyContent: "flex-start",
		alignItems: "center",
	},
	authorIcon: { width: 32, height: 32 },
	authorImageIcon: { borderRadius: 32, overflow: "hidden" },
	authorText: { flex: 1, marginLeft: 12 },
	authorName: { ...Typography.Callout, color: Colors.TextPrimary },
	authorDate: { ...Typography.Footnote, color: Colors.TextLabel },
	body: { width: "100%", marginTop: 16 },
	bodyTitle: { ...Typography.ListHeading, color: Colors.TextPrimary, marginBottom: 8 },
	bodyFootnote: { ...Typography.Footnote, color: Colors.TextLabel },
	attachments: { alignItems: "flex-start", marginTop: 24 },
	separator: { height: 16 },
	commentsTitle: { ...Typography.Subheading, color: Colors.TextLabel, marginTop: 32 },
});

const COURSE_FEED_POST_QUERY = graphql(/* GraphQL */ `
	query CourseFeedPost($articleId: String!, $commentsId: String!) {
		activityFeedCommentPage(id: $commentsId) {
			activityFeedComments {
				id
				type
				author {
					imageUrl
					displayName
				}
				message
				publishedDate
			}
        }
		activityFeedArticle(id: $articleId) {
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
`);

const MOCK_COURSE_FEED_POST: {
	activityFeedArticle: ActivityFeedArticle;
	activityFeedCommentPage: ActivityFeedCommentPage;
} = {
	activityFeedArticle: {
		type: "article",
		author: { displayName: "John Doe", imageUrl: "https://i.pravatar.cc/128" },
		id: "1",
		message: "This is an announcement",
		publishedDate: "2020-12-31T00:00:00.000Z",
		commentsCount: 0,
		isPinned: false,
		commentsLink: "https://dimplace.com",
		attachmentLinks: [],
	},
	activityFeedCommentPage: { id: "1", activityFeedComments: [] },
};
