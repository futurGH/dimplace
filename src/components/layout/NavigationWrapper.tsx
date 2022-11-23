import {
	useFonts,
	WorkSans_400Regular,
	WorkSans_500Medium,
	WorkSans_700Bold,
} from "@expo-google-fonts/work-sans";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useStoreRehydrated } from "easy-peasy";
import * as SplashScreen from "expo-splash-screen";
import { useCallback } from "react";
import { Home } from "../../screens/home/Home";
import { AuthWebView } from "../../screens/onboarding/AuthWebView";
import { InstitutionSelection } from "../../screens/onboarding/InstitutionSelection";
import { Onboarding } from "../../screens/onboarding/Onboarding";
import { useStoreState } from "../../store/store";

export type StackParamList = {
	Onboarding: undefined;
	InstitutionSelection: undefined;
	AuthWebView: { source: string };
	Home: undefined;
};
const Stack = createNativeStackNavigator<StackParamList>();

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
	return (
		<NavigationContainer onReady={onReady}>
			<Stack.Navigator screenOptions={{ headerShown: false }}>
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
					<Stack.Screen name="Home" component={Home} />
				</Stack.Group>
			</Stack.Navigator>
		</NavigationContainer>
	);
}
