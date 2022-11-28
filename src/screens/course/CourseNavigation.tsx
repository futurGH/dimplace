import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { CourseHomeStack } from "./CourseHomeStack";

export type CourseTabNavigatorParamList = {
	CourseHome: undefined;
	Content: undefined;
	Assignments: undefined;
	Grades: undefined;
};

const Tab = createBottomTabNavigator<CourseTabNavigatorParamList>();

export function CourseNavigation() {
	return (
		<Tab.Navigator>
			<Tab.Screen name="CourseHome" component={CourseHomeStack} />
		</Tab.Navigator>
	);
}
