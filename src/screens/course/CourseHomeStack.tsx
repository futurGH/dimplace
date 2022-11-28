import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { CourseFeed } from "./CourseFeed";

export type CourseHomeStackParamList = { Feed: undefined; Comment: undefined };

const Stack = createNativeStackNavigator<CourseHomeStackParamList>();

export function CourseHomeStack() {
	return (
		<Stack.Navigator>
			<Stack.Screen name="Feed" component={CourseFeed} />
		</Stack.Navigator>
	);
}
