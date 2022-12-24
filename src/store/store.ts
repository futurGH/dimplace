import AsyncStorage from "@react-native-async-storage/async-storage";
import { createStore, createTypedHooks, persist, type Store } from "easy-peasy";
import { configModel } from "./configModel";
import { notificationsModel } from "./notificationsModel";
import { settingsModel } from "./settingsModel";

const storage = {
	async getItem(key: string) {
		return JSON.parse(await AsyncStorage.getItem(key) || "null");
	},
	async setItem(key: string, value: string) {
		await AsyncStorage.setItem(key, JSON.stringify(value));
	},
	async removeItem(key: string) {
		await AsyncStorage.removeItem(key);
	},
};

// @ts-expect-error - https://github.com/ctrlplusb/easy-peasy/issues/599
window.requestIdleCallback = null;
export const store = createStore({
	config: persist(configModel, { storage }),
	settings: persist(settingsModel, { storage }),
	notifications: persist(notificationsModel, { storage }),
});
export type StoreModel = typeof store extends Store<infer T, any> ? T : never;

export const { useStoreActions, useStoreState, useStoreDispatch, useStore } = createTypedHooks<
	StoreModel
>();
