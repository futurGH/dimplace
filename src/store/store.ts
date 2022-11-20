import { createStore, persist } from "easy-peasy";
import { confioModel } from "./configModel";
import { notificationsModel } from "./notificationsModel";
import { settingsModel } from "./settingsModel";

export const store = createStore({
	config: persist(confioModel),
	settings: persist(settingsModel),
	notifications: notificationsModel,
});
