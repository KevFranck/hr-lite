import { useEffect, useState } from "react";
import { createDepartment, listDepartments } from "../../api/departments";
import { Button, Card, Input } from "../../components/ui";
import type { Department } from "../../types/domain";
import { getErrorMessage } from "../../utils/errors";

export default function DepartmentsPage() {
  const [items, setItems] = useState<Department[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [err, setErr] = useState("");

  async function load() {
    setErr("");
    try {
      setItems(await listDepartments());
    } catch (e: unknown) {
      setErr(getErrorMessage(e));
    }
  }

  async function onCreate() {
    setErr("");
    try {
      await createDepartment({
        name: name.trim(),
        description: description.trim() || null,
      });
      setName("");
      setDescription("");
      await load();
    } catch (e: unknown) {
      setErr(getErrorMessage(e));
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-4 max-w-3xl">
      <div>
        <div className="text-xl font-semibold">Departments</div>
        <div className="text-sm text-gray-600">
          Create and manage departments.
        </div>
      </div>

      <Card>
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <div className="text-sm font-medium text-gray-700">Name</div>
            <div className="mt-1">
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="IT"
              />
            </div>
          </div>

          <div>
            <div className="text-sm font-medium text-gray-700">Description</div>
            <div className="mt-1">
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tech department"
              />
            </div>
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <Button disabled={name.trim().length < 2} onClick={onCreate}>
            Create
          </Button>
          <Button variant="ghost" onClick={load}>
            Refresh
          </Button>
        </div>

        {err && <div className="mt-3 text-sm text-red-600">{err}</div>}
      </Card>

      <Card>
        <div className="flex items-center justify-between">
          <div className="font-semibold">All departments</div>
          <div className="text-sm text-gray-500">{items.length} total</div>
        </div>

        <div className="mt-3 divide-y">
          {items.map((d) => (
            <div key={d.id} className="py-3">
              <div className="text-sm font-medium">{d.name}</div>
              {d.description ? (
                <div className="text-sm text-gray-600">{d.description}</div>
              ) : (
                <div className="text-xs text-gray-400">No description</div>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
