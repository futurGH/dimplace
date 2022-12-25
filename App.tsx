import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StoreProvider } from "easy-peasy";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import shimAllSettled from "promise.allsettled/shim";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationWrapper } from "./src/components/layout/NavigationWrapper";
import { store } from "./src/store/store";

const queryClient = new QueryClient({
	defaultOptions: { queries: { retry: true, retryDelay: 3000 } },
});

SplashScreen.preventAutoHideAsync();

shimAllSettled();

export default function App() {
	return (
		<>
			<StatusBar style="light" backgroundColor="#131720" />
			<SafeAreaProvider>
				<QueryClientProvider client={queryClient}>
					<StoreProvider store={store}>
						<NavigationWrapper />
					</StoreProvider>
				</QueryClientProvider>
			</SafeAreaProvider>
		</>
	);
}
