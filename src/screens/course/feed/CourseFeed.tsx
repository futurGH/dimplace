import { useNavigation, useRoute } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { Dimensions, FlatList, ImageBackground, StyleSheet, Text, View } from "react-native";
import {
	AnnouncementCard,
	AnnouncementCardProps,
} from "../../../components/course/feed/AnnouncementCard";
import { Container } from "../../../components/layout/Container";
import { useColorTheme } from "../../../style/ColorThemeProvider";
import type { ColorTheme } from "../../../style/colorThemes";
import { Typography } from "../../../style/typography";
import type { CourseHomeStackScreenProps } from "./CourseHomeStack";

export function CourseFeed() {
	const { Colors } = useColorTheme();
	const styles = createStyles(Colors);

	const route = useRoute<CourseHomeStackScreenProps<"CourseFeed">["route"]>();
	const navigation = useNavigation<CourseHomeStackScreenProps<"CourseFeed">["navigation"]>();
	const { activityFeedArticles, organization } = route.params;
	const windowHeight = Dimensions.get("window").height;
	return (
		<Container>
			<FlatList
				data={activityFeedArticles}
				renderItem={({ item: _item }) => {
					const item = _item as unknown as AnnouncementCardProps;
					return (
						<AnnouncementCard
							{...item}
							onPress={() =>
								navigation.navigate("CourseFeedPost", {
									articleId: item.id,
									orgName: organization?.name || "Announcement",
								})}
						/>
					);
				}}
				ListHeaderComponent={
					<View style={[styles.imageContainer, { maxHeight: windowHeight / 4 }]}>
						<ImageBackground
							style={styles.image}
							source={{ uri: organization?.imageUrl || undefined }}
						>
							<LinearGradient
								colors={[Colors.Background + "22", Colors.Background]}
								style={styles.gradient}
							/>
						</ImageBackground>
						<Text style={styles.title}>{organization?.name}</Text>
					</View>
				}
				ItemSeparatorComponent={() => <View style={styles.separator} />}
				ListEmptyComponent={() => (
					<View style={styles.noFeedContainer}>
						<Text style={styles.noFeedTitle}>Nothing to see here!</Text>
						<Text style={styles.noFeedText}>
							There don’t appear to be any posts here yet. Check back for
							announcements, assignments, and updates from your teacher.
						</Text>
					</View>
				)}
				showsVerticalScrollIndicator={false}
				extraData={Colors.Active}
			/>
		</Container>
	);
}

const createStyles = (Colors: ColorTheme) =>
	StyleSheet.create({
		imageContainer: {
			width: "100%",
			height: 144,
			flex: 1,
			justifyContent: "center",
			borderRadius: 16,
			overflow: "hidden",
			marginBottom: 32,
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
		feed: { width: "100%", flex: 1, flexGrow: 1 },
		separator: { height: 24 },
		noFeedContainer: { width: "100%", flex: 1, alignItems: "center" },
		noFeedTitle: { ...Typography.Subheading, color: Colors.TextPrimary, marginBottom: 12 },
		noFeedText: { ...Typography.Body, color: Colors.TextLabel, textAlign: "center" },
	});
