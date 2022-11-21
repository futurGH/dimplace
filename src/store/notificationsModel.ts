import { type Action, action } from "easy-peasy";

export interface SingleNotification {
	id: string;
	title: string;
	message: string;
	viewUrl: string;
	organization: { id: string; name: string };
}
export interface NotificationModel {
	list: Array<SingleNotification>;
	add: Action<NotificationModel, SingleNotification>;
	remove: Action<NotificationModel, string>;
}

export const notificationsModel: NotificationModel = {
	list: [],
	add: action((state, payload) => {
		state.list.push(payload);
	}),
	remove: action((state, payload) => {
		state.list = state.list.filter((notification) => notification.id !== payload);
	}),
};
