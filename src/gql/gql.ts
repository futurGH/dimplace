/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

const documents = {
    "\n    query CourseList($startDate: String!, $endDate: String!) {\n        activities(start: $startDate, end: $endDate) {\n            id\n            source {\n                id\n                name\n            }\n            organization {\n                id\n            }\n            completed\n\t\t\tcompletionDate\n\t\t\tdueDate\n        }\n\t\tenrollmentPage {\n\t\t\tenrollments {\n\t\t\t\torganization {\n\t\t\t\t\tid\n\t\t\t\t\tname\n\t\t\t\t\timageUrl\n\t\t\t\t\tstartDate\n\t\t\t\t\tendDate\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t}\n": types.CourseListDocument,
};

export function graphql(source: "\n    query CourseList($startDate: String!, $endDate: String!) {\n        activities(start: $startDate, end: $endDate) {\n            id\n            source {\n                id\n                name\n            }\n            organization {\n                id\n            }\n            completed\n\t\t\tcompletionDate\n\t\t\tdueDate\n        }\n\t\tenrollmentPage {\n\t\t\tenrollments {\n\t\t\t\torganization {\n\t\t\t\t\tid\n\t\t\t\t\tname\n\t\t\t\t\timageUrl\n\t\t\t\t\tstartDate\n\t\t\t\t\tendDate\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t}\n"): (typeof documents)["\n    query CourseList($startDate: String!, $endDate: String!) {\n        activities(start: $startDate, end: $endDate) {\n            id\n            source {\n                id\n                name\n            }\n            organization {\n                id\n            }\n            completed\n\t\t\tcompletionDate\n\t\t\tdueDate\n        }\n\t\tenrollmentPage {\n\t\t\tenrollments {\n\t\t\t\torganization {\n\t\t\t\t\tid\n\t\t\t\t\tname\n\t\t\t\t\timageUrl\n\t\t\t\t\tstartDate\n\t\t\t\t\tendDate\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t}\n"];

export function graphql(source: string): unknown;
export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;