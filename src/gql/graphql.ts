/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Activity = {
  __typename?: 'Activity';
  completed: Scalars['Boolean'];
  completionDate?: Maybe<Scalars['String']>;
  dueDate?: Maybe<Scalars['String']>;
  endDate?: Maybe<Scalars['String']>;
  /** @deprecated Fetch feedback directly on the UserGrade instead, which is simpler and more accurate. */
  feedback?: Maybe<Feedback>;
  gradeInfo?: Maybe<GradeInfo>;
  id: Scalars['String'];
  organization?: Maybe<Organization>;
  source?: Maybe<ActivitySource>;
  startDate?: Maybe<Scalars['String']>;
};

export type ActivityDateApproachingAlert = {
  activityId: Scalars['String'];
  date: Scalars['String'];
  iconUrl: Scalars['String'];
  id: Scalars['String'];
  message: Scalars['String'];
  organization: Organization;
  title: Scalars['String'];
  viewUrl: Scalars['String'];
};

export type ActivityFeedArticle = ActivityFeedEntity & ActivityFeedTopLevelPost & {
  __typename?: 'ActivityFeedArticle';
  /** @deprecated Use commentsLink instead, which is paged. */
  allCommentsLink?: Maybe<Scalars['String']>;
  attachmentLinks: Array<ActivityFeedLink>;
  author: User;
  commentsCount: Scalars['Int'];
  commentsLink?: Maybe<Scalars['String']>;
  firstComment?: Maybe<ActivityFeedComment>;
  id: Scalars['String'];
  isPinned: Scalars['Boolean'];
  message: Scalars['String'];
  publishedDate: Scalars['String'];
  type: Scalars['String'];
  webLink?: Maybe<Scalars['String']>;
};

export type ActivityFeedArticlePage = {
  __typename?: 'ActivityFeedArticlePage';
  activityFeedArticles: Array<ActivityFeedPost>;
  id: Scalars['String'];
  next?: Maybe<Scalars['String']>;
};

export type ActivityFeedAssignment = ActivityFeedEntity & ActivityFeedTopLevelPost & {
  __typename?: 'ActivityFeedAssignment';
  /** @deprecated Use commentsLink instead, which is paged. */
  allCommentsLink?: Maybe<Scalars['String']>;
  attachmentLinks: Array<ActivityFeedLink>;
  author: User;
  commentsCount: Scalars['Int'];
  commentsLink?: Maybe<Scalars['String']>;
  dueDate?: Maybe<Scalars['String']>;
  firstComment?: Maybe<ActivityFeedComment>;
  id: Scalars['String'];
  instructions?: Maybe<Scalars['String']>;
  isPinned: Scalars['Boolean'];
  name: Scalars['String'];
  publishedDate: Scalars['String'];
  submissionLink?: Maybe<Scalars['String']>;
  type: Scalars['String'];
  webLink?: Maybe<Scalars['String']>;
};

export type ActivityFeedComment = ActivityFeedEntity & {
  __typename?: 'ActivityFeedComment';
  author: User;
  id: Scalars['String'];
  message: Scalars['String'];
  publishedDate: Scalars['String'];
  type: Scalars['String'];
};

export type ActivityFeedCommentPage = {
  __typename?: 'ActivityFeedCommentPage';
  activityFeedComments: Array<ActivityFeedComment>;
  id: Scalars['String'];
  next?: Maybe<Scalars['String']>;
};

export type ActivityFeedEntity = {
  author: User;
  id: Scalars['String'];
  publishedDate: Scalars['String'];
  type: Scalars['String'];
};

export type ActivityFeedLink = {
  __typename?: 'ActivityFeedLink';
  href: Scalars['String'];
  iconHref: Scalars['String'];
  id: Scalars['String'];
  name: Scalars['String'];
  type: Scalars['String'];
};

export type ActivityFeedPost = ActivityFeedArticle | ActivityFeedAssignment;

export type ActivityFeedTopLevelPost = {
  /** @deprecated Use commentsLink instead, which is paged. */
  allCommentsLink?: Maybe<Scalars['String']>;
  attachmentLinks: Array<ActivityFeedLink>;
  commentsCount: Scalars['Int'];
  commentsLink?: Maybe<Scalars['String']>;
  firstComment?: Maybe<ActivityFeedComment>;
  isPinned: Scalars['Boolean'];
  webLink?: Maybe<Scalars['String']>;
};

