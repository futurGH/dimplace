import type { ConfigContext, ExpoConfig } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
	...config,
	name: "dimplace",
	slug: "dimplace",
	scheme: "dimplace",
	version: "1.0.0",
	orientation: "portrait",
	icon: "./assets/icon.png",

	userInterfaceStyle: "dark",
	splash: { image: "./assets/splash.png", resizeMode: "cover", backgroundColor: "#131720" },
	updates: { fallbackToCacheTimeout: 0 },
	assetBundlePatterns: ["**/*"],
	jsEngine: "hermes",
	ios: {
		supportsTablet: false,
		userInterfaceStyle: "dark",
		bundleIdentifier: "com.dimplace",
		buildNumber: "2022.12.22.4",
		config: { usesNonExemptEncryption: false },
	},
	android: { package: "com.dimplace", versionCode: 202212224 },
	androidStatusBar: { barStyle: "light-content", backgroundColor: "#131720" },
	extra: { eas: { projectId: "9392383f-fb3c-4441-9ab9-2fdfd11e4396" } },
});
