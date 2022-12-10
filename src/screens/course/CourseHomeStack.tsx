import { CompositeScreenProps, useRoute } from "@react-navigation/native";
import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack";
import { CourseFeed } from "./CourseFeed";
import { CourseFeedPost } from "./CourseFeedPost";
import type {
	CourseTabNavigatorParamList,
	CourseTabNavigatorScreenProps,
} from "./CourseNavigation";

export type CourseHomeStackParamList = {
	CourseFeed: {
		activityFeedArticles?:
			CourseTabNavigatorParamList["CourseHomeStack"]["activityFeedArticles"];
		organization?: CourseTabNavigatorParamList["CourseHomeStack"]["organization"];
	};
	CourseFeedPost: { articleId: string; orgName: string };
};
export type CourseHomeStackScreenProps<T extends keyof CourseHomeStackParamList> =
	CompositeScreenProps<
		NativeStackScreenProps<CourseHomeStackParamList, T>,
		CourseTabNavigatorScreenProps<keyof CourseTabNavigatorParamList>
	>;

const Stack = createNativeStackNavigator<CourseHomeStackParamList>();

export function CourseHomeStack() {
	const route = useRoute<CourseTabNavigatorScreenProps<"CourseHomeStack">["route"]>();
	return (
		<Stack.Navigator screenOptions={{ headerShown: false }}>
			<Stack.Screen
				name="CourseFeed"
				component={CourseFeed}
				/* pass through route parameters because nested screens otherwise can't access them */
				initialParams={route.params}
			/>
			<Stack.Screen
				name="CourseFeedPost"
				component={CourseFeedPost}
				initialParams={{ orgName: route.params.organization?.name || "" }}
				options={{ presentation: "modal" }}
			/>
		</Stack.Navigator>
	);
}
