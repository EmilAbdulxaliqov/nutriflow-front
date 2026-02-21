import axiosClient from "../api/axiosClient";

const USER_BASE = "/api/v1/user";

// ─── Shared Enums / Union Types ───────────────────────────────────────────────

export type SubscriptionStatus = "ACTIVE" | "INACTIVE" | "CANCELLED" | "EXPIRED";
export type MenuStatus = "PENDING" | "PREPARING" | "READY" | "APPROVED" | "REJECTED";
export type DeliveryStatus = "PENDING" | "IN_PROGRESS" | "READY" | "ON_THE_WAY" | "DELIVERED";
export type GoalType = "LOSE" | "GAIN" | "MAINTAIN";
export type MealType = "BREAKFAST" | "LUNCH" | "DINNER" | "SNACK";

// ─── Request Payloads ─────────────────────────────────────────────────────────

/** Body for POST /api/v1/user/menu/approve */
export interface MenuApprovePayload {
  batchId: number;
  /** Max 500 characters */
  deliveryNotes: string;
}

/** Body for PUT /api/v1/user/profile/update (all fields optional — send only dirty fields) */
export interface UpdateProfilePayload {
  firstName?: string;
  lastName?: string;
  /** Must match phone pattern */
  phoneNumber?: string;
  password?: string;
  city?: string;
  district?: string;
  addressDetails?: string;
  /** Max 500 characters */
  deliveryNotes?: string;
  weight?: number;
  height?: number;
  goal?: GoalType;
  restrictions?: string;
  notes?: string;
}

// ─── Response Shapes ──────────────────────────────────────────────────────────

export interface TodayDelivery {
  date: string;
  status: DeliveryStatus;
  estimatedTime: string;
  meals: string[];
}

/** Response for GET /api/v1/user/dashboard/summary */
export interface DashboardSummary {
  planName: string;
  subscriptionStatus: SubscriptionStatus;
  menuStatus: MenuStatus;
  nextRenewalDate: string;
  completedDeliveries: number;
  totalDays: number;
  dietitianFullName: string;
  progressPercentage: number;
  todayDelivery?: TodayDelivery | null;
}

