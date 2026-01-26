import { useEffect, useState } from "react";
import { createPosition, listPositions } from "../../api/positions";
import { Button, Card, Input } from "../../components/ui";
import type { Position } from "../../types/domain";
import { getErrorMessage } from "../../utils/errors";

export default function PositionsPage() {
  const [items, setItems] = useState<Position[]>([]);
  const [title, setTitle] = useState("");
  const [err, setErr] = useState("");

  async function load() {
    setErr("");
    try {
      setItems(await listPositions());
    } catch (e: unknown) {
      setErr(getErrorMessage(e));
    }
  }

  async function onCreate() {
    setErr("");
    try {
      await createPosition({ title: title.trim() });
      setTitle("");
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
        <div className="text-xl font-semibold">Positions</div>
        <div className="text-sm text-gray-600">
          Create and manage positions.
        </div>
      </div>

      <Card>
        <div className="text-sm font-medium text-gray-700">Title</div>
        <div className="mt-1 flex gap-2">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="DevOps Engineer"
          />
          <Button disabled={title.trim().length < 2} onClick={onCreate}>
            Create
          </Button>
        </div>
        {err && <div className="mt-3 text-sm text-red-600">{err}</div>}
      </Card>

      <Card>
        <div className="flex items-center justify-between">
          <div className="font-semibold">All positions</div>
          <div className="text-sm text-gray-500">{items.length} total</div>
        </div>

        <div className="mt-3 divide-y">
          {items.map((p) => (
            <div key={p.id} className="py-3">
              <div className="text-sm font-medium">{p.title}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
