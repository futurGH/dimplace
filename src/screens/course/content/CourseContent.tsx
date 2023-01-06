import { useNavigation, useRoute } from "@react-navigation/native";
import { QueryFunctionContext, useQuery } from "@tanstack/react-query";
import * as WebBrowser from "expo-web-browser";
import { ActivityIndicator, RefreshControl, StyleSheet, Text, View } from "react-native";
import { gqlClient } from "../../../api/gqlClient";
import { SectionList } from "../../../components/elements/SectionList";
import { Container } from "../../../components/layout/Container";
import { HeaderlessContainer } from "../../../components/layout/HeaderlessContainer";
import { graphql } from "../../../gql";
import type { CourseContentQuery } from "../../../gql/graphql";
import { useStoreActions, useStoreState } from "../../../store/store";
import { useColorTheme } from "../../../style/ColorThemeProvider";
import type { ColorTheme } from "../../../style/colorThemes";
import { Typography } from "../../../style/typography";
import { handleErrors } from "../../../util/errors";
import { formatDate } from "../../../util/formatDate";
import { query } from "../../../util/query";
import { useRefreshing } from "../../../util/useRefreshing";
import type { CourseTabNavigatorScreenProps } from "../CourseNavigation";

export function CourseContent() {
	const { Colors } = useColorTheme();
	const styles = createStyles(Colors);

	const route = useRoute<CourseTabNavigatorScreenProps<"CourseContent">["route"]>();
	const navigation = useNavigation<CourseTabNavigatorScreenProps<"CourseContent">["navigation"]>();
	const config = useStoreState((state) => state.config);
	const configActions = useStoreActions((actions) => actions.config);
	const { orgId } = route.params || {};

	gqlClient.setHeader("Authorization", "Bearer " + config.accessToken);

	const errorHandling = (error: unknown) =>
		handleErrors({ error, navigation, config, actions: configActions });
	const { data, error, isLoading, refetch, isRefetching } = useQuery({
		queryKey: ["courseContent", { accessToken: config.accessToken, orgId, demoMode: config.__DEMO__ }],
		queryFn: query(errorHandling, fetchCourseContent),
	});
	const [isRefreshing, refresh] = useRefreshing(refetch, errorHandling);

	if (isLoading && !isRefetching || error || !data) {
		return (
			<HeaderlessContainer style={{ justifyContent: "center", alignItems: "center", height: "100%" }}>
				<ActivityIndicator />
			</HeaderlessContainer>
		);
	}

	const { contentRoot } = data as { contentRoot: { modules: Array<CourseContent> } };

	// noinspection JSMismatchedCollectionQueryUpdate
	const collapsedSections: Array<string> = [];
	return (
		<Container>
			<SectionList
				sections={transformSections(contentRoot.modules)}
				collapsedSections={collapsedSections}
				keyExtractor={(item) =>
					`${item.title}-${
						// one of these has got to exist, right?
						item.modifiedDate
						|| item.viewUrl
						|| item.pdfHref
						|| item.downloadHref
						|| item.descriptionHtml}`}
				ListEmptyComponent={() => (
					<View style={styles.noContentContainer}>
						<Text style={styles.noContentTitle}>It's a ghost town! 👻</Text>
						<Text style={styles.noContentText}>
							Check back for content related to this course. Contact your instructor if
							something should be here but isn't.
						</Text>
					</View>
				)}
				onItemPress={(item) => {
					const link = item.pdfHref
						|| (item.type?.endsWith("pdf") && item.downloadHref)
						|| item.viewUrl
						|| null;
					if (!link) return;
					// openAuthSession causes (some?) auth system(s?) to return "forbidden"
					WebBrowser.openBrowserAsync(link, { windowName: item.title }).catch(
						() => {}, // top tier error handling
					);
				}}
				refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={refresh} />}
			/>
		</Container>
	);
}

function transformSections(
	sections: Array<CourseContent>,
): Array<{ title: string; label?: string; data?: Array<CourseContent> }> {
	return sections?.map((section) => {
		const { children = [], descriptionHtml, ...props } = section;
		const item: CourseContent & { label?: string } = props;
		item.showCount = true;
		item.label = descriptionHtml
			|| (item.modifiedDate ? formatDate(new Date(item.modifiedDate)) : null)
			|| undefined;
		if (item.__typename === "ContentModule") {
			return { ...item, data: transformSections(children) };
		}
		return item;
	}) || [];
}

const createStyles = (Colors: ColorTheme) =>
	StyleSheet.create({
		noContentContainer: { width: "100%", flex: 1, alignItems: "center" },
		noContentTitle: { ...Typography.Subheading, color: Colors.TextPrimary, marginBottom: 12 },
		noContentText: { ...Typography.Body, color: Colors.TextLabel, textAlign: "center" },
	});

export type CourseContent = {
	__typename?: string;
	title: string;
	descriptionHtml?: string;
	viewUrl?: string;
	downloadHref?: string;
	pdfHref?: string;
	modifiedDate?: string;
	type?: string;
	showCount?: boolean;
	children?: Array<CourseContent>;
};

export function fetchCourseContent(
	{ queryKey: [, { accessToken, orgId, demoMode }] }: QueryFunctionContext<
		[string, { accessToken: string; orgId: string; demoMode: boolean }]
	>,
) {
	if (demoMode) return MOCK_COURSE_CONTENT;
	gqlClient.setHeader("Authorization", "Bearer " + accessToken);
	return gqlClient.request(COURSE_CONTENT_QUERY, { orgId });
}

const COURSE_CONTENT_QUERY = graphql(/* GraphQL */ `
    query CourseContent($orgId: String!) {
		# I do not look forward to maintaining this
        contentRoot(organizationId: $orgId) {
            modules {
                ...CourseContent
				... on ContentModule {
					__typename
					children {
						...CourseContent
						... on ContentModule {
							__typename
							children {
								...CourseContent
								... on ContentModule {
									__typename
									children {
                                        ...CourseContent
                                        ... on ContentModule {
                                            __typename
                                            children {
                                                ...CourseContent
                                                ... on ContentModule {
                                                    __typename
                                                    children {
                                                        ...CourseContent
                                                        ... on ContentModule {
                                                            __typename
                                                            children {
                                                                ...CourseContent
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
						}
					}
				}
            }
        }
    }
	fragment CourseContent on ContentItem {
		__typename
		title
		descriptionHtml
		... on ContentTopic {
            viewUrl
            downloadHref
            pdfHref
            modifiedDate
            type
        }
	}
`);

const MOCK_COURSE_CONTENT: CourseContentQuery = {
	contentRoot: {
		modules: [{
			__typename: "ContentModule",
			title: "Module 1",
			children: [
				{ __typename: "ContentTopic", title: "Topic 1", viewUrl: "https://www.dimplace.com" },
				{ __typename: "ContentTopic", title: "Topic 2", viewUrl: "https://www.dimplace.com" },
			],
		}, {
			__typename: "ContentModule",
			title: "Module 2",
			children: [
				{ __typename: "ContentTopic", title: "Topic 3", viewUrl: "https://www.dimplace.com" },
				{ __typename: "ContentTopic", title: "Topic 4", viewUrl: "https://www.dimplace.com" },
			],
		}],
	},
} as never;
