import { useRoute } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { ImageBackground, StyleSheet, Text, View } from "react-native";
import { Container } from "../../components/layout/Container";
import { Colors, Typography } from "../../styles";
import type { CourseHomeStackScreenProps } from "./CourseHomeStack";

export function CourseFeed() {
	const route = useRoute<CourseHomeStackScreenProps<"CourseFeed">["route"]>();
	const { activityFeedArticles, organization } = route.params;
	return (
		<Container>
			<View style={styles.imageContainer}>
				<ImageBackground
					style={styles.image}
					source={{ uri: organization?.imageUrl || undefined }}
				>
					<LinearGradient
						colors={[Colors.Background + "00", Colors.Background]}
						style={styles.gradient}
					/>
				</ImageBackground>
				<Text style={styles.title}>{organization?.name}</Text>
			</View>
		</Container>
	);
}

const styles = StyleSheet.create({
	imageContainer: {
		width: "100%",
		height: 144,
		maxHeight: "25%",
		flex: 1,
		justifyContent: "center",
		borderRadius: 16,
		overflow: "hidden",
	},
	image: { flex: 1, justifyContent: "center", resizeMode: "cover" },
	gradient: { width: "100%", height: "100%" },
	title: {
		...Typography.Title,
		color: Colors.TextPrimary,
		position: "absolute",
		bottom: 16,
		left: 24,
		right: 24,
	},
});
