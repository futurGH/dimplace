import { StoreProvider } from "easy-peasy";
import * as SplashScreen from "expo-splash-screen";
import { NavigationWrapper } from "./src/components/layout/NavigationWrapper";
import { store } from "./src/store/store";

SplashScreen.preventAutoHideAsync();

export default function App() {
	return (
		<StoreProvider store={store}>
			<NavigationWrapper />
		</StoreProvider>
	);
}
