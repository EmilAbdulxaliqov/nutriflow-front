import axiosClient from "../api/axiosClient";

const BASE = "/api/v1/admin";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DashboardStats {
  totalUsers: number;
  totalDietitians: number;
  totalCaterers: number;
  activeSubscriptions: number;
  totalRevenue: number;
  totalDeliveries: number;
  successfulDeliveries: number;
  failedDeliveries: number;
  pendingMenus: number;
  approvedMenus: number;
  rejectedMenus: number;
  newUsersThisMonth: number;
  chartData?: Record<string, { users?: number; revenue?: number; deliveries?: number }>;
}

export interface AdminUser {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  status: string;
  goal?: string;
  height?: number;
  weight?: number;
  restrictions?: string;
  notes?: string;
  dietitianFullName?: string;
  catererFullName?: string;
}

export interface AdminDietitian {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  specialization?: string;
  patientCount?: number;
  active: boolean;
  createdAt?: string;
}

export interface AdminCaterer {
  id: number; 
  name: string;
  email: string;
  phone?: string;
  activeDeliveries?: number;
  totalDeliveries?: number;
  active: boolean;
  createdAt?: string;
}

export interface AdminMenu {
  id: number;
  batchId: string;
  userEmail?: string;
  userName?: string;
  dietitianName?: string;
  month?: string;
  status: string;
  createdAt?: string;
}

export interface AdminPayment {
  id: number;
  transactionId: string;
  userEmail: string;
  amount: number;
  currency: string;
  status: string;
  paymentDate: string;
  subscriptionId?: string;
}

export interface AdminLog {
  id: number;
  createdAt: string;
  role: string;
  actorId: number;
  action: string;
  entityType?: string;
  entityId?: number;
  oldValue?: string;
  newValue?: string;
  ipAddress?: string;
  details?: string;
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

export const getDashboardStats = (start?: string, end?: string) => {
  const params: Record<string, string> = {};
  if (start) params.start = start;
  if (end) params.end = end;
  return axiosClient.get<DashboardStats>(`${BASE}/dashboard/stats`, { params });
};

// ─── Admin Profile ────────────────────────────────────────────────────────────

export const updateAdminProfile = (payload: Record<string, unknown>) =>
  axiosClient.put(`${BASE}/profile`, payload);

// ─── Users ────────────────────────────────────────────────────────────────────

export const createUser = (payload: {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  password: string;
  confirmPassword: string;
}) => axiosClient.post(`${BASE}/users`, payload);

export const getUsers = (page = 0, size = 10) =>
  axiosClient.get<Page<AdminUser>>(`${BASE}/users`, { params: { page, size, sort: 'id,desc' } });

export const getUserById = (id: number) =>
  axiosClient.get<AdminUser>(`${BASE}/users/${id}`);

export const searchUsers = (query: string, page = 0, size = 10) =>
  axiosClient.get<Page<AdminUser>>(`${BASE}/users/search`, {
    params: { query, page, size, sort: 'id,desc' },
  });

export const toggleUserStatus = (id: number) =>
  axiosClient.patch(`${BASE}/users/${id}/toggle-status`);

export const deleteUser = (id: number) =>
  axiosClient.delete(`${BASE}/users/${id}`);

export const assignDietitian = (userId: number, dietitianId: number) =>
  axiosClient.post(`${BASE}/users/${userId}/assign-dietitian/${dietitianId}`);

export const assignCaterer = (userId: number, catererId: number) =>
  axiosClient.post(`${BASE}/users/${userId}/assign-caterer/${catererId}`);

export const getUserSubscriptionInfo = (userId: number) =>
  axiosClient.get(`${BASE}/users/${userId}/subscription`);

export const getPendingDietitianAssignments = () =>
  axiosClient.get<AdminUser[]>(`${BASE}/users/pending-dietitian-assignment`);

export const getPendingCatererAssignments = () =>
  axiosClient.get<AdminUser[]>(`${BASE}/users/pending-caterer-assignment`);

// ─── Dietitians ───────────────────────────────────────────────────────────────

export const createDietitian = (payload: {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  specialization?: string;
  password: string;
}) => axiosClient.post(`${BASE}/dietitians`, payload);

export const getDietitians = (page = 0, size = 10) =>
  axiosClient.get<Page<AdminDietitian>>(`${BASE}/dietitians`, { params: { page, size, sort: 'id,desc' } });

export const getDietitianById = (id: number) =>
  axiosClient.get<AdminDietitian>(`${BASE}/dietitians/${id}`);

export const searchDietitians = (query: string, page = 0, size = 10) =>
  axiosClient.get<Page<AdminDietitian>>(`${BASE}/dietitians/search`, {
    params: { query, page, size, sort: 'id,desc' },
  });

export const toggleDietitianStatus = (id: number) =>
  axiosClient.patch(`${BASE}/dietitians/${id}/toggle-status`);

export const deleteDietitian = (id: number) =>
  axiosClient.delete(`${BASE}/dietitians/${id}`);

// ─── Caterers ─────────────────────────────────────────────────────────────────

export const createCaterer = (payload: {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  password: string;
}) => axiosClient.post(`${BASE}/caterers`, payload);

export const getCaterers = (page = 0, size = 10) =>
  axiosClient.get<Page<AdminCaterer>>(`${BASE}/caterers`, { params: { page, size, sort: 'id,desc' } });

export const getCatererById = (id: number) =>
  axiosClient.get<AdminCaterer>(`${BASE}/caterers/${id}`);

export const toggleCatererStatus = (id: number) =>
  axiosClient.patch(`${BASE}/caterers/${id}/toggle-status`);

export const deleteCaterer = (id: number) =>
  axiosClient.delete(`${BASE}/caterers/${id}`);

// ─── Sub-Admins ───────────────────────────────────────────────────────────────

export const createSubAdmin = (payload: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}) => axiosClient.post(`${BASE}/sub-admins/create`, payload);

export const getSubAdmins = (page = 0, size = 20) =>
  axiosClient.get(`${BASE}/sub-admins`, { params: { page, size, sort: 'id,desc' } });

export const toggleSubAdminStatus = (id: number) =>
  axiosClient.patch(`${BASE}/sub-admins/${id}/toggle-status`);

export const deleteSubAdmin = (id: number) =>
  axiosClient.delete(`${BASE}/sub-admins/${id}`);

// ─── Menus ────────────────────────────────────────────────────────────────────

export const getMenus = (page = 0, size = 20) =>
  axiosClient.get<Page<AdminMenu>>(`${BASE}/menus`, { params: { page, size } });

export const getMenuById = (batchId: string) =>
  axiosClient.get<AdminMenu>(`${BASE}/menus/${batchId}`);

// ─── Payments ─────────────────────────────────────────────────────────────────

export const getPayments = (page = 0, size = 20) =>
  axiosClient.get<Page<AdminPayment>>(`${BASE}/payments`, { params: { page, size } });

export const getPaymentById = (id: number) =>
  axiosClient.get<AdminPayment>(`${BASE}/payments/${id}`);

// ─── Logs ─────────────────────────────────────────────────────────────────────

export const getLogs = (page = 0, size = 50) =>
  axiosClient.get<any>(`${BASE}/logs`, { params: { page, size } });
