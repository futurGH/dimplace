import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StoreProvider } from "easy-peasy";
import Constants from "expo-constants";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import shimAllSettled from "promise.allsettled/shim";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as Sentry from "sentry-expo";
import { NavigationWrapper } from "./src/components/layout/NavigationWrapper";
import { store } from "./src/store/store";
import { ColorThemeProvider } from "./src/style/ColorThemeProvider";
import "react-native-gesture-handler";

Sentry.init({ enableInExpoDevelopment: true, dsn: Constants.expoConfig?.extra?.sentry.dsn });

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: true, retryDelay: 3000 } } });

SplashScreen.preventAutoHideAsync();

shimAllSettled();

export default Sentry.Native.wrap(function App() {
	return (
		<>
			<StatusBar style="light" backgroundColor="#131720" />
			<SafeAreaProvider>
				<QueryClientProvider client={queryClient}>
					<StoreProvider store={store}>
						<ColorThemeProvider>
							<NavigationWrapper />
						</ColorThemeProvider>
					</StoreProvider>
				</QueryClientProvider>
			</SafeAreaProvider>
		</>
	);
});

export { queryClient, Sentry };
