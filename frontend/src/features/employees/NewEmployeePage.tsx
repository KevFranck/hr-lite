import { useEffect, useMemo, useState } from "react";
import { Button, Card, Input, Select } from "../../components/ui";
import { getErrorMessage } from "../../utils/errors";

import { listDepartments } from "../../api/departments";
import { createEmployee } from "../../api/employees";
import { listPositions } from "../../api/positions";
import type { Department, Position } from "../../types/domain";

type FormState = {
  first_name: string;
  last_name: string;
  email: string;
  status: "active" | "inactive";
  hire_date: string; // yyyy-mm-dd (string) ; on peut envoyer vide => null
  department_id: string;
  position_id: string;
};

export default function NewEmployeePage() {
  const [deps, setDeps] = useState<Department[]>([]);
  const [pos, setPos] = useState<Position[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState("");

  // form
  const [form, setForm] = useState<FormState>({
    first_name: "",
    last_name: "",
    email: "",
    status: "active",
    hire_date: "",
    department_id: "",
    position_id: "",
  });

  // photo
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>("");

  const canSubmit = useMemo(() => {
    const okText =
      form.first_name.trim().length >= 2 &&
      form.last_name.trim().length >= 2 &&
      form.email.trim().includes("@") &&
      form.department_id &&
      form.position_id;

    const okPhoto = !!photoFile;

    return okText && okPhoto && !saving;
  }, [form, photoFile, saving]);

  async function loadRefs() {
    setLoading(true);
    setErr("");
    try {
      const [d, p] = await Promise.all([listDepartments(), listPositions()]);
      setDeps(d);
      setPos(p);
    } catch (e: unknown) {
      setErr(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRefs();
  }, []);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setSuccess("");
    setErr("");
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function onPickPhoto(file: File | null) {
    setSuccess("");
    setErr("");

    setPhotoFile(file);
    if (!file) {
      setPhotoPreview("");
      return;
    }

    const url = URL.createObjectURL(file);
    setPhotoPreview(url);
  }

  async function onSubmit() {
    setSaving(true);
    setErr("");
    setSuccess("");

    try {
      if (!photoFile) {
        throw new Error("Photo is required.");
      }

      const fd = new FormData();
      fd.append("first_name", form.first_name.trim());
      fd.append("last_name", form.last_name.trim());
      fd.append("email", form.email.trim());
      fd.append("status", form.status);
      fd.append("department_id", form.department_id);
      fd.append("position_id", form.position_id);

      // hire_date : si vide => ne pas envoyer (ou envoyer null selon backend)
      if (form.hire_date.trim()) {
        fd.append("hire_date", form.hire_date.trim());
      }

      // IMPORTANT: le nom du champ doit correspondre à ce que ton backend attend
      // Souvent: "photo" ou "file". On part sur "photo".
      fd.append("photo", photoFile);

      await createEmployee(fd);

      setSuccess("Employee created successfully ✅");

      // reset form
      setForm({
        first_name: "",
        last_name: "",
        email: "",
        status: "active",
        hire_date: "",
        department_id: "",
        position_id: "",
      });
      setPhotoFile(null);
      setPhotoPreview("");
    } catch (e: unknown) {
      setErr(getErrorMessage(e));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4 max-w-3xl">
      <div>
        <div className="text-xl font-semibold">New Employee</div>
        <div className="text-sm text-gray-600">
          Create an employee with a required photo.
        </div>
      </div>

      {loading ? (
        <Card>Loading…</Card>
      ) : (
        <Card>
          <div className="grid gap-4 md:grid-cols-2">
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
              <div className="text-sm font-medium text-gray-700">Last name</div>
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
                  <option value="">Select a department…</option>
                  {deps.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </Select>
              </div>
            </div>

            <div>
              <div className="text-sm font-medium text-gray-700">Position</div>
              <div className="mt-1">
                <Select
                  value={form.position_id}
                  onChange={(e) => update("position_id", e.target.value)}
                >
                  <option value="">Select a position…</option>
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
                Hire date (optional)
              </div>
              <div className="mt-1">
                <Input
                  type="date"
                  value={form.hire_date}
                  onChange={(e) => update("hire_date", e.target.value)}
                />
              </div>
            </div>

            <div>
              <div className="text-sm font-medium text-gray-700">
                Photo (required)
              </div>
              <div className="mt-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => onPickPhoto(e.target.files?.[0] ?? null)}
                  className="block w-full text-sm"
                />
              </div>

              {photoPreview && (
                <div className="mt-3 flex items-center gap-3">
                  <img
                    src={photoPreview}
                    alt="preview"
                    className="h-16 w-16 rounded-lg border object-cover"
                  />
                  <div className="text-xs text-gray-500">
                    Preview (local). <br />
                    File: {photoFile?.name}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-5 flex items-center gap-2">
            <Button disabled={!canSubmit} onClick={onSubmit}>
              {saving ? "Saving…" : "Create employee"}
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setErr("");
                setSuccess("");
                setForm({
                  first_name: "",
                  last_name: "",
                  email: "",
                  status: "active",
                  hire_date: "",
                  department_id: "",
                  position_id: "",
                });
                setPhotoFile(null);
                setPhotoPreview("");
              }}
            >
              Reset
            </Button>
          </div>

          {err && <div className="mt-3 text-sm text-red-600">{err}</div>}
          {success && (
            <div className="mt-3 text-sm text-green-700">{success}</div>
          )}

          <div className="mt-4 text-xs text-gray-500">
            Tip: if create fails with “missing field photo”, the backend expects
            another field name (e.g.{" "}
            <code className="rounded bg-gray-100 px-1">file</code>). Tell me and
            we’ll adjust.
          </div>
        </Card>
      )}
    </div>
  );
}
