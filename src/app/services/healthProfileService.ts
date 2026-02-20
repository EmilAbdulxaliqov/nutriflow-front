import axiosClient from "../api/axiosClient";

export interface HealthProfilePayload {
  height: number;
  weight: number;
  /** API values: LOSE | GAIN | MAINTAIN */
  goal: "LOSE" | "GAIN" | "MAINTAIN";
  restrictions: string;
  notes: string;
  addressDetails: string;
  city: string;
  district: string;
  deliveryNotes: string;
}

/**
 * Submit a user's health profile.
 * Sends multipart/form-data with a JSON blob for `data` and optional `files`.
 * Axios sets the correct Content-Type boundary automatically.
 */
export const submitHealthProfile = async (
  payload: HealthProfilePayload,
  files: File[] = []
) => {
  const formData = new FormData();

  // Append the JSON payload as a named Blob.
  // The filename "data.json" is REQUIRED — without it, browsers/axios omit the
  // Content-Type header on that multipart part, causing Spring to reject it.
  formData.append(
    "data",
    new Blob([JSON.stringify(payload)], { type: "application/json" }),
    "data.json"
  );

  // Append each file under the same "files" key
  files.forEach((file) => formData.append("files", file));

  // Delete Content-Type so axios can set "multipart/form-data; boundary=..."
  // automatically. The global axiosClient default of "application/json" would
  // otherwise override it and break the multipart boundary.
  const { data } = await axiosClient.post(
    "/api/v1/health-profile/submit",
    formData,
    { headers: { "Content-Type": undefined } }
  );

  return data;
};