export type ActivitySource = {
  description?: Maybe<Scalars['String']>;
  descriptionHtml?: Maybe<Scalars['String']>;
  descriptionHtmlRichContent?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  name?: Maybe<Scalars['String']>;
  organization?: Maybe<Organization>;
  url?: Maybe<Scalars['String']>;
};

/** Common interface to all alert items. */
export type Alert = {
  date: Scalars['String'];
  iconUrl: Scalars['String'];
  id: Scalars['String'];
  message: Scalars['String'];
  organization: Organization;
  title: Scalars['String'];
  viewUrl: Scalars['String'];
};

export type AlertsPage = {
  __typename?: 'AlertsPage';
  alerts: Array<Alert>;
  id: Scalars['String'];
  next?: Maybe<Scalars['String']>;
};

export type Announcement = {
  __typename?: 'Announcement';
  body: Scalars['String'];
  bodyHtml: Scalars['String'];
  bodyHtmlRichContent?: Maybe<Scalars['String']>;
  /** @deprecated Use startDate instead, which admits nullability. */
  date: Scalars['String'];
  id: Scalars['String'];
  startDate?: Maybe<Scalars['String']>;
  title: Scalars['String'];
  viewUrl: Scalars['String'];
};

export type AnnouncementAlert = {
  announcementId: Scalars['String'];
  date: Scalars['String'];
  iconUrl: Scalars['String'];
  id: Scalars['String'];
  message: Scalars['String'];
  organization: Organization;
  title: Scalars['String'];
  viewUrl: Scalars['String'];
};

export type AnnouncementAvailableAlert = Alert & AnnouncementAlert & {
  __typename?: 'AnnouncementAvailableAlert';
  announcementId: Scalars['String'];
  date: Scalars['String'];
  iconUrl: Scalars['String'];
  id: Scalars['String'];
  message: Scalars['String'];
  organization: Organization;
  title: Scalars['String'];
  viewUrl: Scalars['String'];
};

export type AnnouncementUpdatedAlert = Alert & AnnouncementAlert & {
  __typename?: 'AnnouncementUpdatedAlert';
  announcementId: Scalars['String'];
  date: Scalars['String'];
  iconUrl: Scalars['String'];
  id: Scalars['String'];
  message: Scalars['String'];
  organization: Organization;
  title: Scalars['String'];
  viewUrl: Scalars['String'];
};

export type Assignment = ActivitySource & {
  __typename?: 'Assignment';
  addToGrades?: Maybe<Scalars['Boolean']>;
  completionType?: Maybe<Scalars['Int']>;
  description?: Maybe<Scalars['String']>;
  descriptionHtml?: Maybe<Scalars['String']>;
  descriptionHtmlRichContent?: Maybe<Scalars['String']>;
  draft?: Maybe<Scalars['Boolean']>;
  id: Scalars['String'];
  name?: Maybe<Scalars['String']>;
  organization?: Maybe<Organization>;
  outOf?: Maybe<Scalars['Float']>;
  submissionType?: Maybe<Scalars['Int']>;
  url?: Maybe<Scalars['String']>;
};

export type ChecklistItem = ActivitySource & {
  __typename?: 'ChecklistItem';
  description?: Maybe<Scalars['String']>;
  descriptionHtml?: Maybe<Scalars['String']>;
  descriptionHtmlRichContent?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  name?: Maybe<Scalars['String']>;
  organization?: Maybe<Organization>;
  url?: Maybe<Scalars['String']>;
};

export type ClassStreamAlert = {
  activityFeedItemId: Scalars['String'];
  date: Scalars['String'];
  iconUrl: Scalars['String'];
  id: Scalars['String'];
  message: Scalars['String'];
  organization: Organization;
  title: Scalars['String'];
  viewUrl: Scalars['String'];
};

export type ClassStreamCommentAlert = Alert & ClassStreamAlert & {
  __typename?: 'ClassStreamCommentAlert';
  activityFeedItemId: Scalars['String'];
  date: Scalars['String'];
  iconUrl: Scalars['String'];
  id: Scalars['String'];
  message: Scalars['String'];
  organization: Organization;
  title: Scalars['String'];
  viewUrl: Scalars['String'];
};

