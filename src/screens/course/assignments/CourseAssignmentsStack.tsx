import { CompositeScreenProps, useRoute } from "@react-navigation/native";
import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack";
import type {
	CourseTabNavigatorParamList,
	CourseTabNavigatorScreenProps,
} from "../CourseNavigation";
import { CourseAssignments } from "./CourseAssignments";
import { CourseAssignmentView } from "./CourseAssignmentView";

export type CourseAssignmentsStackParamList = {
	CourseAssignments: { orgId: string; orgName: string };
	CourseAssignmentView: {
		orgId: string;
		orgName: string;
		activityId: string;
		usage?: string;
		userId?: string;
	};
};
export type CourseAssignmentsStackScreenProps<T extends keyof CourseAssignmentsStackParamList> =
	CompositeScreenProps<
		NativeStackScreenProps<CourseAssignmentsStackParamList, T>,
		CourseTabNavigatorScreenProps<keyof CourseTabNavigatorParamList>
	>;

const Stack = createNativeStackNavigator<CourseAssignmentsStackParamList>();

export function CourseAssignmentsStack() {
	const route = useRoute<CourseTabNavigatorScreenProps<"CourseAssignmentsStack">["route"]>();
	return (
		<Stack.Navigator screenOptions={{ headerShown: false }}>
			<Stack.Screen
				name="CourseAssignments"
				component={CourseAssignments}
				initialParams={{ orgName: route.params.orgName || "", orgId: route.params.orgId }}
			/>
			<Stack.Screen
				name="CourseAssignmentView"
				component={CourseAssignmentView}
				initialParams={{ orgName: route.params.orgName || "", orgId: route.params.orgId }}
				options={{ presentation: "modal" }}
			/>
		</Stack.Navigator>
	);
}
