/** @generated — do not edit. Produced by generate-integration-docs.ts */

export interface GoogleClassroomListCoursesParams { "pageSize"?: number; "pageToken"?: string; "teacherId"?: string; "studentId"?: string }

export interface GoogleClassroomGetCourseParams { course_id: string }

export interface GoogleClassroomCreateCourseParams { course_json: string }

export interface GoogleClassroomListCourseworkParams { course_id: string; "pageSize"?: number; "pageToken"?: string }

export interface GoogleClassroomCreateCourseworkParams { course_id: string; coursework_json: string }

export interface GoogleClassroomListStudentsParams { course_id: string; "pageSize"?: number; "pageToken"?: string }

