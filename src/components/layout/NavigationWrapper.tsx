import {
	useFonts,
	WorkSans_400Regular,
	WorkSans_500Medium,
	WorkSans_700Bold,
} from "@expo-google-fonts/work-sans";
import {
	createNavigationContainerRef,
	DefaultTheme,
	LinkingOptions,
	NavigationContainer,
	NavigatorScreenParams,
} from "@react-navigation/native";
import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack";
import { useStoreRehydrated } from "easy-peasy";
import * as Linking from "expo-linking";
import * as SplashScreen from "expo-splash-screen";
import { useCallback } from "react";
import { Pressable, View } from "react-native";
import { CircleMenuIcon } from "../../assets/icons/circle-menu";
import { NotificationBellIcon } from "../../assets/icons/notification-bell";
import {
	CourseNavigation,
	CourseTabNavigatorParamList,
} from "../../screens/course/CourseNavigation";
import { Home } from "../../screens/home/Home";
import { Notifications } from "../../screens/home/Notifications";
import { Settings } from "../../screens/home/Settings";
import { AuthWebView } from "../../screens/onboarding/AuthWebView";
import { InstitutionSelection } from "../../screens/onboarding/InstitutionSelection";
import { Onboarding } from "../../screens/onboarding/Onboarding";
import { useColorTheme } from "../../style/ColorThemeProvider";
import type { ColorTheme } from "../../style/colorThemes";
import { Header } from "./Header";

export type StackParamList = {
	Onboarding: undefined;
	InstitutionSelection: undefined;
	AuthWebView: { source: string };
	Home: undefined;
	Notifications: undefined;
	Settings: undefined;
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
	const { Colors } = useColorTheme();

	const [fontsLoaded] = useFonts({
		WorkRegular: WorkSans_400Regular,
		WorkMedium: WorkSans_500Medium,
		WorkBold: WorkSans_700Bold,
	});

	const rehydrated = useStoreRehydrated();

	const onReady = useCallback(async () => {
		if (fontsLoaded && rehydrated) {
			await SplashScreen.hideAsync();
		}
	}, [fontsLoaded, rehydrated]);

	const navRef = createNavigationContainerRef();

	if (!fontsLoaded || !rehydrated || !Colors) {
		return null;
	}

	const iconStyles = createIconStyles(Colors);

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
							screens: { CourseFeed: "feed", CourseFeedPost: "article/:articleId" },
						},
						CourseContent: "content",
						CourseAssignmentsStack: {
							path: "assignments",
							initialRouteName: "CourseAssignments" as never,
							screens: {
								CourseAssignments: "",
								CourseAssignmentView: ":activityId/usages/:usage/users/:userId",
							},
						},
						CourseGrades: "grades",
					},
				},
				Notifications: "notifications",
				Settings: "settings",
			},
		},
	};
	return (
		<View style={{ flex: 1, backgroundColor: Colors.Background }}>
			<NavigationContainer
				linking={linking}
				onReady={onReady}
				ref={navRef}
				theme={{
					dark: true,
					colors: { ...DefaultTheme.colors, background: Colors.Background },
				}}
			>
				<Stack.Navigator screenOptions={{ header: Header, headerShown: false }}>
					<Stack.Group navigationKey="Onboarding">
						<Stack.Screen name="Onboarding" component={Onboarding} />
						<Stack.Screen
							name="InstitutionSelection"
							component={InstitutionSelection}
						/>
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
							options={{
								headerShown: true,
								title: "Courses",
								headerLeft: () => (
									<Pressable
										onPress={() =>
											navRef.isReady() && navRef.navigate("Settings")}
									>
										<CircleMenuIcon {...iconStyles} />
									</Pressable>
								),
								headerRight: () => (
									<Pressable
										onPress={() =>
											navRef.isReady() && navRef.navigate("Notifications")}
									>
										<NotificationBellIcon {...iconStyles} />
									</Pressable>
								),
								gestureEnabled: false,
							}}
						/>
						<Stack.Screen
							name="Notifications"
							component={Notifications}
							options={{ presentation: "modal" }}
						/>
						<Stack.Screen
							name="Settings"
							component={Settings}
							options={{ presentation: "modal" }}
						/>
					</Stack.Group>
					<Stack.Screen name="CourseNavigation" component={CourseNavigation} />
				</Stack.Navigator>
			</NavigationContainer>
		</View>
	);
}

const createIconStyles = (Colors: ColorTheme) => ({
	width: 24,
	height: 24,
	fill: Colors.TextPrimary,
});
