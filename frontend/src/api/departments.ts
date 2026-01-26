import { http } from "../lib/http";
import type { Department, DepartmentCreate } from "../types/domain";

export async function listDepartments(): Promise<Department[]> {
  const res = await http.get<Department[]>("/departments");
  return res.data;
}

export async function createDepartment(
  payload: DepartmentCreate,
): Promise<Department> {
  const res = await http.post<Department>("/departments", payload);
  return res.data;
}
