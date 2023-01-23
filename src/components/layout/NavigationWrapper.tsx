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
import {
	CardStyleInterpolators,
	createStackNavigator,
	StackNavigationOptions,
	StackScreenProps,
	TransitionSpecs,
} from "@react-navigation/stack";
import { useStoreRehydrated } from "easy-peasy";
import * as Linking from "expo-linking";
import * as SplashScreen from "expo-splash-screen";
import { useCallback } from "react";
import { Pressable, View } from "react-native";
import { CircleMenuIcon } from "../../assets/icons/circle-menu";
import { NotificationBellIcon } from "../../assets/icons/notification-bell";
import { CourseAssignmentModal } from "../../screens/course/assignments/CourseAssignmentModal";
import { CourseNavigation, CourseTabNavigatorParamList } from "../../screens/course/CourseNavigation";
import { CourseFeedPostModal } from "../../screens/course/feed/CourseFeedPostModal";
import { Home } from "../../screens/home/Home";
import { Notifications } from "../../screens/home/Notifications";
import { Settings } from "../../screens/home/Settings";
import { WebViewModal, type WebViewModalProps } from "../../screens/misc/WebViewModal";
import { AuthWebView } from "../../screens/onboarding/AuthWebView";
import { InstitutionSelection } from "../../screens/onboarding/InstitutionSelection";
import { Onboarding } from "../../screens/onboarding/Onboarding";
import { useStoreState } from "../../store/store";
import { useColorTheme } from "../../style/ColorThemeProvider";
import type { ColorTheme } from "../../style/colorThemes";
import { Header } from "./Header";

export type StackParamList = {
	Onboarding: undefined;
	InstitutionSelection: undefined;
	AuthWebView: { source: string };
	Home: undefined;
	CourseNavigation: NavigatorScreenParams<CourseTabNavigatorParamList> & { id: string };
	CourseFeedPostModal: { articleId: string; orgName: string };
	CourseAssignmentModal: {
		orgId: string;
		orgName: string;
		activityId: string;
		usage?: string;
		userId?: string;
	};
	SettingsModal: undefined;
	NotificationsModal: undefined;
	WebViewModal: WebViewModalProps;
};
export type RootStackScreenProps<T extends keyof StackParamList> = StackScreenProps<StackParamList, T>;

const Stack = createStackNavigator<StackParamList>();

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
	const config = useStoreState((state) => state.config);

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
				Home: "",
				CourseNavigation: {
					path: "courses/:id",
					initialRouteName: "CourseHomeStack" as never,
					screens: {
						CourseFeed: "feed",
						CourseContent: "content",
						CourseAssignments: "assignments",
						CourseGrades: "grades",
					},
				},
				CourseFeedPostModal: "courses/:id/article/:articleId",
				CourseAssignmentModal: "courses/:id/assignments/:activityId/usages/:usage/users/:userId",
				SettingsModal: "settings",
				NotificationsModal: "notifications",
			},
		},
	};
	return (
		<View style={{ flex: 1, backgroundColor: Colors.Background }}>
			<NavigationContainer
				linking={linking}
				onReady={onReady}
				ref={navRef}
				theme={{ dark: true, colors: { ...DefaultTheme.colors, background: Colors.Background } }}
			>
				<Stack.Navigator
					screenOptions={{ header: Header, headerShown: false }}
					initialRouteName={config.onboarded ? "Home" : "Onboarding"}
				>
					<Stack.Group navigationKey="Onboarding">
						<Stack.Screen name="Onboarding" component={Onboarding} />
						<Stack.Screen name="InstitutionSelection" component={InstitutionSelection} />
						<Stack.Screen
							name="AuthWebView"
							component={AuthWebView}
							initialParams={{ source: "" }}
						/>
					</Stack.Group>
					<Stack.Screen
						name="Home"
						component={Home}
						options={{
							headerShown: true,
							title: "Courses",
							headerLeft: () => (
								<Pressable
									onPress={() => navRef.isReady() && navRef.navigate("SettingsModal")}
									style={iconStyles}
								>
									<CircleMenuIcon {...iconStyles} />
								</Pressable>
							),
							headerRight: () => (
								<Pressable
									onPress={() => navRef.isReady() && navRef.navigate("NotificationsModal")}
									style={iconStyles}
								>
									<NotificationBellIcon {...iconStyles} />
								</Pressable>
							),
							gestureEnabled: false,
						}}
					/>
					<Stack.Screen name="CourseNavigation" component={CourseNavigation} />

					<Stack.Group navigationKey="Modals" screenOptions={modalOptions}>
						<Stack.Screen name="CourseFeedPostModal" component={CourseFeedPostModal} />
						<Stack.Screen name="CourseAssignmentModal" component={CourseAssignmentModal} />
						<Stack.Screen name="SettingsModal" component={Settings} />
						<Stack.Screen name="NotificationsModal" component={Notifications} />
						<Stack.Screen name="WebViewModal" component={WebViewModal} />
					</Stack.Group>
				</Stack.Navigator>
			</NavigationContainer>
		</View>
	);
}

const modalOptions: StackNavigationOptions = {
	presentation: "modal",
	gestureEnabled: true,
	gestureVelocityImpact: 0.5,
	cardStyleInterpolator: CardStyleInterpolators.forModalPresentationIOS,
	transitionSpec: { open: TransitionSpecs.TransitionIOSSpec, close: TransitionSpecs.TransitionIOSSpec },
};

const createIconStyles = (Colors: ColorTheme) => ({ width: 24, height: 24, fill: Colors.TextPrimary });
