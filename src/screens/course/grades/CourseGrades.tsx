import { useNavigation, useRoute } from "@react-navigation/native";
import { QueryFunctionContext, useQuery } from "@tanstack/react-query";
import { ActivityIndicator, StyleSheet, Text } from "react-native";
import { gqlClient } from "../../../api/gqlClient";
import { List, ListItem, makeListItemStyles } from "../../../components/elements/List";
import { Container } from "../../../components/layout/Container";
import { HeaderlessContainer } from "../../../components/layout/HeaderlessContainer";
import { graphql } from "../../../gql";
import type { CourseGradesQuery } from "../../../gql/graphql";
import { useStoreActions, useStoreState } from "../../../store/store";
import { Colors, Typography } from "../../../styles";
import { handleErrors } from "../../../util/errors";
import { query } from "../../../util/query";
import type { CourseTabNavigatorScreenProps } from "../CourseNavigation";

export function CourseGrades() {
	const route = useRoute<CourseTabNavigatorScreenProps<"CourseGrades">["route"]>();
	const navigation = useNavigation<CourseTabNavigatorScreenProps<"CourseGrades">["navigation"]>();
	const config = useStoreState((state) => state.config);
	const configActions = useStoreActions((actions) => actions.config);
	const { orgId } = route.params || {};

	const errorHandling = (error: unknown) =>
		handleErrors({ error, navigation, config, actions: configActions });
	const { data, error, isLoading } = useQuery({
		queryKey: ["courseGrades", {
			accessToken: config.accessToken,
			orgId,
			demoMode: config.__DEMO__,
		}],
		queryFn: query(errorHandling, fetchCourseGrades),
	});

	if (isLoading || error || !data) {
		return (
			<HeaderlessContainer
				style={{ justifyContent: "center", alignItems: "center", height: "100%" }}
			>
				<ActivityIndicator />
			</HeaderlessContainer>
		);
	}

	const grades = data.userGrades.map((grade) => {
		return {
			title: grade.value,
			label: grade.name,
			weight: grade.activity?.gradeInfo?.type === "weighted"
				? grade.activity?.gradeInfo?.value
					? new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(
						grade.activity?.gradeInfo.value,
					)
					: null
				: null,
		};
	});

	const listItemStyles = makeListItemStyles(false);
	listItemStyles.title = {
		...listItemStyles.title,
		...Typography.Heading,
		color: Colors.TextPrimary,
	};
	listItemStyles.label = { ...listItemStyles.label, ...Typography.Body, color: Colors.TextLabel };
	return (
		<Container>
			<List
				data={grades}
				renderItem={({ item }) => {
					return (
						<ListItem
							title={
								<>
									{item.title}
									{item.weight
										? (
											<>
												&nbsp;{
													<Text style={styles.weight}>
														({item.weight}%)
													</Text>
												}
											</>
										)
										: null}
								</>
							}
							label={item.label}
							styles={listItemStyles}
						/>
					);
				}}
				showsVerticalScrollIndicator={false}
			/>
		</Container>
	);
}

const styles = StyleSheet.create({ weight: { ...Typography.Body, color: Colors.TextLabel } });

export function fetchCourseGrades(
	{ queryKey: [, { accessToken, orgId, demoMode }] }: QueryFunctionContext<
		[string, { accessToken: string; orgId: string; demoMode: boolean }]
	>,
) {
	if (demoMode) return MOCK_COURSE_GRADES;
	gqlClient.setHeader("Authorization", "Bearer " + accessToken);
	return gqlClient.request(COURSE_GRADES_QUERY, { orgId });
}

export const COURSE_GRADES_QUERY = graphql(/* GraphQL */ `
    query CourseGrades($orgId: String!) {
		userGrades(organization: $orgId) {
			activity {
				id
				gradeInfo {
					type
					value
				}
			}
			name
			value
		}
    }
`);

const MOCK_COURSE_GRADES: CourseGradesQuery = {
	userGrades: [{
		activity: { id: "1", gradeInfo: { type: "weighted", value: 97 } },
		name: "Assignment 1",
		value: "34 / 35",
	}],
};
