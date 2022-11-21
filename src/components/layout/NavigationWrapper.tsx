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
import { Onboarding } from "../../screens/Onboarding";
import { useStoreState } from "../../store/store";

const Stack = createNativeStackNavigator();

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
				{!config.onboarded && <Stack.Screen name="Onboarding" component={Onboarding} />}
			</Stack.Navigator>
		</NavigationContainer>
	);
}
