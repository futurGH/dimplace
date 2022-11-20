import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Onboarding } from "./src/screens/Onboarding";

const Stack = createNativeStackNavigator();

export default function App() {
	return (
		<NavigationContainer>
			<Stack.Navigator>
				<Stack.Screen name="Onboarding" component={Onboarding} />
			</Stack.Navigator>
		</NavigationContainer>
	);
}
