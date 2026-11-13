import axios from "axios";
import { apiClient } from "./apiClient";

export interface AccessRole {
  id: number;
  key: string;
  name: string;
  description: string | null;
  permissions: string[];
  is_system: boolean;
  users_count?: number;
}

export interface Permission {
  key: string;
  module: string;
  group: string;
  label: string;
}

export interface AccessUser {
  id: number;
  name: string;
  email: string;
  role: string;
  status: "active" | "blocked";
  tenant_id: number | null;
  tenant?: { id: number; name: string; owner_id?: number } | null;
  access_role?: AccessRole | null;
  permissions: string[];
  created_at: string;
}

export interface UserPayload {
  name: string;
  email: string;
  password?: string;
  role: string;
  status: string;
  tenant_id?: number | null;
}

export type RolePayload = Pick<
  AccessRole,
  "name" | "description" | "permissions"
>;
export type Workspace = { id: number; name: string };
export type UserPage = {
  data: AccessUser[];
  total: number;
  current_page: number;
  last_page: number;
};

export const accessApi = {
  async users(
    global: boolean,
    search: string,
    role: string,
    page: number,
    signal?: AbortSignal,
  ) {
    const { data } = await apiClient.get<{ data: UserPage }>(
      global ? "/admin/users" : "/team/users",
      { params: { search, role, page }, signal },
    );
    return data.data;
  },
  async saveUser(global: boolean, payload: UserPayload, id?: number) {
    const url = global ? "/admin/users" : "/team/users";
    const { data } = await apiClient.request<{ user: AccessUser }>({
      url: id ? `${url}/${id}` : url,
      method: id ? "PUT" : "POST",
      data: payload,
    });
    return data.user;
  },
  async deleteUser(global: boolean, id: number) {
    await apiClient.delete(`${global ? "/admin/users" : "/team/users"}/${id}`);
  },
  async roles(global = true, signal?: AbortSignal) {
    const { data } = await apiClient.get<{
      roles: AccessRole[];
      permissions?: Permission[];
    }>(global ? "/admin/roles" : "/access/roles", { signal });
    return data;
  },
  async workspaces(signal?: AbortSignal) {
    const { data } = await apiClient.get<{ workspaces: Workspace[] }>(
      "/admin/access/workspaces",
      { signal },
    );
    return data.workspaces;
  },
  async saveRole(payload: RolePayload, id?: number) {
    await apiClient.request({
      url: id ? `/admin/roles/${id}` : "/admin/roles",
      method: id ? "PUT" : "POST",
      data: payload,
    });
  },
  async deleteRole(id: number) {
    await apiClient.delete(`/admin/roles/${id}`);
  },
};

export function accessError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const errors = error.response?.data?.errors;
    return (
      (errors
        ? Object.values(errors).flat().join(" ")
        : error.response?.data?.message) ||
      "Unable to connect. Please try again."
    );
  }
  return error instanceof Error
    ? error.message
    : "Something went wrong. Please try again.";
}
