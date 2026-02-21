import axiosClient from "../api/axiosClient";

const CATERER_BASE = "/api/v1/caterer";

// ─── Enums / Union Types ──────────────────────────────────────────────────────

export type CatererDeliveryStatus = "PENDING" | "IN_PROGRESS" | "DELIVERED" | "FAILED";

// ─── Models ───────────────────────────────────────────────────────────────────

export interface CatererStats {
  totalDeliveries: number;
  pendingDeliveries: number;
  inProgressDeliveries: number;
  deliveredDeliveries: number;
  failedDeliveries: number;
}

export interface DeliveryMeal {
  type: string;
  description: string;
}

export interface CatererDelivery {
  deliveryId: number;
  clientFullName: string;
  phone: string;
  fullAddress: string;
  district: string;
  deliveryDate: string;
  dayNumber: number;
  deliveryNotes: string | null;
  catererNote: string | null;
  status: CatererDeliveryStatus;
  estimatedTime: string | null;
  meals: DeliveryMeal[];
}

export interface CatererProfile {
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
}

// ─── Request DTOs ─────────────────────────────────────────────────────────────

export interface UpdateDeliveryStatusRequest {
  status: CatererDeliveryStatus;
  /** Max 255 characters */
  catererNote?: string;
}

export interface CatererProfileUpdateRequest {
  name?: string;
  phone?: string;
  address?: string;
  email?: string;
  password?: string;
}

export interface MarkDeliveryFailedRequest {
  deliveryId: number;
  failureReason: string;
  note?: string;
}

export interface DeliveryFilters {
  name?: string;
  district?: string;
  /** YYYY-MM-DD */
  date?: string;
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

// [1] GET /stats
export const getCatererStats = async (): Promise<CatererStats> => {
  const { data } = await axiosClient.get<CatererStats>(`${CATERER_BASE}/stats`);
  return data;
};

// [2] GET /deliveries
export const getDeliveries = async (filters?: DeliveryFilters): Promise<CatererDelivery[]> => {
  const { data } = await axiosClient.get<CatererDelivery[]>(`${CATERER_BASE}/deliveries`, {
    params: filters,
  });
  return data;
};

// [3] PATCH /deliveries/{deliveryId}/status
export const updateDeliveryStatus = async (
  deliveryId: number,
  dto: UpdateDeliveryStatusRequest
): Promise<void> => {
  await axiosClient.patch(`${CATERER_BASE}/deliveries/${deliveryId}/status`, dto);
};

// [4] GET /profile
export const getCatererProfile = async (): Promise<CatererProfile> => {
  const { data } = await axiosClient.get<CatererProfile>(`${CATERER_BASE}/profile`);
  return data;
};

// [5] PUT /profile
export const updateCatererProfile = async (dto: CatererProfileUpdateRequest): Promise<void> => {
  await axiosClient.put(`${CATERER_BASE}/profile`, dto);
};

// [6] PUT /deliveries/{id}/estimate?time=HH:mm
export const setDeliveryEstimate = async (deliveryId: number, time: string): Promise<void> => {
  await axiosClient.put(`${CATERER_BASE}/deliveries/${deliveryId}/estimate`, null, {
    params: { time },
  });
};

// [7] PATCH /deliveries/failed
export const markDeliveryFailed = async (dto: MarkDeliveryFailedRequest): Promise<void> => {
  await axiosClient.patch(`${CATERER_BASE}/deliveries/failed`, dto);
};
