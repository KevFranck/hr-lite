import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Badge from "../../components/Badge";
import { Button, Card, Input, Select } from "../../components/ui";
import { getErrorMessage } from "../../utils/errors";

import { listDepartments } from "../../api/departments";
import {
  getEmployee,
  updateEmployee,
  updateEmployeePhoto,
} from "../../api/employees";
import { listPositions } from "../../api/positions";
import type {
  Department,
  Employee,
  EmployeeUpdate,
  Position,
} from "../../types/domain";
import { mediaUrl } from "../../types/media";

type FormState = {
  first_name: string;
  last_name: string;
  email: string;
  status: "active" | "inactive";
  hire_date: string; // yyyy-mm-dd or ""
  department_id: string;
  position_id: string;
};

function toDateInput(value: string | null | undefined): string {
  // Si ton backend renvoie "2026-01-26T..." on prend seulement la date
  if (!value) return "";
  return value.length >= 10 ? value.slice(0, 10) : value;
}

export default function EditEmployeePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [deps, setDeps] = useState<Department[]>([]);
  const [pos, setPos] = useState<Position[]>([]);
  const [item, setItem] = useState<Employee | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [err, setErr] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState<FormState>({
    first_name: "",
    last_name: "",
    email: "",
    status: "active",
    hire_date: "",
    department_id: "",
    position_id: "",
  });

  // Photo
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>("");

  const canSave = useMemo(() => {
    return (
      form.first_name.trim().length >= 2 &&
      form.last_name.trim().length >= 2 &&
      form.email.trim().includes("@") &&
      !!form.department_id &&
      !!form.position_id &&
      !saving
    );
  }, [form, saving]);

  async function load() {
    if (!id) return;
    setLoading(true);
    setErr("");
    setSuccess("");

    try {
      const [d, p, emp] = await Promise.all([
        listDepartments(),
        listPositions(),
        getEmployee(id),
      ]);
      setDeps(d);
      setPos(p);
      setItem(emp);

      // Préremplir le formulaire
      setForm({
        first_name: emp.first_name ?? "",
        last_name: emp.last_name ?? "",
        email: emp.email ?? "",
        status: (emp.status as "active" | "inactive") ?? "active",
        hire_date: toDateInput(emp.hire_date ?? ""),
        department_id: emp.department?.id ?? "",
        position_id: emp.position?.id ?? "",
      });

      // reset photo picker
      setPhotoFile(null);
      setPhotoPreview("");
    } catch (e: unknown) {
      setErr(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setErr("");
    setSuccess("");
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function onPickPhoto(file: File | null) {
    setErr("");
    setSuccess("");

    setPhotoFile(file);
    if (!file) {
      setPhotoPreview("");
      return;
    }
    setPhotoPreview(URL.createObjectURL(file));
  }

  function buildPatchPayload(): EmployeeUpdate {
    // PATCH only what we want to update
    return {
      first_name: form.first_name.trim(),
      last_name: form.last_name.trim(),
      email: form.email.trim(),
      status: form.status,
      department_id: form.department_id,
      position_id: form.position_id,
      hire_date: form.hire_date.trim() ? form.hire_date.trim() : null,
    };
  }

  async function onSave() {
    if (!id) return;
    setSaving(true);
    setErr("");
    setSuccess("");

    try {
      const payload = buildPatchPayload();
      await updateEmployee(id, payload);
      setSuccess("Saved ✅");
      await load();
    } catch (e: unknown) {
      setErr(getErrorMessage(e));
    } finally {
      setSaving(false);
    }
  }

  async function onUploadPhoto() {
    if (!id) return;
    setUploading(true);
    setErr("");
    setSuccess("");

    try {
      if (!photoFile) throw new Error("Pick a photo first.");

      const fd = new FormData();
      // IMPORTANT: le nom du champ doit matcher le backend.
      // Ici on utilise "photo" (comme create). Si ton backend attend "file", on change.
      fd.append("photo", photoFile);

      await updateEmployeePhoto(id, fd);
      setSuccess("Photo updated ✅");
      setPhotoFile(null);
      setPhotoPreview("");
      await load();
    } catch (e: unknown) {
      setErr(getErrorMessage(e));
    } finally {
      setUploading(false);
    }
  }

  if (loading) return <Card>Loading…</Card>;

  if (!item) {
    return (
      <Card>
        <div className="text-sm text-gray-600">Employee not found.</div>
        <div className="mt-3 flex gap-2">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            Back
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4 max-w-3xl">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-xl font-semibold">Edit Employee</div>
          <div className="text-sm text-gray-600">
            Update employee fields and photo.
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            onClick={() => navigate(`/employees/${item.id}`)}
          >
            Cancel
          </Button>
          <Button variant="ghost" onClick={load}>
            Refresh
          </Button>
        </div>
      </div>

      {/* Summary card */}
      <Card>
        <div className="flex flex-col gap-4 md:flex-row md:items-start">
          <div className="flex items-center gap-3 md:w-64 md:flex-col md:items-start">
            <img
              src={mediaUrl(item.photo_url)}
              alt={`${item.first_name} ${item.last_name}`}
              className="h-20 w-20 rounded-xl border object-cover sm:h-24 sm:w-24"
            />
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <div className="text-lg font-semibold truncate">
                  {item.first_name} {item.last_name}
                </div>
                <Badge value={item.status} />
              </div>
              <div className="mt-1 text-sm text-gray-700 wrap-break-word">
                {item.email}
              </div>
              <div className="mt-1 text-xs text-gray-500 font-mono">
                {item.id}
              </div>
            </div>
          </div>

          <div className="flex-1">
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <div className="text-sm font-medium text-gray-700">
                  First name
                </div>
                <div className="mt-1">
                  <Input
                    value={form.first_name}
                    onChange={(e) => update("first_name", e.target.value)}
                  />
                </div>
              </div>

              <div>
                <div className="text-sm font-medium text-gray-700">
                  Last name
                </div>
                <div className="mt-1">
                  <Input
                    value={form.last_name}
                    onChange={(e) => update("last_name", e.target.value)}
                  />
                </div>
              </div>

              <div>
                <div className="text-sm font-medium text-gray-700">Email</div>
                <div className="mt-1">
                  <Input
                    type="email"
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                  />
                </div>
              </div>

              <div>
                <div className="text-sm font-medium text-gray-700">Status</div>
                <div className="mt-1">
                  <Select
                    value={form.status}
                    onChange={(e) =>
                      update("status", e.target.value as FormState["status"])
                    }
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </Select>
                </div>
              </div>

              <div>
                <div className="text-sm font-medium text-gray-700">
                  Department
                </div>
                <div className="mt-1">
                  <Select
                    value={form.department_id}
                    onChange={(e) => update("department_id", e.target.value)}
                  >
                    <option value="">Select…</option>
                    {deps.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>

              <div>
                <div className="text-sm font-medium text-gray-700">
                  Position
                </div>
                <div className="mt-1">
                  <Select
                    value={form.position_id}
                    onChange={(e) => update("position_id", e.target.value)}
                  >
                    <option value="">Select…</option>
                    {pos.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>

              <div>
                <div className="text-sm font-medium text-gray-700">
                  Hire date
                </div>
                <div className="mt-1">
                  <Input
                    type="date"
                    value={form.hire_date}
                    onChange={(e) => update("hire_date", e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="mt-5 flex gap-2">
              <Button disabled={!canSave} onClick={onSave}>
                {saving ? "Saving…" : "Save changes"}
              </Button>
              <Button
                variant="ghost"
                onClick={() => navigate(`/employees/${item.id}`)}
              >
                Back to details
              </Button>
            </div>

            {err && <div className="mt-3 text-sm text-red-600">{err}</div>}
            {success && (
              <div className="mt-3 text-sm text-green-700">{success}</div>
            )}
          </div>
        </div>
      </Card>

      {/* Photo update card */}
      <Card>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="font-semibold">Update photo</div>
            <div className="text-sm text-gray-600">
              Pick a new image and upload it.
            </div>
          </div>
        </div>

        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => onPickPhoto(e.target.files?.[0] ?? null)}
              className="block w-full text-sm"
            />
            <div className="mt-2 text-xs text-gray-500">
              Tip: choose a square photo for best results.
            </div>
          </div>

          <div className="flex items-center gap-3">
            {photoPreview ? (
              <img
                src={photoPreview}
                alt="preview"
                className="h-16 w-16 rounded-xl border object-cover"
              />
            ) : (
              <div className="h-16 w-16 rounded-xl border bg-gray-50 flex items-center justify-center text-xs text-gray-400">
                Preview
              </div>
            )}
            <div className="text-xs text-gray-500">
              {photoFile ? (
                <>
                  Selected:{" "}
                  <span className="font-medium">{photoFile.name}</span>
                </>
              ) : (
                "No file selected"
              )}
            </div>
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <Button disabled={!photoFile || uploading} onClick={onUploadPhoto}>
            {uploading ? "Uploading…" : "Upload photo"}
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              setPhotoFile(null);
              setPhotoPreview("");
            }}
          >
            Clear
          </Button>
        </div>
      </Card>
    </div>
  );
}
