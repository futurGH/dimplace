import type { ConfigContext, ExpoConfig } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
	...config,
	name: "dimplace",
	slug: "dimplace",
	scheme: "dimplace",
	version: "0.0.1",
	orientation: "portrait",
	icon: "./assets/icon.png",
	userInterfaceStyle: "dark",
	splash: { image: "./assets/splash.png", resizeMode: "cover", backgroundColor: "#131720" },
	updates: { fallbackToCacheTimeout: 0 },
	assetBundlePatterns: ["**/*"],
	jsEngine: "hermes",
	ios: { supportsTablet: true, userInterfaceStyle: "dark" },
	android: {
		adaptiveIcon: { foregroundImage: "./assets/adaptive-icon.png", backgroundColor: "#131720" },
	},
	androidStatusBar: { barStyle: "light-content", backgroundColor: "#131720" },
});
