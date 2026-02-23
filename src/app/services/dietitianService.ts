import axiosClient from "../api/axiosClient";

const DIETITIAN_BASE = "/api/v1/dietitian";

// ─── Enums / Union Types ──────────────────────────────────────────────────────

export type MealType = "BREAKFAST" | "LUNCH" | "DINNER" | "SNACK";
export type MenuBatchStatus = "DRAFT" | "SUBMITTED" | "APPROVED" | "REJECTED" | "CANCELLED";
export type UserLifecycleStatus =
  | "REGISTERED"
  | "VERIFIED"
  | "DATA_SUBMITTED"
  | "ACTIVE"
  | "EXPIRED";

// ─── Models ───────────────────────────────────────────────────────────────────

export interface DietitianProfile {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string | null;
  specialization: string | null;
}

export interface DietitianProfileUpdateRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  /** Pattern: +?[0-9]{9,15} */
  phoneNumber?: string;
  specialization?: string;
}

export interface DashboardStats {
  totalPatients: number;
  pendingMenus: number;
  activeMenus: number;
  rejectedMenus: number;
}

export interface PatientSummary {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  status: UserLifecycleStatus;
  goal: string | null;
  menuStatus: string | null;
}

export interface HealthFile {
  id: number;
  fileName: string;
}

export interface PatientProfileData {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string | null;
  status: UserLifecycleStatus;
  goal: string | null;
  height: number | null;
  weight: number | null;
  bmi: number | null;
  restrictions: string | null;
  notes: string | null;
  files: HealthFile[];
}

export interface UrgentPatient {
  userId: number;
  firstName: string;
  lastName: string;
  status: UserLifecycleStatus;
  daysWaiting: number;
}

