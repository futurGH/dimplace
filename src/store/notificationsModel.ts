export interface NotificationModel {
	id: string;
	title: string;
	message: string;
	viewUrl: string;
	organization: { id: string; name: string };
}

export const notificationsModel: Array<NotificationModel> = []
