import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  Plus,
  Pencil,
  Trash2,
  Loader2,
  LockKeyhole,
  Users,
  Search,
} from "lucide-react";
import {
  accessApi,
  accessError,
  type AccessRole,
  type Permission,
} from "../../services/accessApi";
import AccessDialog, {
  fieldClass,
  primaryClass,
  secondaryClass,
} from "../../components/access/AccessDialog";

export default function AdminRoles() {
  const [roles, setRoles] = useState<AccessRole[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [revision, setRevision] = useState(0);
  const [editing, setEditing] = useState<AccessRole | "new" | null>(null);
  const [deleting, setDeleting] = useState<AccessRole | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");
    accessApi
      .roles(true, controller.signal)
      .then((data) => {
        setRoles(data.roles);
        setPermissions(data.permissions || []);
      })
      .catch((err) => {
        if (!controller.signal.aborted) setError(accessError(err));
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [revision]);

  const open = (role?: AccessRole) => {
    setName(role?.name || "");
    setDescription(role?.description || "");
    setSelected(role?.permissions || []);
    setFormError("");
    setEditing(role || "new");
  };
  const protectedRole =
    editing !== "new" &&
    editing &&
    ["admin", "superadmin"].includes(editing.key);
  const groups = [...new Set(permissions.map((p) => p.module))];
  const toggle = (key: string, enabled: boolean) => {
    setSelected((previous) => {
      const next = new Set(previous);
      if (enabled) {
        next.add(key);
        if (key.endsWith(".manage")) next.add(key.replace(".manage", ".view"));
      } else {
        next.delete(key);
        if (key.endsWith(".view")) next.delete(key.replace(".view", ".manage"));
      }
      return [...next];
    });
  };
  const save = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFormError("");
    try {
      await accessApi.saveRole(
        {
          name: name.trim(),
          description: description.trim(),
          permissions: selected,
        },
        editing === "new" ? undefined : editing?.id,
      );
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
      await accessApi.deleteRole(deleting.id);
      setDeleting(null);
      setRevision((v) => v + 1);
    } catch (err) {
      setFormError(accessError(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-green-800">
            <ShieldCheck size={18} /> Access management
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            Roles & Permissions
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Choose what each role can view and manage across the CRM.
          </p>
        </div>
        <button
          onClick={() => open()}
          disabled={loading || !!error}
          className={primaryClass}
        >
          <Plus size={17} /> Add Role
        </button>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4">
        <label className="relative w-full sm:max-w-xs">
          <Search size={16} className="absolute left-3 top-3 text-slate-400" />
          <input
            aria-label="Search roles"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search roles..."
            className={`${fieldClass} pl-10`}
          />
        </label>
        <Link
          to="/admin/users"
          className="inline-flex items-center gap-2 text-sm font-semibold text-green-800"
        >
          <Users size={16} /> Manage users
        </Link>
      </div>
      {error ? (
        <div
          role="alert"
          className="rounded-xl bg-red-50 p-5 text-sm text-red-700"
        >
          {error}{" "}
          <button
            className="ml-2 underline"
            onClick={() => setRevision((v) => v + 1)}
          >
            Retry
          </button>
        </div>
      ) : loading ? (
        <div className="flex justify-center p-16">
          <Loader2
            className="animate-spin text-green-800"
            aria-label="Loading roles"
          />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {roles
            .filter((role) =>
              `${role.name} ${role.description || ""}`
                .toLowerCase()
                .includes(search.toLowerCase()),
            )
            .map((role) => (
              <div
                key={role.id}
                className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="mb-4 flex items-start justify-between gap-3">
                  <span className="rounded-xl bg-green-50 p-3 text-green-800">
                    <ShieldCheck size={22} />
                  </span>
                  {role.is_system && (
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500">
                      Built-in
                    </span>
                  )}
                </div>
                <h2 className="text-lg font-bold text-slate-900">
                  {role.name}
                </h2>
                <p className="mt-2 min-h-10 text-sm text-slate-500">
                  {role.description || "Custom CRM access."}
                </p>
                <div className="my-5 flex items-center gap-4 text-xs font-medium text-slate-500">
                  <span>{role.permissions.length} permissions</span>
                  <span>{role.users_count || 0} users</span>
                </div>
                <div className="mt-auto flex gap-2 border-t border-slate-100 pt-4">
                  <button
                    className={`${secondaryClass} flex-1`}
                    onClick={() => open(role)}
                  >
                    <Pencil size={14} />
                    {["admin", "superadmin"].includes(role.key)
                      ? "View permissions"
                      : "Edit role"}
                  </button>
                  {!role.is_system && (
                    <button
                      className={secondaryClass}
                      aria-label={`Delete ${role.name}`}
                      disabled={!!role.users_count}
                      title={
                        role.users_count
                          ? "Reassign users before deleting this role"
                          : "Delete role"
                      }
                      onClick={() => {
                        setDeleting(role);
                        setFormError("");
                      }}
                    >
                      <Trash2 size={15} className="text-red-600" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          {!roles.some((role) =>
            `${role.name} ${role.description || ""}`
              .toLowerCase()
              .includes(search.toLowerCase()),
          ) && (
            <p className="p-8 text-sm text-slate-500">
              No roles match your search.
            </p>
          )}
        </div>
      )}
      {editing && (
        <AccessDialog
          title={
            editing === "new"
              ? "Add Role"
              : protectedRole
                ? "Role permissions"
                : "Edit Role"
          }
          busy={saving}
          onClose={() => setEditing(null)}
        >
          <form onSubmit={save} className="space-y-5 p-6">
            {protectedRole && (
              <p className="flex items-center gap-2 rounded-xl bg-amber-50 p-3 text-sm text-amber-800">
                <LockKeyhole size={17} /> Administrator roles are protected to
                preserve full access.
              </p>
            )}
            <label className="block space-y-2 text-sm font-semibold">
              Role name
              <input
                required
                maxLength={100}
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={!!protectedRole || saving}
                className={fieldClass}
                placeholder="e.g. Marketing Manager"
              />
            </label>
            <label className="block space-y-2 text-sm font-semibold">
              Description
              <textarea
                maxLength={500}
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={!!protectedRole || saving}
                className={fieldClass}
                placeholder="Describe this role's responsibilities"
              />
            </label>
            <div className="flex flex-wrap justify-between gap-2">
              <h3 className="text-sm font-bold">
                Permissions{" "}
                <span className="font-normal text-slate-400">
                  ({selected.length} selected)
                </span>
              </h3>
              {!protectedRole && (
                <div className="flex gap-3 text-xs font-semibold text-green-800">
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => setSelected(permissions.map((p) => p.key))}
                  >
                    Select all
                  </button>
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => setSelected([])}
                  >
                    Clear all
                  </button>
                </div>
              )}
            </div>
            <p className="text-xs text-slate-500">
              Manage allows creating, editing, deleting, and running actions in
              a module. It includes View. Custom roles apply across workspaces;
              only Super Admins can edit roles.
            </p>
            <div className="overflow-hidden rounded-xl border border-slate-200">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-left text-xs text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Module</th>
                    <th className="p-3 text-center">View</th>
                    <th className="p-3 text-center">Manage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {groups.map((module) => (
                    <tr key={module}>
                      <td className="px-4 py-3 font-medium">
                        {permissions.find((p) => p.module === module)?.group}
                      </td>
                      {["view", "manage"].map((action) => {
                        const key = `${module}.${action}`;
                        return (
                          <td key={action} className="p-3 text-center">
                            {permissions.some((p) => p.key === key) ? (
                              <input
                                type="checkbox"
                                aria-label={`${permissions.find((p) => p.module === module)?.group}: ${action}`}
                                className="h-4 w-4 accent-green-800"
                                checked={selected.includes(key)}
                                disabled={!!protectedRole || saving}
                                onChange={(e) => toggle(key, e.target.checked)}
                              />
                            ) : (
                              <span className="text-slate-300">—</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
                disabled={saving}
                onClick={() => setEditing(null)}
                className={secondaryClass}
              >
                {protectedRole ? "Close" : "Cancel"}
              </button>
              {!protectedRole && (
                <button
                  disabled={saving || !name.trim()}
                  className={primaryClass}
                >
                  {saving && <Loader2 size={16} className="animate-spin" />}
                  {editing === "new" ? "Create role" : "Save changes"}
                </button>
              )}
            </div>
          </form>
        </AccessDialog>
      )}
      {deleting && (
        <AccessDialog
          title="Delete role"
          busy={saving}
          onClose={() => setDeleting(null)}
        >
          <div className="space-y-5 p-6">
            <p className="text-sm text-slate-600">
              Delete <strong>{deleting.name}</strong>? This role will no longer
              be available for assignment.
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
                role
              </button>
            </div>
          </div>
        </AccessDialog>
      )}
    </div>
  );
}