export type ClassStreamMessageAlert = Alert & ClassStreamAlert & {
  __typename?: 'ClassStreamMessageAlert';
  activityFeedItemId: Scalars['String'];
  date: Scalars['String'];
  iconUrl: Scalars['String'];
  id: Scalars['String'];
  message: Scalars['String'];
  organization: Organization;
  title: Scalars['String'];
  viewUrl: Scalars['String'];
};

export type ConsortiumOrganization = {
  __typename?: 'ConsortiumOrganization';
  homeUrl?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  name: Scalars['String'];
  tenant: Scalars['String'];
  user: Scalars['String'];
};

export type Content = ActivitySource & {
  __typename?: 'Content';
  description?: Maybe<Scalars['String']>;
  descriptionHtml?: Maybe<Scalars['String']>;
  descriptionHtmlRichContent?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  name?: Maybe<Scalars['String']>;
  organization?: Maybe<Organization>;
  url?: Maybe<Scalars['String']>;
};

export type ContentAlert = {
  contentId: Scalars['String'];
  date: Scalars['String'];
  iconUrl: Scalars['String'];
  id: Scalars['String'];
  message: Scalars['String'];
  organization: Organization;
  title: Scalars['String'];
  viewUrl: Scalars['String'];
};

export type ContentCreatedAlert = Alert & ContentAlert & {
  __typename?: 'ContentCreatedAlert';
  contentId: Scalars['String'];
  date: Scalars['String'];
  iconUrl: Scalars['String'];
  id: Scalars['String'];
  message: Scalars['String'];
  organization: Organization;
  title: Scalars['String'];
  viewUrl: Scalars['String'];
};

export type ContentItem = {
  description?: Maybe<Scalars['String']>;
  descriptionHtml?: Maybe<Scalars['String']>;
  descriptionHtmlRichContent?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  isComplete?: Maybe<Scalars['Boolean']>;
  parentId?: Maybe<Scalars['String']>;
  title: Scalars['String'];
};

export type ContentModule = ContentItem & {
  __typename?: 'ContentModule';
  children: Array<ContentItem>;
  description?: Maybe<Scalars['String']>;
  descriptionHtml?: Maybe<Scalars['String']>;
  descriptionHtmlRichContent?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  isComplete?: Maybe<Scalars['Boolean']>;
  parentId?: Maybe<Scalars['String']>;
  title: Scalars['String'];
};

export type ContentRoot = {
  __typename?: 'ContentRoot';
  id: Scalars['String'];
  modules: Array<ContentModule>;
};

export type ContentTopic = ContentItem & {
  __typename?: 'ContentTopic';
  description?: Maybe<Scalars['String']>;
  descriptionHtml?: Maybe<Scalars['String']>;
  descriptionHtmlRichContent?: Maybe<Scalars['String']>;
  downloadHref?: Maybe<Scalars['String']>;
  fileName?: Maybe<Scalars['String']>;
  iconHref: Scalars['String'];
  id: Scalars['String'];
  isComplete?: Maybe<Scalars['Boolean']>;
  modifiedDate?: Maybe<Scalars['String']>;
  parentId?: Maybe<Scalars['String']>;
  pdfHref?: Maybe<Scalars['String']>;
  title: Scalars['String'];
  type?: Maybe<Scalars['String']>;
  /** @deprecated viewHref is deprecated. Use viewUrl instead, which admits nullability, rather than substituting the URL of a 403 error page. */
  viewHref: Scalars['String'];
  viewUrl?: Maybe<Scalars['String']>;
};

export type ContentUpdatedAlert = Alert & ContentAlert & {
  __typename?: 'ContentUpdatedAlert';
  contentId: Scalars['String'];
  date: Scalars['String'];
  iconUrl: Scalars['String'];
  id: Scalars['String'];
  message: Scalars['String'];
  organization: Organization;
  title: Scalars['String'];
  viewUrl: Scalars['String'];
};

export type CourseOfferingActivity = ActivitySource & {
  __typename?: 'CourseOfferingActivity';
  description?: Maybe<Scalars['String']>;
  descriptionHtml?: Maybe<Scalars['String']>;
  descriptionHtmlRichContent?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  name?: Maybe<Scalars['String']>;
  organization?: Maybe<Organization>;
  url?: Maybe<Scalars['String']>;
};

