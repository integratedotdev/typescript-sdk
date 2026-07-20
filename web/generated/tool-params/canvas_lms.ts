/** @generated — do not edit. Produced by generate-integration-docs.ts */

export interface CanvasLmsListCoursesParams { "enrollment_state"?: string; "per_page"?: number; "page"?: number; canvas_domain: string }

export interface CanvasLmsGetCourseParams { course_id: string; canvas_domain: string }

export interface CanvasLmsListAssignmentsParams { course_id: string; "bucket"?: string; "per_page"?: number; "page"?: number; canvas_domain: string }

export interface CanvasLmsCreateAssignmentParams { course_id: string; assignment_json: string; canvas_domain: string }

export interface CanvasLmsListSubmissionsParams { course_id: string; assignment_id: string; "per_page"?: number; "page"?: number; canvas_domain: string }

export interface CanvasLmsListUsersParams { course_id: string; "enrollment_type"?: string; "per_page"?: number; "page"?: number; canvas_domain: string }