export interface MenuItemRequest {
  day: number;
  mealType: MealType;
  /** Min 5, max 1000 characters */
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

export interface CreateMenuRequest {
  userId: number;
  year: number;
  month: number;
  dietaryNotes?: string;
  items: MenuItemRequest[];
}

export type UpdateMenuRequest = CreateMenuRequest;

export interface MenuBatch {
  batchId: number;
  userId: number;
  year: number;
  month: number;
  status: MenuBatchStatus;
  dietaryNotes: string | null;
  createdAt: string;
}

export interface BatchItemResponse {
  id: number;
  day: number;
  mealType: MealType;
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

export interface BatchDetailsResponse {
  menuId: number;
  batchId: number;
  year: number;
  month: number;
  dietaryNotes: string | null;
  status: MenuBatchStatus;
  items: BatchItemResponse[];
}

/** Item shape inside MonthlyMenuBatch (no `id` field) */
export interface MonthlyMenuBatchItem {
  day: number;
  mealType: MealType;
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

/** One batch inside the MonthlyMenuResponse */
export interface MonthlyMenuBatch {
  batchId: number;
  status: MenuBatchStatus;
  items: MonthlyMenuBatchItem[];
}

/** Response for GET /api/v1/dietitian/menu/{userId}?year=&month= */
export interface MonthlyMenuResponse {
  menuId: number;
  year: number;
  month: number;
  dietaryNotes: string | null;
  batches: MonthlyMenuBatch[];
}

export interface RejectionReasonResponse {
  batchId: number;
  userId: number;
  userFullName: string;
  userEmail: string;
  phoneNumber: string;
  rejectionReason: string;
}

// ─── Error Helper ─────────────────────────────────────────────────────────────

export function extractErrorMessage(
  error: unknown,
  fallback = "Something went wrong. Please try again."
): string {
  if (error && typeof error === "object" && "response" in error) {
    const response = (
      error as { response?: { data?: { message?: string; error?: string } } }
    ).response;
    return response?.data?.message ?? response?.data?.error ?? fallback;
  }
  if (error instanceof Error) return error.message;
  return fallback;
}

// ─── API Methods ──────────────────────────────────────────────────────────────

// [1] GET /my-users
export const getMyUsers = async (): Promise<PatientSummary[]> => {
  const { data } = await axiosClient.get<PatientSummary[]>(`${DIETITIAN_BASE}/my-users`);
  return data;
};

// [2] POST /create-menu
export const createMenu = async (dto: CreateMenuRequest): Promise<MenuBatch> => {
  const { data } = await axiosClient.post<MenuBatch>(`${DIETITIAN_BASE}/create-menu`, dto);
  return data;
};

// [3] PUT /profile
export const updateDietitianProfile = async (
  dto: DietitianProfileUpdateRequest
): Promise<void> => {
  await axiosClient.put(`${DIETITIAN_BASE}/profile`, dto);
};

// [4] GET /profile
export const getDietitianProfile = async (): Promise<DietitianProfile> => {
  const { data } = await axiosClient.get<DietitianProfile>(`${DIETITIAN_BASE}/profile`);
  return data;
};

// [5] GET /dashboard/stats
export const getDashboardStats = async (): Promise<DashboardStats> => {
  const { data } = await axiosClient.get<DashboardStats>(`${DIETITIAN_BASE}/dashboard/stats`);
  return data;
};

// [6] GET /patients/urgent
export const getUrgentPatients = async (): Promise<UrgentPatient[]> => {
  const { data } = await axiosClient.get<UrgentPatient[]>(`${DIETITIAN_BASE}/patients/urgent`);
  return data;
};

// [7] GET /patient/{userId}/profile
export const getPatientProfile = async (userId: number): Promise<PatientProfileData> => {
  const { data } = await axiosClient.get<PatientProfileData>(
    `${DIETITIAN_BASE}/patient/${userId}/profile`
  );
  return data;
};

// [8] GET /menu/{userId}?year=YYYY&month=MM
export const getMonthlyMenu = async (
  userId: number,
  year: number,
  month: number
): Promise<MonthlyMenuResponse | null> => {
  const { data } = await axiosClient.get<MonthlyMenuResponse | null>(
    `${DIETITIAN_BASE}/menu/${userId}`,
    { params: { year, month } }
  );
  return data;
};

// [9] PATCH /batch/{batchId}/submit
export const submitBatch = async (batchId: number): Promise<void> => {
  await axiosClient.patch(`${DIETITIAN_BASE}/batch/${batchId}/submit`);
};

// [10] GET /patients/search?query=...
export const searchPatients = async (query: string): Promise<PatientSummary[]> => {
  const { data } = await axiosClient.get<PatientSummary[]>(
    `${DIETITIAN_BASE}/patients/search`,
    { params: { query } }
  );
  return data;
};

// [11] GET /batch/{batchId}/rejection-reason
export const getBatchRejectionReason = async (
  batchId: number
): Promise<RejectionReasonResponse> => {
  const { data } = await axiosClient.get<RejectionReasonResponse>(
    `${DIETITIAN_BASE}/batch/${batchId}/rejection-reason`
  );
  return data;
};

// [12] GET /api/v1/medical-files/{fileId}/download
export const downloadPatientFile = async (fileId: number, fileName: string): Promise<void> => {
  const { data, headers } = await axiosClient.get<Blob>(
    `/api/v1/medical-files/${fileId}/download`,
    { responseType: "blob" }
  );
  // Try to get filename from Content-Disposition, fall back to provided fileName
  const disposition: string = headers["content-disposition"] ?? "";
  const match = disposition.match(/filename\*?=['"]?(?:UTF-8'')?([^;"'\n]+)/i);
  const name = match ? decodeURIComponent(match[1].trim()) : fileName;
  const url = URL.createObjectURL(data);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
};

// [13] GET /batch/{batchId}/items
export const getBatchItems = async (batchId: number): Promise<BatchDetailsResponse> => {
  const { data } = await axiosClient.get<BatchDetailsResponse>(
    `${DIETITIAN_BASE}/batch/${batchId}/items`
  );
  return data;
};

// [14] PUT /batch/{batchId}/update
export const updateMenuBatch = async (
  batchId: number,
  dto: UpdateMenuRequest
): Promise<MenuBatch> => {
  const { data } = await axiosClient.put<MenuBatch>(
    `${DIETITIAN_BASE}/batch/${batchId}/update`,
    dto
  );
  return data;
};

// [15] DELETE /batch/{batchId}/delete-content
export const deleteBatchContent = async (
  batchId: number,
  opts: { day?: number; mealType?: MealType } = {}
): Promise<void> => {
  await axiosClient.delete(`${DIETITIAN_BASE}/batch/${batchId}/delete-content`, {
    params: opts,
  });
};
