import type { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../../styles";

interface HeaderlessContainerProps {
	style?: View["props"]["style"];
	children: ReactNode;
}
export function HeaderlessContainer({ style, children }: HeaderlessContainerProps) {
	return (
		<SafeAreaView style={baseStyles.container}>
			<View style={[baseStyles.content, style]}>{children}</View>
		</SafeAreaView>
	);
}

const baseStyles = StyleSheet.create({
	container: { backgroundColor: Colors.Background, width: "100%", height: "100%" },
	content: { paddingHorizontal: "5%", paddingTop: "2.5%" },
});
