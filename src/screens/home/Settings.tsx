import * as Application from "expo-application";
import { useState } from "react";
import { Linking, Pressable, StyleSheet, Text, View } from "react-native";
import { SettingsList } from "../../components/elements/SettingsList";
import { Container } from "../../components/layout/Container";
import { Header } from "../../components/layout/Header";
import type { Setting } from "../../store/settingsModel";
import { useStoreState } from "../../store/store";
import { useColorTheme } from "../../style/ColorThemeProvider";
import type { ColorTheme } from "../../style/colorThemes";
import { Typography } from "../../style/typography";

export function Settings() {
	const { Colors } = useColorTheme();
	const styles = createStyles(Colors);

	const [linkColor, setLinkColor] = useState<string>(Colors.TextLabel);

	const settingsModel = useStoreState((state) => state.settings);
	const settings = Object.entries(settingsModel).filter(([k, s]) =>
		k in settingsModel && s.name?.trim?.()?.length && s.type?.trim?.()?.length
	);

	const transformedSettings = settings.reduce<Parameters<typeof SettingsList>[0]["data"]>(
		(acc, [key, value], currentIndex) => {
			const setting = value as Setting;
			acc.push({
				key: key as keyof typeof settingsModel,
				type: setting.type,
				name: setting.name as never,
				description: setting.description,
				value: setting.value,
				enabled: setting.enabled,
				first: acc.length > 0 ? !!acc[currentIndex - 1].description : true,
				last: currentIndex === Object.keys(settings).length - 1,
			});
			return acc;
		},
		[],
	);

	return (
		<Container>
			<View style={{ flexGrow: 1 }}>
				<Header route={{ name: "Settings" }} paddingTop={0} />
				<SettingsList data={transformedSettings} />
			</View>
			<View style={styles.info}>
				<Text style={styles.text}>
					Version {Application.nativeApplicationVersion} ({Application.nativeBuildVersion})
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
						Feedback: <Text style={[styles.link, { color: linkColor }]}>hey@dimplace.com</Text>
					</Text>
				</Pressable>
			</View>
		</Container>
	);
}
const createStyles = (Colors: ColorTheme) =>
	StyleSheet.create({
		title: { ...Typography.Title, color: Colors.TextPrimary, textAlign: "center", marginTop: 16 },
		info: { position: "absolute", bottom: 24, alignSelf: "center" },
		text: { ...Typography.Body, color: Colors.TextLabel, marginBottom: 16, textAlign: "center" },
		tiny: { ...Typography.Caption, color: Colors.TextLabel, lineHeight: 20 },
		link: { ...Typography.Callout, color: Colors.TextLabel, textDecorationLine: "underline" },
	});