export type DropboxDueDateApproachingAlert = ActivityDateApproachingAlert & Alert & {
  __typename?: 'DropboxDueDateApproachingAlert';
  activityId: Scalars['String'];
  date: Scalars['String'];
  iconUrl: Scalars['String'];
  id: Scalars['String'];
  message: Scalars['String'];
  organization: Organization;
  title: Scalars['String'];
  viewUrl: Scalars['String'];
};

export type DropboxEndDateApproachingAlert = ActivityDateApproachingAlert & Alert & {
  __typename?: 'DropboxEndDateApproachingAlert';
  activityId: Scalars['String'];
  date: Scalars['String'];
  iconUrl: Scalars['String'];
  id: Scalars['String'];
  message: Scalars['String'];
  organization: Organization;
  title: Scalars['String'];
  viewUrl: Scalars['String'];
};

export enum EnrollmentState {
  Complete = 'COMPLETE',
  Current = 'CURRENT',
  Duesoon = 'DUESOON',
  Endssoon = 'ENDSSOON',
  Future = 'FUTURE',
  Inactive = 'INACTIVE',
  Overdue = 'OVERDUE',
  Past = 'PAST'
}

export type Event = {
  __typename?: 'Event';
  allDay: Scalars['Boolean'];
  description?: Maybe<Scalars['String']>;
  descriptionHtml?: Maybe<Scalars['String']>;
  descriptionHtmlRichContent?: Maybe<Scalars['String']>;
  endDate: Scalars['String'];
  id: Scalars['String'];
  location?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  organization?: Maybe<Organization>;
  startDate: Scalars['String'];
  url?: Maybe<Scalars['String']>;
};

export type Feedback = {
  __typename?: 'Feedback';
  id: Scalars['String'];
  text: Scalars['String'];
  textHtml: Scalars['String'];
  textHtmlRichContent?: Maybe<Scalars['String']>;
  viewUrl?: Maybe<Scalars['String']>;
};

/**
 * Generic implementation of an alert. Used for cases where no additional
 * information is provided, and the clients just care about having a viewUrl to open.
 */
export type GenericAlert = Alert & {
  __typename?: 'GenericAlert';
  date: Scalars['String'];
  iconUrl: Scalars['String'];
  id: Scalars['String'];
  message: Scalars['String'];
  organization: Organization;
  title: Scalars['String'];
  viewUrl: Scalars['String'];
};

export type GradeAlert = {
  date: Scalars['String'];
  gradeId: Scalars['String'];
  iconUrl: Scalars['String'];
  id: Scalars['String'];
  message: Scalars['String'];
  organization: Organization;
  title: Scalars['String'];
  viewUrl: Scalars['String'];
};

export type GradeInfo = {
  __typename?: 'GradeInfo';
  id: Scalars['String'];
  type?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['Float']>;
};

export type GradeReleasedAlert = Alert & GradeAlert & {
  __typename?: 'GradeReleasedAlert';
  date: Scalars['String'];
  gradeId: Scalars['String'];
  iconUrl: Scalars['String'];
  id: Scalars['String'];
  message: Scalars['String'];
  organization: Organization;
  title: Scalars['String'];
  viewUrl: Scalars['String'];
};

export type GradeUpdatedAlert = Alert & GradeAlert & {
  __typename?: 'GradeUpdatedAlert';
  date: Scalars['String'];
  gradeId: Scalars['String'];
  iconUrl: Scalars['String'];
  id: Scalars['String'];
  message: Scalars['String'];
  organization: Organization;
  title: Scalars['String'];
  viewUrl: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  /** Old mutation. Will be removed, do not use in new code. */
  acknowledgeAllUpdates?: Maybe<UpdatesPage>;
  pinEnrollment?: Maybe<UserEnrollment>;
  resetNotificationCount: Scalars['Boolean'];
  unpinEnrollment?: Maybe<UserEnrollment>;
  updatePushNotificationSetting?: Maybe<PushNotificationSetting>;
  viewContentTopic: ContentTopic;
};


export type MutationAcknowledgeAllUpdatesArgs = {
  id?: InputMaybe<Scalars['String']>;
};


