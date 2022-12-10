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
import RenderHtml, { defaultSystemFonts } from "react-native-render-html";
import { gqlClient } from "../../api/gqlClient";
import { DocumentIcon } from "../../assets/icons/document";
import { ImageIcon } from "../../assets/icons/image";
import { LinkIcon } from "../../assets/icons/link";
import { UserProfileIcon } from "../../assets/icons/user-profile";
import { Chip } from "../../components/elements/Chip";
import { Container } from "../../components/layout/Container";
import { HeaderlessContainer } from "../../components/layout/HeaderlessContainer";
import { graphql } from "../../gql";
import type {
	ArticleDetailsFragmentFragment,
	AssignmentDetailsFragmentFragment,
	FeedItemFragmentFragment,
	FeedPostFragmentFragment,
} from "../../gql/graphql";
import { useStoreActions, useStoreState } from "../../store/store";
import { Colors, Typography } from "../../styles";
import { handleErrors } from "../../util/errors";
import { formatDate } from "../../util/formatDate";
import type { CourseHomeStackScreenProps } from "./CourseHomeStack";
import { CoursePageHeaderLeftButton } from "./CourseNavigation";

export function CourseFeedPost() {
	const route = useRoute<CourseHomeStackScreenProps<"CourseFeedPost">["route"]>();
	const navigation = useNavigation();
	const { articleId, orgName } = route.params;
	if (!articleId) {
		navigation.canGoBack() ? navigation.goBack() : navigation.navigate("Home");
	}
	navigation.getParent()?.setOptions({
		headerTitle: orgName || "Course",
		headerLeft: () => <CoursePageHeaderLeftButton text="" />,
		headerRight: undefined,
	});
	const commentsId = `${articleId}/comment/all`;
	const config = useStoreState((state) => state.config);
	const configActions = useStoreActions((actions) => actions.config);

	gqlClient.setHeader("Authorization", "Bearer " + config.accessToken);

	const { data: _data, error: errors, isLoading, refetch } = useQuery({
		queryKey: ["article", articleId],
		queryFn: async () => gqlClient.request(COURSE_FEED_POST_QUERY, { articleId, commentsId }),
	});

	if (isLoading || !_data?.activityFeedArticle || !_data?.activityFeedCommentPage) {
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

	const { activityFeedComments } = _data.activityFeedCommentPage;
	const activityFeedArticle = _data.activityFeedArticle as
		& FeedItemFragmentFragment
		& FeedPostFragmentFragment
		& (ArticleDetailsFragmentFragment | AssignmentDetailsFragmentFragment);

	const body = "message" in activityFeedArticle
		? activityFeedArticle.message
		: activityFeedArticle.instructions;

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
							{width
								? (
									<RenderHtml
										source={{
											html: body || "Failed to fetch comment content.",
										}}
										contentWidth={width - 48}
										tagsStyles={{
											p: { marginVertical: 0, ...styles.bodyText },
											a: {
												color: Colors.Active,
												textDecorationColor: Colors.Active,
											},
										}}
										systemFonts={[
											"WorkRegular",
											"WorkMedium",
											...defaultSystemFonts,
										]}
										enableExperimentalGhostLinesPrevention={true}
										enableExperimentalBRCollapsing={true}
										enableExperimentalMarginCollapsing={true}
									/>
								)
								: null}
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
											text={item.name}
											onPress={() => Linking.openURL(item.href)}
											key={item.id || item.name}
										/>
									);
								}}
								ItemSeparatorComponent={() => (
									<View style={styles.attachmentSeparator} />
								)}
								showsVerticalScrollIndicator={false}
							/>
						</View>
					</View>
				)}
				renderItem={() => null}
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
	bodyText: { ...Typography.Body, color: Colors.TextPrimary },
	bodyFootnote: { ...Typography.Footnote, color: Colors.TextLabel },
	attachments: { alignItems: "flex-start", marginTop: 24 },
	attachmentSeparator: { height: 16 },
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
