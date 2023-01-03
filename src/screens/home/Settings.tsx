import * as Application from "expo-application";
import { useState } from "react";
import { Linking, Pressable, StyleSheet, Text, View } from "react-native";
import { SettingsList } from "../../components/elements/SettingsList";
import { Container } from "../../components/layout/Container";
import type { Setting } from "../../store/settingsModel";
import { useStoreState } from "../../store/store";
import { useColorTheme } from "../../style/ColorThemeProvider";
import type { ColorTheme } from "../../style/colorThemes";
import { Typography } from "../../style/typography";

export function Settings() {
	const { Colors } = useColorTheme();
	const styles = createStyles(Colors);

	const [linkColor, setLinkColor] = useState<string>(Colors.TextLabel);
	const settings = useStoreState((state) => state.settings);

	const transformedSettings = Object.entries(settings).reduce<
		Parameters<typeof SettingsList>[0]["data"]
	>((acc, [key, value], currentIndex) => {
		if (!(key in settings)) return acc;
		const setting = value as Setting;
		acc.push({
			key: key as keyof typeof settings,
			type: setting.type,
			name: setting.name as never,
			description: setting.description,
			value: setting.value,
			enabled: setting.enabled,
			first: acc.length > 0 ? !!acc[currentIndex - 1].description : true,
			last: currentIndex === Object.keys(settings).length - 1,
		});
		return acc;
	}, []);

	return (
		<Container>
			<View>
				<Text style={styles.title}>Settings</Text>
				<SettingsList data={transformedSettings} />
			</View>
			<View style={styles.info}>
				<Text style={styles.text}>
					Version {Application.nativeApplicationVersion}{" "}
					({Application.nativeBuildVersion})
				</Text>
				<Text style={styles.text}>
					With lots of ❤️ {"\n"}
					<Text style={styles.tiny}>(and a little bit of 😡)</Text>
				</Text>
				<Pressable
					style={styles.text}
					onPress={() => Linking.openURL("mailto:hey@dimplace.com")}
					onPressIn={() => setLinkColor(Colors.Active)}
					onPressOut={() => setLinkColor(Colors.TextLabel)}
				>
					<Text style={styles.text}>
						Feedback:{" "}
						<Text style={[styles.link, { color: linkColor }]}>hey@dimplace.com</Text>
					</Text>
				</Pressable>
			</View>
		</Container>
	);
}
const createStyles = (Colors: ColorTheme) =>
	StyleSheet.create({
		title: {
			...Typography.Title,
			color: Colors.TextPrimary,
			textAlign: "center",
			marginTop: 16,
		},
		info: {
			flex: 1,
			marginVertical: 24,
			paddingHorizontal: 24,
			alignItems: "center",
			justifyContent: "flex-end",
			width: "100%",
		},
		text: {
			...Typography.Body,
			color: Colors.TextLabel,
			marginBottom: 16,
			textAlign: "center",
		},
		tiny: { ...Typography.Caption, color: Colors.TextLabel, lineHeight: 20 },
		link: { ...Typography.Callout, color: Colors.TextLabel, textDecorationLine: "underline" },
	});