export type MutationPinEnrollmentArgs = {
  id: Scalars['String'];
};


export type MutationUnpinEnrollmentArgs = {
  id: Scalars['String'];
};


export type MutationUpdatePushNotificationSettingArgs = {
  enabled: Scalars['Boolean'];
  settingKey: Scalars['String'];
};


export type MutationViewContentTopicArgs = {
  topicId: Scalars['String'];
};

export type Notifications = {
  __typename?: 'Notifications';
  assignmentsCount?: Maybe<Scalars['Int']>;
  assignmentsUrl?: Maybe<Scalars['String']>;
  discussionsCount?: Maybe<Scalars['Int']>;
  discussionsUrl?: Maybe<Scalars['String']>;
  quizzesCount?: Maybe<Scalars['Int']>;
  quizzesUrl?: Maybe<Scalars['String']>;
};

export type Organization = {
  __typename?: 'Organization';
  code?: Maybe<Scalars['String']>;
  color?: Maybe<Scalars['String']>;
  endDate?: Maybe<Scalars['String']>;
  gradesViewUrl?: Maybe<Scalars['String']>;
  hasActivityFeed: Scalars['Boolean'];
  hasGradesEnabled: Scalars['Boolean'];
  homeUrl?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  imageUrl?: Maybe<Scalars['String']>;
  isActive: Scalars['Boolean'];
  name: Scalars['String'];
  semester?: Maybe<Semester>;
  sequenceUrl?: Maybe<Scalars['String']>;
  startDate?: Maybe<Scalars['String']>;
  theme?: Maybe<Theme>;
};

export type PushNotificationConfigOptions = {
  __typename?: 'PushNotificationConfigOptions';
  categories: Array<PushNotificationSettingCategory>;
};

export type PushNotificationSetting = {
  __typename?: 'PushNotificationSetting';
  enabled: Scalars['Boolean'];
  name: Scalars['String'];
  settingKey: Scalars['String'];
};

export type PushNotificationSettingCategory = {
  __typename?: 'PushNotificationSettingCategory';
  name: Scalars['String'];
  settings: Array<PushNotificationSetting>;
};

export type Query = {
  __typename?: 'Query';
  activities: Array<Activity>;
  activity?: Maybe<Activity>;
  activityFeedArticle?: Maybe<ActivityFeedPost>;
  activityFeedArticlePage?: Maybe<ActivityFeedArticlePage>;
  activityFeedCommentPage?: Maybe<ActivityFeedCommentPage>;
  alert?: Maybe<Alert>;
  /** Old, poorly-named query. Use updateAlertsPage instead. */
  alertsPage: AlertsPage;
  announcement?: Maybe<Announcement>;
  consortiumOrganizations: Array<ConsortiumOrganization>;
  contentModule: ContentModule;
  contentRoot: ContentRoot;
  contentTopic: ContentTopic;
  enrollment?: Maybe<UserEnrollment>;
  enrollmentPage?: Maybe<UserEnrollmentPage>;
  event?: Maybe<Event>;
  events: Array<Event>;
  organization?: Maybe<Organization>;
  pushNotificationConfig: PushNotificationConfigOptions;
  rootOrganization?: Maybe<Organization>;
  subscriptionAlert?: Maybe<Alert>;
  subscriptionAlertsPage: AlertsPage;
  /** Old query. Will be removed, do not use in new code. */
  update?: Maybe<Update>;
  updateAlert?: Maybe<Alert>;
  updateAlertsPage: AlertsPage;
  /** Old query. Will be removed, use updateAlertsPage instead. */
  updatesPage?: Maybe<UpdatesPage>;
  user?: Maybe<User>;
  userGrade?: Maybe<UserGrade>;
  userGrades: Array<UserGrade>;
};


export type QueryActivitiesArgs = {
  end: Scalars['String'];
  start: Scalars['String'];
  strict?: InputMaybe<Scalars['Boolean']>;
};


export type QueryActivityArgs = {
  id: Scalars['String'];
};


export type QueryActivityFeedArticleArgs = {
  id: Scalars['String'];
};


export type QueryActivityFeedArticlePageArgs = {
  id?: InputMaybe<Scalars['String']>;
  orgUnitId: Scalars['String'];
};


export type QueryActivityFeedCommentPageArgs = {
  id: Scalars['String'];
};


