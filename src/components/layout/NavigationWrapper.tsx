import {
	useFonts,
	WorkSans_400Regular,
	WorkSans_500Medium,
	WorkSans_700Bold,
} from "@expo-google-fonts/work-sans";
import {
	LinkingOptions,
	NavigationContainer,
	NavigatorScreenParams,
} from "@react-navigation/native";
import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack";
import { useStoreRehydrated } from "easy-peasy";
import * as Linking from "expo-linking";
import * as SplashScreen from "expo-splash-screen";
import { useCallback } from "react";
import {
	CourseNavigation,
	CourseTabNavigatorParamList,
} from "../../screens/course/CourseNavigation";
import { Home } from "../../screens/home/Home";
import { AuthWebView } from "../../screens/onboarding/AuthWebView";
import { InstitutionSelection } from "../../screens/onboarding/InstitutionSelection";
import { Onboarding } from "../../screens/onboarding/Onboarding";
import { useStoreState } from "../../store/store";
import { Header } from "./Header";

export type StackParamList = {
	Onboarding: undefined;
	InstitutionSelection: undefined;
	AuthWebView: { source: string };
	Home: undefined;
	CourseNavigation: NavigatorScreenParams<CourseTabNavigatorParamList> & { id: string };
};
export type RootStackScreenProps<T extends keyof StackParamList> = NativeStackScreenProps<
	StackParamList,
	T
>;

const Stack = createNativeStackNavigator<StackParamList>();

declare global {
	namespace ReactNavigation {
		interface RootParamList extends StackParamList {}
	}
}

export function NavigationWrapper() {
	const [fontsLoaded] = useFonts({
		WorkRegular: WorkSans_400Regular,
		WorkMedium: WorkSans_500Medium,
		WorkBold: WorkSans_700Bold,
	});

	const rehydrated = useStoreRehydrated();
	const config = useStoreState((state) => state.config);

	const onReady = useCallback(async () => {
		if (fontsLoaded && rehydrated) {
			await SplashScreen.hideAsync();
		}
	}, [fontsLoaded, rehydrated]);

	if (!fontsLoaded || !rehydrated) {
		return null;
	}

	const linking: LinkingOptions<StackParamList> = {
		prefixes: [Linking.createURL("/")],
		config: {
			screens: {
				Home: { path: "courses" },
				CourseNavigation: {
					path: "courses/:id",
					initialRouteName: "CourseHomeStack" as never,
					screens: {
						CourseHomeStack: {
							path: "",
							initialRouteName: "CourseFeed" as never,
							screens: { CourseFeed: "feed" },
						},
						CourseContent: "content",
						CourseAssignments: "assignments",
						CourseGrades: "grades",
					},
				},
			},
		},
	};
	return (
		<NavigationContainer linking={linking} onReady={onReady}>
			<Stack.Navigator screenOptions={{ header: Header, headerShown: false }}>
				<Stack.Group navigationKey="Onboarding">
					{!config.onboarded && (
						<>
							<Stack.Screen name="Onboarding" component={Onboarding} />
							<Stack.Screen
								name="InstitutionSelection"
								component={InstitutionSelection}
							/>
						</>
					)}
					<Stack.Screen
						name="AuthWebView"
						component={AuthWebView}
						initialParams={{ source: "" }}
					/>
				</Stack.Group>
				<Stack.Group navigationKey="Home">
					<Stack.Screen
						name="Home"
						component={Home}
						options={{ headerShown: true, title: "Courses", gestureEnabled: false }}
					/>
				</Stack.Group>
				<Stack.Screen name="CourseNavigation" component={CourseNavigation} />
			</Stack.Navigator>
		</NavigationContainer>
	);
}
