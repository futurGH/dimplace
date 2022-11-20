import { Action, action } from "easy-peasy";

export const TimeUnits = { Minutes: 60, Hours: 3600, Days: 86400 } as const;
export type TimeUnits = typeof TimeUnits[keyof typeof TimeUnits];

export interface SettingsModel {
	assignmentDueDateWarnings: Array<{ number: number; unit: TimeUnits }>;
	addAssignmentDueDateWarning: Action<SettingsModel, { number: number; unit: TimeUnits }>;
	removeAssignmentDueDateWarning: Action<SettingsModel, { number: number; unit: TimeUnits }>;
	notificationPreferences: {
		announcementPost: boolean;
		announcementUpdate: boolean;
		assignmentDueDate: boolean;
		contentCreate: boolean;
		contentUpdate: boolean;
		contentOverviewUpdate: boolean;
		gradeRelease: boolean;
		gradeUpdate: boolean;
		discussionMention: boolean;
		postCreate: boolean;
		postComment: boolean;
	};
	updateNotificationPreference: Action<
		SettingsModel,
		{ key: keyof SettingsModel["notificationPreferences"]; value: boolean }
	>;
}

export const settingsModel: SettingsModel = {
	assignmentDueDateWarnings: [],
	addAssignmentDueDateWarning: action((state, payload) => {
		state.assignmentDueDateWarnings.push(payload);
	}),
	removeAssignmentDueDateWarning: action((state, payload) => {
		state.assignmentDueDateWarnings = state.assignmentDueDateWarnings.filter((warning) =>
			warning.number !== payload.number && warning.unit !== payload.unit
		);
	}),
	notificationPreferences: {
		announcementPost: true,
		announcementUpdate: true,
		assignmentDueDate: true,
		contentCreate: true,
		contentUpdate: true,
		contentOverviewUpdate: true,
		gradeRelease: true,
		gradeUpdate: true,
		discussionMention: true,
		postCreate: true,
		postComment: true,
	},
	updateNotificationPreference: action((state, payload) => {
		state.notificationPreferences[payload.key] = payload.value;
	}),
};
