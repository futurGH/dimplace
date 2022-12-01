import { useRoute } from "@react-navigation/native";
import { Text } from "react-native";
import { HeaderlessContainer } from "../../components/layout/HeaderlessContainer";
import type { CourseHomeStackScreenProps } from "./CourseHomeStack";

export function CourseFeed() {
	const route = useRoute<CourseHomeStackScreenProps<"CourseFeed">["route"]>();
	const { id } = route.params;
	return (
		<HeaderlessContainer>
			<Text>hi</Text>
		</HeaderlessContainer>
	);
}