export type QueryAlertArgs = {
  alertId: Scalars['String'];
};


export type QueryAlertsPageArgs = {
  id?: InputMaybe<Scalars['String']>;
};


export type QueryAnnouncementArgs = {
  id: Scalars['String'];
};


export type QueryContentModuleArgs = {
  moduleId: Scalars['String'];
};


export type QueryContentRootArgs = {
  organizationId: Scalars['String'];
};


export type QueryContentTopicArgs = {
  topicId: Scalars['String'];
};


export type QueryEnrollmentArgs = {
  id: Scalars['String'];
};


export type QueryEnrollmentPageArgs = {
  id?: InputMaybe<Scalars['String']>;
};


export type QueryEventArgs = {
  id: Scalars['String'];
};


export type QueryEventsArgs = {
  end: Scalars['String'];
  start: Scalars['String'];
};


export type QueryOrganizationArgs = {
  id: Scalars['String'];
};


export type QuerySubscriptionAlertArgs = {
  alertId: Scalars['String'];
};


export type QuerySubscriptionAlertsPageArgs = {
  id?: InputMaybe<Scalars['String']>;
  pageSize?: InputMaybe<Scalars['Int']>;
};


export type QueryUpdateArgs = {
  id: Scalars['String'];
};


export type QueryUpdateAlertArgs = {
  alertId: Scalars['String'];
};


export type QueryUpdateAlertsPageArgs = {
  id?: InputMaybe<Scalars['String']>;
  pageSize?: InputMaybe<Scalars['Int']>;
};


export type QueryUpdatesPageArgs = {
  id?: InputMaybe<Scalars['String']>;
};


export type QueryUserGradeArgs = {
  gradeId: Scalars['String'];
};


export type QueryUserGradesArgs = {
  organization: Scalars['String'];
};

export type Quiz = ActivitySource & {
  __typename?: 'Quiz';
  description?: Maybe<Scalars['String']>;
  descriptionHtml?: Maybe<Scalars['String']>;
  descriptionHtmlRichContent?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  name?: Maybe<Scalars['String']>;
  organization?: Maybe<Organization>;
  url?: Maybe<Scalars['String']>;
};

export type QuizDueDateApproachingAlert = ActivityDateApproachingAlert & Alert & {
  __typename?: 'QuizDueDateApproachingAlert';
  activityId: Scalars['String'];
  date: Scalars['String'];
  iconUrl: Scalars['String'];
  id: Scalars['String'];
  message: Scalars['String'];
  organization: Organization;
  title: Scalars['String'];
  viewUrl: Scalars['String'];
};

export type QuizEndDateApproachingAlert = ActivityDateApproachingAlert & Alert & {
  __typename?: 'QuizEndDateApproachingAlert';
  activityId: Scalars['String'];
  date: Scalars['String'];
  iconUrl: Scalars['String'];
  id: Scalars['String'];
  message: Scalars['String'];
  organization: Organization;
  title: Scalars['String'];
  viewUrl: Scalars['String'];
};

export type Semester = {
  __typename?: 'Semester';
  name: Scalars['String'];
};

export type Survey = ActivitySource & {
  __typename?: 'Survey';
  description?: Maybe<Scalars['String']>;
  descriptionHtml?: Maybe<Scalars['String']>;
  descriptionHtmlRichContent?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  name?: Maybe<Scalars['String']>;
  organization?: Maybe<Organization>;
  url?: Maybe<Scalars['String']>;
};

export type Theme = {
  __typename?: 'Theme';
  color: Scalars['String'];
  imageLink?: Maybe<Scalars['String']>;
};

export type Topic = ActivitySource & {
  __typename?: 'Topic';
  description?: Maybe<Scalars['String']>;
  descriptionHtml?: Maybe<Scalars['String']>;
  descriptionHtmlRichContent?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  name?: Maybe<Scalars['String']>;
  organization?: Maybe<Organization>;
  url?: Maybe<Scalars['String']>;
};

