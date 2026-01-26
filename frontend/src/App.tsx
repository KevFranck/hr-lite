import { useEffect, useState } from "react";
import { createDepartment, listDepartments } from "./api/departments";
import { Button, Card, Input } from "./components/ui";
import type { Department } from "./types/domain";
import { getErrorMessage } from "./utils/errors";

export default function App() {
  const [items, setItems] = useState<Department[]>([]);
  const [name, setName] = useState("");
  const [err, setErr] = useState("");

  async function load() {
    setErr("");
    try {
      const data = await listDepartments();
      setItems(data);
    } catch (e: unknown) {
      setErr(getErrorMessage(e));
    }
  }

  async function create() {
    setErr("");
    try {
      await createDepartment({ name: name.trim() });
      setName("");
      await load();
    } catch (e: unknown) {
      setErr(getErrorMessage(e));
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-2xl space-y-4">
        <Card>
          <div className="text-xl font-semibold">
            Departments (Axios + TS strict)
          </div>
          <div className="mt-3 flex gap-2">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="IT"
            />
            <Button disabled={name.trim().length < 2} onClick={create}>
              Create
            </Button>
          </div>
          {err && <div className="mt-3 text-sm text-red-600">{err}</div>}
        </Card>

        <Card>
          <div className="font-semibold">List</div>
          <ul className="mt-3 list-disc pl-6 text-sm">
            {items.map((d) => (
              <li key={d.id}>{d.name}</li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
