import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  Plus,
  Search,
  Pencil,
  Trash2,
  Loader2,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  LockKeyhole,
} from "lucide-react";
import {
  accessApi,
  accessError,
  type AccessUser,
  type AccessRole,
  type UserPayload,
  type Workspace,
  type UserPage,
} from "../../services/accessApi";
import { useAuthStore } from "../../store/authStore";
import { can } from "../../lib/permissions";
import AccessDialog, {
  fieldClass,
  primaryClass,
  secondaryClass,
} from "../../components/access/AccessDialog";

const emptyPage: UserPage = {
  data: [],
  total: 0,
  current_page: 1,
  last_page: 1,
};
const emptyForm: UserPayload = {
  name: "",
  email: "",
  password: "",
  role: "agent",
  status: "active",
  tenant_id: null,
};

export default function AdminUsers({ global = true }: { global?: boolean }) {
  const currentUser = useAuthStore((state) => state.user);
  const refreshAccess = useAuthStore((state) => state.refreshAccess);
  const canManage = global
    ? currentUser?.role === "superadmin"
    : can(currentUser, "users.manage");
  const [result, setResult] = useState<UserPage>(emptyPage);
  const [roles, setRoles] = useState<AccessRole[]>([]);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [page, setPage] = useState(1);
  const [revision, setRevision] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [optionsError, setOptionsError] = useState("");
  const [optionsLoading, setOptionsLoading] = useState(true);
  const [editing, setEditing] = useState<AccessUser | "new" | null>(null);
  const [deleting, setDeleting] = useState<AccessUser | null>(null);
  const [form, setForm] = useState<UserPayload>(emptyForm);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    setOptionsLoading(true);
    setOptionsError("");
    Promise.all([
      accessApi.roles(global, controller.signal),
      global ? accessApi.workspaces(controller.signal) : Promise.resolve([]),
    ])
      .then(([roleData, workspaceData]) => {
        setRoles(roleData.roles);
        setWorkspaces(workspaceData);
      })
      .catch((err) => {
        if (!controller.signal.aborted) setOptionsError(accessError(err));
      })
      .finally(() => {
        if (!controller.signal.aborted) setOptionsLoading(false);
      });
    return () => controller.abort();
  }, [global, revision]);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");
    const timer = setTimeout(() => {
      accessApi
        .users(global, search, roleFilter, page, controller.signal)
        .then((data) => {
          if (page > data.last_page) setPage(Math.max(1, data.last_page));
          else setResult(data);
        })
        .catch((err) => {
          if (!controller.signal.aborted) setError(accessError(err));
        })
        .finally(() => {
          if (!controller.signal.aborted) setLoading(false);
        });
    }, 250);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [global, search, roleFilter, page, revision]);

  const assignableRoles = roles.filter(
    (role) =>
      global ||
      role.permissions.every((permission) => can(currentUser, permission)),
  );
  const open = (user?: AccessUser) => {
    setForm(
      user
        ? {
            name: user.name,
            email: user.email,
            password: "",
            role: user.role,
            status: user.status || "active",
            tenant_id: user.tenant_id,
          }
        : {
            ...emptyForm,
            role:
              assignableRoles.find((r) => r.key === "agent")?.key ||
              assignableRoles[0]?.key ||
              "",
            tenant_id: workspaces[0]?.id ?? null,
          },
    );
    setFormError("");
    setEditing(user || "new");
  };
  const protectedAccount =
    editing !== "new" &&
    editing &&
    (String(editing.id) === currentUser?.id ||
      editing.tenant?.owner_id === editing.id);
  const save = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFormError("");
    try {
      const payload: UserPayload = {
        ...form,
        name: form.name.trim(),
        email: form.email.trim(),
      };
      if (!payload.password) delete payload.password;
      if (!global) delete payload.tenant_id;
      await accessApi.saveUser(
        global,
        payload,
        editing === "new" ? undefined : editing?.id,
      );
      if (
        editing !== "new" &&
        editing &&
        String(editing.id) === currentUser?.id
      )
        await refreshAccess();
      setEditing(null);
      setRevision((v) => v + 1);
    } catch (err) {
      setFormError(accessError(err));
    } finally {
      setSaving(false);
    }
  };
  const remove = async () => {
    if (!deleting) return;
    setSaving(true);
    setFormError("");
    try {
      await accessApi.deleteUser(global, deleting.id);
      setDeleting(null);
      setRevision((v) => v + 1);
    } catch (err) {
      setFormError(accessError(err));
    } finally {
      setSaving(false);
    }
  };
  const selectedRole = roles.find((role) => role.key === form.role);

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-green-800">
            <Users size={18} /> Access management
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            {global ? "System Users" : "Workspace Users"}
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            {global
              ? "Create accounts, assign roles, and manage access across workspaces."
              : "Add teammates and manage their access to your workspace."}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {global && (
            <Link to="/admin/roles" className={secondaryClass}>
              <ShieldCheck size={16} /> Roles & Permissions
            </Link>
          )}
          {canManage && (
            <button
              className={primaryClass}
              disabled={optionsLoading || !!optionsError}
              onClick={() => open()}
            >
              <Plus size={17} /> Add User
            </button>
          )}
        </div>
      </div>
      {optionsError && (
        <div
          role="alert"
          className="rounded-xl bg-red-50 p-4 text-sm text-red-700"
        >
          Could not load role options: {optionsError}{" "}
          <button
            className="underline"
            onClick={() => setRevision((v) => v + 1)}
          >
            Retry
          </button>
        </div>
      )}
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4">
        <label className="relative w-full sm:max-w-sm">
          <Search size={16} className="absolute left-3 top-3 text-slate-400" />
          <input
            aria-label="Search users"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className={`${fieldClass} pl-10`}
          />
        </label>
        <select
          aria-label="Filter users by role"
          value={roleFilter}
          onChange={(e) => {
            setRoleFilter(e.target.value);
            setPage(1);
          }}
          className={`${fieldClass} sm:w-48`}
        >
          <option value="">All roles</option>
          {roles.map((role) => (
            <option key={role.key} value={role.key}>
              {role.name}
            </option>
          ))}
        </select>
        <span className="text-sm text-slate-500 sm:ml-auto">
          {result.total} user{result.total !== 1 ? "s" : ""}
        </span>
      </div>
      <div
        className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
        aria-busy={loading}
      >
        {loading ? (
          <div className="flex items-center justify-center gap-2 p-16 text-sm text-slate-500">
            <Loader2 size={22} className="animate-spin text-green-800" />{" "}
            Loading users...
          </div>
        ) : error ? (
          <div role="alert" className="p-10 text-center text-sm text-red-600">
            {error}{" "}
            <button
              onClick={() => setRevision((v) => v + 1)}
              className="ml-2 underline"
            >
              Retry
            </button>
          </div>
        ) : !result.data.length ? (
          <div className="space-y-2 p-16 text-center">
            <Users className="mx-auto text-slate-300" size={32} />
            <p className="font-semibold text-slate-800">No users found</p>
            <p className="text-sm text-slate-500">
              {search || roleFilter
                ? "Try a different search or role filter."
                : "Add a user to get started."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-100 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-6 py-4">User</th>
                  {global && <th className="px-6 py-4">Workspace</th>}
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Created</th>
                  {canManage && (
                    <th className="px-6 py-4 text-right">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {result.data.map((user) => {
                  const ownOrOwner =
                    String(user.id) === currentUser?.id ||
                    user.tenant?.owner_id === user.id;
                  const canEdit =
                    canManage &&
                    (global ||
                      user.permissions.every((permission) =>
                        can(currentUser, permission),
                      ));
                  return (
                    <tr key={user.id} className="hover:bg-slate-50/70">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-50 font-bold text-green-800">
                            {user.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900">
                              {user.name}
                              {String(user.id) === currentUser?.id && (
                                <span className="ml-2 text-xs font-normal text-slate-400">
                                  You
                                </span>
                              )}
                            </p>
                            <p className="mt-1 text-xs text-slate-500">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      {global && (
                        <td className="px-6 py-4 text-slate-600">
                          {user.tenant?.name || "Platform account"}
                        </td>
                      )}
                      <td className="px-6 py-4">
                        <span className="inline-block rounded-lg bg-violet-50 px-2.5 py-1 text-xs font-semibold text-violet-700">
                          {user.access_role?.name ||
                            roles.find((role) => role.key === user.role)
                              ?.name ||
                            user.role}
                        </span>
                        {user.tenant?.owner_id === user.id && (
                          <p className="mt-1 text-xs text-slate-400">
                            Workspace owner
                          </p>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${user.status === "blocked" ? "bg-red-50 text-red-700" : "bg-green-50 text-green-800"}`}
                        >
                          {user.status === "blocked" ? "Blocked" : "Active"}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-xs text-slate-500">
                        {new Date(user.created_at).toLocaleDateString(
                          undefined,
                          { year: "numeric", month: "short", day: "numeric" },
                        )}
                      </td>
                      {canManage && (
                        <td className="px-6 py-4">
                          <div className="flex justify-end gap-2">
                            <button
                              aria-label={`Edit ${user.name}`}
                              title="Edit user"
                              disabled={
                                !canEdit || optionsLoading || !!optionsError
                              }
                              onClick={() => open(user)}
                              className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-green-50 disabled:opacity-30"
                            >
                              <Pencil size={15} />
                            </button>
                            <button
                              aria-label={`Delete ${user.name}`}
                              title={
                                ownOrOwner
                                  ? "Account is protected"
                                  : "Delete user"
                              }
                              disabled={!canEdit || ownOrOwner}
                              onClick={() => {
                                setDeleting(user);
                                setFormError("");
                              }}
                              className="rounded-lg border border-red-100 p-2 text-red-600 hover:bg-red-50 disabled:opacity-30"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        {result.last_page > 1 && (
          <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4 text-sm text-slate-500">
            <span>
              Page {page} of {result.last_page}
            </span>
            <div className="flex gap-2">
              <button
                aria-label="Previous page"
                disabled={loading || page === 1}
                onClick={() => setPage((p) => p - 1)}
                className={secondaryClass}
              >
                <ChevronLeft size={16} />
              </button>
              <button
                aria-label="Next page"
                disabled={loading || page >= result.last_page}
                onClick={() => setPage((p) => p + 1)}
                className={secondaryClass}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
      {editing && (
        <AccessDialog
          title={editing === "new" ? "Add User" : "Edit User"}
          busy={saving}
          onClose={() => setEditing(null)}
        >
          <form onSubmit={save} className="space-y-5 p-6">
            {protectedAccount && (
              <p className="flex items-center gap-2 rounded-xl bg-amber-50 p-3 text-sm text-amber-800">
                <LockKeyhole size={17} /> This account's role, status, and
                workspace are protected.
              </p>
            )}
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block space-y-2 text-sm font-semibold">
                Full name
                <input
                  autoComplete="name"
                  required
                  maxLength={255}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  disabled={saving}
                  className={fieldClass}
                />
              </label>
              <label className="block space-y-2 text-sm font-semibold">
                Email address
                <input
                  type="email"
                  autoComplete="email"
                  required
                  maxLength={255}
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  disabled={saving}
                  className={fieldClass}
                />
              </label>
            </div>
            <label className="block space-y-2 text-sm font-semibold">
              {editing === "new" ? "Password" : "New password (optional)"}
              <input
                type="password"
                autoComplete="new-password"
                required={editing === "new"}
                minLength={8}
                maxLength={128}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                disabled={saving}
                className={fieldClass}
                placeholder={
                  editing === "new"
                    ? "At least 8 characters"
                    : "Leave empty to keep the current password"
                }
              />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block space-y-2 text-sm font-semibold">
                Role
                <select
                  required
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  disabled={saving || !!protectedAccount}
                  className={fieldClass}
                >
                  {assignableRoles.map((role) => (
                    <option key={role.key} value={role.key}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block space-y-2 text-sm font-semibold">
                Status
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  disabled={saving || !!protectedAccount}
                  className={fieldClass}
                >
                  <option value="active">Active</option>
                  <option value="blocked">Blocked</option>
                </select>
              </label>
            </div>
            {global && (
              <label className="block space-y-2 text-sm font-semibold">
                Workspace
                <select
                  value={form.tenant_id ?? ""}
                  required={form.role !== "superadmin"}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      tenant_id: e.target.value ? Number(e.target.value) : null,
                    })
                  }
                  disabled={saving || !!protectedAccount}
                  className={fieldClass}
                >
                  <option value="">
                    {form.role === "superadmin"
                      ? "Platform account (no workspace)"
                      : "Select a workspace"}
                  </option>
                  {workspaces.map((workspace) => (
                    <option key={workspace.id} value={workspace.id}>
                      {workspace.name}
                    </option>
                  ))}
                </select>
              </label>
            )}
            {selectedRole && (
              <div className="rounded-xl border border-green-100 bg-green-50 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-green-900">
                  <ShieldCheck size={16} /> {selectedRole.name}
                </div>
                <p className="mt-1 text-xs text-green-800">
                  {selectedRole.description || "Custom CRM access."}
                </p>
                <p className="mt-2 text-xs text-green-800">
                  {selectedRole.permissions.length} permissions
                  {form.role === "superadmin"
                    ? " · Full platform access"
                    : " · Access limited to the assigned workspace"}
                </p>
              </div>
            )}
            {editing === "new" && (
              <p className="text-xs text-slate-500">
                The user can sign in immediately with this email and password.
                Share the credentials securely.
              </p>
            )}
            {formError && (
              <p
                role="alert"
                className="rounded-xl bg-red-50 p-3 text-sm text-red-700"
              >
                {formError}
              </p>
            )}
            <div className="flex justify-end gap-3">
              <button
                type="button"
                className={secondaryClass}
                disabled={saving}
                onClick={() => setEditing(null)}
              >
                Cancel
              </button>
              <button
                className={primaryClass}
                disabled={saving || !form.name.trim() || !form.role}
              >
                {saving && <Loader2 size={16} className="animate-spin" />}
                {editing === "new" ? "Create user" : "Save changes"}
              </button>
            </div>
          </form>
        </AccessDialog>
      )}
      {deleting && (
        <AccessDialog
          title="Delete user"
          busy={saving}
          onClose={() => setDeleting(null)}
        >
          <div className="space-y-5 p-6">
            <p className="text-sm text-slate-600">
              Delete <strong>{deleting.name}</strong> ({deleting.email})? Their
              account and access tokens will be removed.
            </p>
            {formError && (
              <p role="alert" className="text-sm text-red-600">
                {formError}
              </p>
            )}
            <div className="flex justify-end gap-3">
              <button
                className={secondaryClass}
                disabled={saving}
                onClick={() => setDeleting(null)}
              >
                Cancel
              </button>
              <button
                className={`${primaryClass} bg-red-600 hover:bg-red-700`}
                disabled={saving}
                onClick={remove}
              >
                {saving && <Loader2 size={16} className="animate-spin" />}Delete
                user
              </button>
            </div>
          </div>
        </AccessDialog>
      )}
    </div>
  );
}