export type Update = {
  __typename?: 'Update';
  activityFeedLink?: Maybe<Scalars['String']>;
  contentLink?: Maybe<Scalars['String']>;
  date?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  descriptionHtml?: Maybe<Scalars['String']>;
  dueDate?: Maybe<Scalars['String']>;
  endDate?: Maybe<Scalars['String']>;
  gradeLink?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  link?: Maybe<Scalars['String']>;
  organization?: Maybe<Organization>;
  startDate?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  type?: Maybe<UpdateType>;
  userActivityUsageLink?: Maybe<Scalars['String']>;
};

export enum UpdateType {
  Announcement = 'ANNOUNCEMENT',
  Classstreamcomment = 'CLASSSTREAMCOMMENT',
  Classstreammessage = 'CLASSSTREAMMESSAGE',
  Contentadded = 'CONTENTADDED',
  Contentoverviewupdated = 'CONTENTOVERVIEWUPDATED',
  Contentupdated = 'CONTENTUPDATED',
  Dropboxduedateapproaching = 'DROPBOXDUEDATEAPPROACHING',
  Dropboxenddateapproaching = 'DROPBOXENDDATEAPPROACHING',
  Grade = 'GRADE',
  Quizduedateapproaching = 'QUIZDUEDATEAPPROACHING',
  Quizenddateapproaching = 'QUIZENDDATEAPPROACHING'
}

export type UpdatesPage = {
  __typename?: 'UpdatesPage';
  id: Scalars['String'];
  next?: Maybe<Scalars['String']>;
  updates: Array<Update>;
};

export type User = {
  __typename?: 'User';
  displayName?: Maybe<Scalars['String']>;
  firstName?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  imageUrl?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
};

export type UserEnrollment = {
  __typename?: 'UserEnrollment';
  completionDate?: Maybe<Scalars['String']>;
  dueDate?: Maybe<Scalars['String']>;
  endDate?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  notifications?: Maybe<Notifications>;
  organization?: Maybe<Organization>;
  pinned: Scalars['Boolean'];
  startDate?: Maybe<Scalars['String']>;
  state: EnrollmentState;
};

export type UserEnrollmentPage = {
  __typename?: 'UserEnrollmentPage';
  enrollments: Array<UserEnrollment>;
  id: Scalars['String'];
  next?: Maybe<Scalars['String']>;
  organization?: Maybe<Organization>;
};

export type UserGrade = {
  __typename?: 'UserGrade';
  activity?: Maybe<Activity>;
  feedback?: Maybe<Feedback>;
  id: Scalars['String'];
  name: Scalars['String'];
  userActivityUsageLink?: Maybe<Scalars['String']>;
  value: Scalars['String'];
};

export type CourseListQueryVariables = Exact<{
  startDate: Scalars['String'];
  endDate: Scalars['String'];
}>;


export type CourseListQuery = { __typename?: 'Query', activities: Array<{ __typename?: 'Activity', id: string, completed: boolean, completionDate?: string | null, dueDate?: string | null, source?: { __typename?: 'Assignment', id: string, name?: string | null } | { __typename?: 'ChecklistItem', id: string, name?: string | null } | { __typename?: 'Content', id: string, name?: string | null } | { __typename?: 'CourseOfferingActivity', id: string, name?: string | null } | { __typename?: 'Quiz', id: string, name?: string | null } | { __typename?: 'Survey', id: string, name?: string | null } | { __typename?: 'Topic', id: string, name?: string | null } | null, organization?: { __typename?: 'Organization', id: string } | null }>, enrollmentPage?: { __typename?: 'UserEnrollmentPage', enrollments: Array<{ __typename?: 'UserEnrollment', organization?: { __typename?: 'Organization', id: string, name: string, imageUrl?: string | null, startDate?: string | null, endDate?: string | null } | null }> } | null };


export const CourseListDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CourseList"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"startDate"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"endDate"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"activities"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"start"},"value":{"kind":"Variable","name":{"kind":"Name","value":"startDate"}}},{"kind":"Argument","name":{"kind":"Name","value":"end"},"value":{"kind":"Variable","name":{"kind":"Name","value":"endDate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"source"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"completed"}},{"kind":"Field","name":{"kind":"Name","value":"completionDate"}},{"kind":"Field","name":{"kind":"Name","value":"dueDate"}}]}},{"kind":"Field","name":{"kind":"Name","value":"enrollmentPage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"enrollments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}}]}}]}}]}}]}}]} as unknown as DocumentNode<CourseListQuery, CourseListQueryVariables>;