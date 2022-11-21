import { createStore, createTypedHooks, persist, type Store } from "easy-peasy";
import { configModel } from "./configModel";
import { notificationsModel } from "./notificationsModel";
import { settingsModel } from "./settingsModel";

export const store = createStore({
	config: persist(configModel),
	settings: persist(settingsModel),
	notifications: notificationsModel,
});
type StoreModel = typeof store extends Store<infer T, any> ? T : never;

export const { useStoreActions, useStoreState, useStoreDispatch, useStore } = createTypedHooks<
	StoreModel
>();
