import { View, ViewStyle } from "react-native";
import { useColorTheme } from "../../style/ColorThemeProvider";

export function ItemSeparator({ style }: { style?: ViewStyle }) {
	const { Colors } = useColorTheme();
	return <View style={{ height: 1, width: "100%", backgroundColor: Colors.Border, ...style }} />;
}
