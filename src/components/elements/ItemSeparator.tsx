import { View, ViewStyle } from "react-native";
import { Colors } from "../../styles";

export function ItemSeparator({ style }: { style?: ViewStyle }) {
	return <View style={{ height: 1, width: "100%", backgroundColor: Colors.Border, ...style }} />;
}
