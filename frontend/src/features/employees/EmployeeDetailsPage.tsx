import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Badge from "../../components/Badge";
import { Button, Card } from "../../components/ui";
import { getErrorMessage } from "../../utils/errors";

import { getEmployee } from "../../api/employees";
import type { Employee } from "../../types/domain";
import { mediaUrl } from "../../types/media";

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border bg-white px-3 py-2">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="mt-0.5 text-sm font-medium text-gray-900 wrap-break-word">
        {value}
      </div>
    </div>
  );
}

export default function EmployeeDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [item, setItem] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  async function load() {
    if (!id) return;
    setLoading(true);
    setErr("");
    try {
      const data = await getEmployee(id);
      setItem(data);
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

  if (loading) return <Card>Loading…</Card>;

  if (err) {
    return (
      <Card>
        <div className="text-sm text-red-600">{err}</div>
        <div className="mt-3">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            Back
          </Button>
        </div>
      </Card>
    );
  }

  if (!item) {
    return (
      <Card>
        <div className="text-sm text-gray-600">Employee not found.</div>
        <div className="mt-3">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            Back
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header responsive */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-xl font-semibold">Employee Details</div>
          <div className="text-sm text-gray-600">
            View employee information.
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            Back
          </Button>
          <Button variant="ghost" onClick={load}>
            Refresh
          </Button>
        </div>
      </div>

      {/* Main card */}
      <Card className="p-0 overflow-hidden">
        <div className="p-4 sm:p-6">
          {/* Responsive top section: column on mobile, row on desktop */}
          <div className="flex flex-col gap-4 md:flex-row md:items-start">
            {/* Photo block */}
            <div className="md:w-64">
              <div className="flex items-center gap-4 md:flex-col md:items-start">
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

                  <div className="mt-2 text-xs text-gray-500">
                    ID:{" "}
                    <span className="font-mono">{item.id.slice(0, 8)}…</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-4 flex gap-2 md:flex-col">
                <Button
                  variant="ghost"
                  onClick={() => navigate(`/employees/${item.id}/edit`)}
                  title="Edit employee (next step)"
                >
                  Edit
                </Button>
              </div>
            </div>

            {/* Info grid */}
            <div className="flex-1">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <InfoRow
                  label="Department"
                  value={item.department?.name ?? "-"}
                />
                <InfoRow label="Position" value={item.position?.title ?? "-"} />
                <InfoRow label="Hire date" value={item.hire_date ?? "-"} />
                <InfoRow label="Created" value={item.created_at} />
                <InfoRow label="Updated" value={item.updated_at} />
                <InfoRow label="Full ID" value={item.id} />
              </div>
            </div>
          </div>
        </div>

        {/* Footer subtle */}
        <div className="border-t bg-gray-50 px-4 py-3 sm:px-6 text-xs text-gray-500">
          Tip: use “Edit” to update fields and upload a new photo.
        </div>
      </Card>
    </div>
  );
}
