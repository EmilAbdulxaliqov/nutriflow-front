import axiosClient from "../api/axiosClient";

const AUTH_BASE = "/api/v1/auth";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
}

export interface VerifyOtpPayload {
  email: string;
  otpCode: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  email: string;
  otp: string;
  newPassword: string;
  confirmPassword: string;
}

// ─── Service Methods ──────────────────────────────────────────────────────────

/**
 * Register a new user account.
 */
export const register = async (payload: RegisterPayload) => {
  const { data } = await axiosClient.post(`${AUTH_BASE}/register`, payload);
  return data;
};

/**
 * Verify the email OTP sent after registration.
 */
export const verifyOtp = async (payload: VerifyOtpPayload) => {
  const { data } = await axiosClient.post(`${AUTH_BASE}/verify`, payload);
  return data;
};

/**
 * Log in with email and password.
 * Persists token, refreshToken, role, and email to localStorage.
 * The API returns { token, refreshToken, email, status, role }.
 */
export const login = async (payload: LoginPayload) => {
  const { data } = await axiosClient.post(`${AUTH_BASE}/login`, payload);
  if (data?.token) {
    localStorage.setItem("accessToken", data.token);
  }
  if (data?.refreshToken) {
    localStorage.setItem("refreshToken", data.refreshToken);
  }
  if (data?.role) {
    localStorage.setItem("userRole", data.role);
  }
  if (data?.email) {
    localStorage.setItem("userEmail", data.email);
  }
  return data;
};

/**
 * Redirect the browser directly to Spring Security's OAuth2 authorization
 * endpoint. Spring handles the Google redirect — this is NOT a JSON API call.
 */
export const redirectToGoogleLogin = () => {
  window.location.href = "http://localhost:8080/oauth2/authorization/google";
};

/**
 * Exchange a refresh token for a new access token.
 * Sends the refresh token in the Authorization header.
 */
export const refreshToken = async (token: string) => {
  const { data } = await axiosClient.post(
    `${AUTH_BASE}/refresh-token`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (data?.token) {
    localStorage.setItem("accessToken", data.token);
  }
  return data;
};

/**
 * Resend the OTP verification email.
 */
export const resendOtp = async (email: string) => {
  const { data } = await axiosClient.post(
    `${AUTH_BASE}/resend-otp`,
    {},
    { params: { email } }
  );
  return data;
};

/**
 * Request a password-reset OTP email.
 */
export const forgotPassword = async (payload: ForgotPasswordPayload) => {
  const { data } = await axiosClient.post(`${AUTH_BASE}/forgot-password`, payload);
  return data;
};

/**
 * Reset the password using the OTP received by email.
 */
export const resetPassword = async (payload: ResetPasswordPayload) => {
  const { data } = await axiosClient.post(`${AUTH_BASE}/reset-password`, payload);
  return data;
};
