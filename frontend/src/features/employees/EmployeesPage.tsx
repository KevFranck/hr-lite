import { useEffect, useMemo, useState } from "react";
import Badge from "../../components/Badge";
import { Button, Card, Input, Select } from "../../components/ui";
import { getErrorMessage } from "../../utils/errors";

import { listDepartments } from "../../api/departments";
import { listEmployees } from "../../api/employees";
import { listPositions } from "../../api/positions";
import type {
  Department,
  Employee,
  EmployeeListParams,
  Position,
} from "../../types/domain";
import { mediaUrl } from "../../types/media"; // on va le créer juste après

const DEFAULT_LIMIT = 10;

export default function EmployeesPage() {
  // data
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);

  // UI state
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // filters/search/pagination
  const [q, setQ] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [positionId, setPositionId] = useState("");
  const [limit, setLimit] = useState(DEFAULT_LIMIT);
  const [offset, setOffset] = useState(0);

  const params: EmployeeListParams = useMemo(() => {
    const p: EmployeeListParams = { limit, offset };
    if (q.trim()) p.q = q.trim();
    if (departmentId) p.department_id = departmentId;
    if (positionId) p.position_id = positionId;
    return p;
  }, [q, departmentId, positionId, limit, offset]);

  async function loadAll() {
    setLoading(true);
    setErr("");
    try {
      const [deps, pos, emps] = await Promise.all([
        listDepartments(),
        listPositions(),
        listEmployees(params),
      ]);
      setDepartments(deps);
      setPositions(pos);
      setEmployees(emps);
    } catch (e: unknown) {
      setErr(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // au premier chargement
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // quand filtres changent, on recharge
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  function resetFilters() {
    setQ("");
    setDepartmentId("");
    setPositionId("");
    setLimit(DEFAULT_LIMIT);
    setOffset(0);
  }

  function canPrev() {
    return offset > 0;
  }

  function canNext() {
    // On n'a pas "total count" pour l’instant.
    // Heuristique : s’il y a moins que limit, il n'y a probablement pas de page suivante.
    return employees.length === limit;
  }

  return (
    <div className="space-y-4">
      <div>
        <div className="text-xl font-semibold">Employees</div>
        <div className="text-sm text-gray-600">
          Search, filter, and browse employees.
        </div>
      </div>

      {/* Filters */}
      <Card>
        <div className="grid gap-3 md:grid-cols-4">
          <div className="md:col-span-1">
            <div className="text-sm font-medium text-gray-700">Search</div>
            <div className="mt-1">
              <Input
                value={q}
                onChange={(e) => {
                  setOffset(0);
                  setQ(e.target.value);
                }}
                placeholder="Name or email…"
              />
            </div>
          </div>

          <div>
            <div className="text-sm font-medium text-gray-700">Department</div>
            <div className="mt-1">
              <Select
                value={departmentId}
                onChange={(e) => {
                  setOffset(0);
                  setDepartmentId(e.target.value);
                }}
              >
                <option value="">All</option>
                {departments.map((d) => (
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
                value={positionId}
                onChange={(e) => {
                  setOffset(0);
                  setPositionId(e.target.value);
                }}
              >
                <option value="">All</option>
                {positions.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <div>
            <div className="text-sm font-medium text-gray-700">Page size</div>
            <div className="mt-1">
              <Select
                value={String(limit)}
                onChange={(e) => {
                  setOffset(0);
                  setLimit(Number(e.target.value));
                }}
              >
                {[5, 10, 20, 50].map((n) => (
                  <option key={n} value={String(n)}>
                    {n}
                  </option>
                ))}
              </Select>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <Button variant="ghost" onClick={resetFilters}>
            Reset
          </Button>
          <Button variant="ghost" onClick={loadAll}>
            Refresh
          </Button>

          <div className="ml-auto text-sm text-gray-500">
            {loading ? "Loading…" : `${employees.length} shown`}
          </div>
        </div>

        {err && <div className="mt-3 text-sm text-red-600">{err}</div>}
      </Card>

      {/* Table */}
      <Card className="p-0 overflow-hidden">
        <div className="border-b px-4 py-3 flex items-center justify-between">
          <div className="font-semibold">Employee list</div>
          <div className="text-sm text-gray-500">Offset {offset}</div>
        </div>

        {loading ? (
          <div className="p-4 text-sm text-gray-600">Loading employees…</div>
        ) : employees.length === 0 ? (
          <div className="p-4 text-sm text-gray-600">No employees found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr className="text-left">
                  <th className="px-4 py-3">Employee</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Department</th>
                  <th className="px-4 py-3">Position</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {employees.map((e) => (
                  <tr key={e.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={mediaUrl(e.photo_url)}
                          alt={`${e.first_name} ${e.last_name}`}
                          className="h-10 w-10 rounded-full border object-cover"
                        />
                        <div>
                          <div className="font-medium">
                            {e.first_name} {e.last_name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {e.id.slice(0, 8)}…
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-700">{e.email}</td>
                    <td className="px-4 py-3">{e.department?.name ?? "-"}</td>
                    <td className="px-4 py-3">{e.position?.title ?? "-"}</td>
                    <td className="px-4 py-3">
                      <Badge value={e.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <div className="border-t px-4 py-3 flex items-center gap-2">
          <Button
            variant="ghost"
            disabled={!canPrev() || loading}
            onClick={() => setOffset((o) => Math.max(0, o - limit))}
          >
            Prev
          </Button>
          <Button
            variant="ghost"
            disabled={!canNext() || loading}
            onClick={() => setOffset((o) => o + limit)}
          >
            Next
          </Button>
          <div className="ml-auto text-sm text-gray-500">
            Showing {employees.length} (limit {limit})
          </div>
        </div>
      </Card>
    </div>
  );
}
