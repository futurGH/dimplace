import type { ConfigContext, ExpoConfig } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
	...config,
	name: "dimplace",
	slug: "dimplace",
	scheme: "dimplace",
	version: "1.1.0",
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
		buildNumber: "2022.12.26.1",
		config: { usesNonExemptEncryption: false },
	},
	android: { package: "com.dimplace", versionCode: 202212261 },
	androidStatusBar: { barStyle: "light-content", backgroundColor: "#131720" },
	plugins: ["sentry-expo"],
	hooks: {
		postPublish: [{
			file: "sentry-expo/upload-sourcemaps",
			config: {
				organization: process.env.SENTRY_ORG,
				project: process.env.SENTRY_PROJECT,
				authToken: process.env.SENTRY_AUTH_TOKEN,
				setCommits: true,
			},
		}],
	},
	extra: {
		eas: { projectId: "9392383f-fb3c-4441-9ab9-2fdfd11e4396" },
		sentry: {
			dsn: process.env.SENTRY_DSN
				|| "https://64a2f6a366b241a08295067cf683673f@o4504390425968640.ingest.sentry.io/4504390427344896",
		},
	},
});
