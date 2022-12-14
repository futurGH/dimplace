import { useRoute } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { gqlClient } from "../../api/gqlClient";
import { SectionList } from "../../components/elements/SectionList";
import { Container } from "../../components/layout/Container";
import { HeaderlessContainer } from "../../components/layout/HeaderlessContainer";
import { graphql } from "../../gql";
import { useStoreActions, useStoreState } from "../../store/store";
import { Colors, Typography } from "../../styles";
import { handleErrors } from "../../util/errors";
import { formatDateAndTime } from "../../util/formatDate";
import type { CourseTabNavigatorScreenProps } from "./CourseNavigation";

export function CourseContent() {
	const route = useRoute<CourseTabNavigatorScreenProps<"CourseContent">["route"]>();
	const config = useStoreState((state) => state.config);
	const configActions = useStoreActions((actions) => actions.config);
	const { orgId } = route.params;

	gqlClient.setHeader("Authorization", "Bearer " + config.accessToken);

	const { data, error: errors, isLoading, refetch } = useQuery({
		queryKey: ["courseContent", { orgId }],
		queryFn: () => gqlClient.request(COURSE_CONTENT_QUERY, { orgId }),
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

	if (errors || !data?.contentRoot) {
		handleErrors({ errors, refetch, config, actions: configActions });
		console.error(errors);
	}

	const { contentRoot } = data as { contentRoot: { modules: Array<CourseContent> } };

	return (
		<Container>
			<SectionList
				sections={transformSections(contentRoot.modules)}
				ListEmptyComponent={() => (
					<View style={styles.noContentContainer}>
						<Text style={styles.noContentTitle}>It's a ghost town! 👻</Text>
						<Text style={styles.noContentText}>
							Check back for content related to this course. Contact your instructor
							if something should be here but isn't.
						</Text>
					</View>
				)}
			/>
		</Container>
	);
}

function transformSections(
	sections: Array<CourseContent>,
): Array<{ title: string; label?: string; data?: Array<CourseContent> }> {
	return sections?.map((section) => {
		const { children, ...props } = section;
		const item: CourseContent & { label?: string } = props;
		item.showCount = true;
		item.collapsed = false;
		if (item.modifiedDate) {
			item.label = formatDateAndTime(new Date(item.modifiedDate));
		}
		if (section.__typename === "ContentModule") {
			return { ...item, data: children?.length ? transformSections(children) : [] };
		}
		return item;
	}) || [];
}

const styles = StyleSheet.create({
	noContentContainer: { width: "100%", flex: 1, alignItems: "center" },
	noContentTitle: { ...Typography.Subheading, color: Colors.TextPrimary, marginBottom: 12 },
	noContentText: { ...Typography.Body, color: Colors.TextLabel, textAlign: "center" },
});

export type CourseContent = {
	__typename?: string;
	title: string;
	viewUrl?: string;
	modifiedDate?: string;
	type?: string;
	showCount?: boolean;
	collapsed?: boolean;
	children?: Array<CourseContent>;
};

const COURSE_CONTENT_QUERY = graphql(/* GraphQL */ `
    query CourseContent($orgId: String!) {
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
								# If your course content needs to be nested more than 3 levels, that's a you problem
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
	fragment CourseContent on ContentItem {
		__typename
		title
		... on ContentTopic {
			viewUrl
			modifiedDate
			type
		}
	}
`);