export interface MenuItem {
  day: number;
  mealType: MealType;
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

/** Response for GET /api/v1/user/my-menu (array, we take first element) */
export interface MyMenu {
  menuId: number;
  batchId: number;
  year: number;
  month: number;
  dietaryNotes: string | null;
  status: MenuStatus;
  items: MenuItem[];
}

/** Response for GET /api/v1/user/medical-profile */
export interface MedicalProfile {
  height: number | null;
  weight: number | null;
  goal: GoalType | null;
  restrictions: string | null;
  notes: string | null;
  /** Computed by server or derived on client */
  bmi?: number;
}

/** Response for GET /api/v1/user/personal-info */
export interface PersonalInfo {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string | null;
  userStatus: string;
  city: string | null;
  district: string | null;
  addressDetails: string | null;
  deliveryNotes: string | null;
  // Medical fields also returned by this endpoint
  height: number | null;
  weight: number | null;
  bmi: number;
  goal: GoalType | null;
  restrictions: string | null;
  notes: string | null;
  medicalFiles: unknown[];
  emailVerified: boolean;
}

export interface DeliveryMeal {
  type: string;
  description: string;
}

/** Response for GET /api/v1/user/deliveries (array item) */
export interface Delivery {
  deliveryId: number;
  clientFullName: string;
  deliveryDate: string;
  dayNumber: number;
  phone: string;
  fullAddress: string;
  district: string;
  deliveryNotes: string | null;
  status: DeliveryStatus;
  estimatedTime: string | null;
  meals: DeliveryMeal[];
}

/** Response for GET /api/v1/user/subscription/info */
export interface SubscriptionInfo {
  subscriptionId: number;
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  userStatus: string;
  planName: string;
  price: number;
  status: SubscriptionStatus;
  startDate: string;
  endDate: string;
  daysRemaining: number;
  monthsRemaining: number;
  active: boolean;
}

// ─── Centralized Error Mapper ─────────────────────────────────────────────────

/**
 * Extracts a human-readable message from an Axios error response.
 * Falls back to a generic message so callers never need to handle raw errors.
 */
export function extractErrorMessage(error: unknown, fallback = "Something went wrong. Please try again."): string {
  if (error && typeof error === "object" && "response" in error) {
    const response = (error as { response?: { data?: { message?: string; error?: string } } }).response;
    return response?.data?.message ?? response?.data?.error ?? fallback;
  }
  if (error instanceof Error) return error.message;
  return fallback;
}

// ─── API Methods ──────────────────────────────────────────────────────────────

/** 1) GET /api/v1/user/dashboard/summary */
export const getDashboardSummary = async (): Promise<DashboardSummary> => {
  const { data } = await axiosClient.get<DashboardSummary>(`${USER_BASE}/dashboard/summary`);
  return data;
};

/** 2) GET /api/v1/user/my-menu — returns array, we expose the first entry or null */
export const getMyMenu = async (): Promise<MyMenu | null> => {
  const { data } = await axiosClient.get<MyMenu[]>(`${USER_BASE}/my-menu`);
  return Array.isArray(data) && data.length > 0 ? data[0] : null;
};

/** 3) POST /api/v1/user/menu/approve */
export const approveMenu = async (payload: MenuApprovePayload): Promise<void> => {
  await axiosClient.post(`${USER_BASE}/menu/approve`, payload);
};

/** 4) POST /api/v1/user/menu/reject?batchId=&reason= */
export const rejectMenu = async (batchId: number, reason: string): Promise<void> => {
  await axiosClient.post(`${USER_BASE}/menu/reject`, null, {
    params: { batchId, reason },
  });
};

/** 5) GET /api/v1/user/medical-profile */
export const getMedicalProfile = async (): Promise<MedicalProfile> => {
  const { data } = await axiosClient.get<MedicalProfile>(`${USER_BASE}/medical-profile`);
  return data;
};

/** 6) PUT /api/v1/user/profile/update */
export const updateProfile = async (payload: UpdateProfilePayload): Promise<void> => {
  await axiosClient.put(`${USER_BASE}/profile/update`, payload);
};

/** 7) POST /api/v1/user/subscription/cancel */
export const cancelSubscription = async (): Promise<void> => {
  await axiosClient.post(`${USER_BASE}/subscription/cancel`);
};

/** 8) GET /api/v1/user/deliveries */
export const getDeliveries = async (): Promise<Delivery[]> => {
  const { data } = await axiosClient.get<Delivery[]>(`${USER_BASE}/deliveries`);
  return data;
};

/** 9) GET /api/v1/user/subscription/info */
export const getSubscriptionInfo = async (): Promise<SubscriptionInfo> => {
  const { data } = await axiosClient.get<SubscriptionInfo>(`${USER_BASE}/subscription/info`);
  return data;
};

/** 10) GET /api/v1/user/personal-info */
export const getPersonalInfo = async (): Promise<PersonalInfo> => {
  const { data } = await axiosClient.get<PersonalInfo>(`${USER_BASE}/personal-info`);
  return data;
};

// ─── Payment ──────────────────────────────────────────────────────────────────

/** Response returned by the backend for POST /api/v1/payments/subscribe */
export interface CheckoutSessionResponse {
  checkoutUrl: string;
  message: string;
}

/**
 * POST /api/v1/payments/subscribe
 * Creates a Stripe checkout session for the authenticated user and returns
 * the hosted checkout URL to redirect to.
 */
export const createCheckoutSession = async (): Promise<CheckoutSessionResponse> => {
  const { data } = await axiosClient.post<CheckoutSessionResponse>("/api/v1/payments/subscribe");
  return data;
};
