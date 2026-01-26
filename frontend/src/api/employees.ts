import { http } from "../lib/http";

import type {
  Employee,
  EmployeeListParams,
  EmployeeUpdate,
} from "../types/domain";

export async function listEmployees(
  params: EmployeeListParams,
): Promise<Employee[]> {
  const res = await http.get("/employees", { params });
  return res.data;
}

export async function getEmployee(id: string): Promise<Employee> {
  const res = await http.get(`/employees/${id}`);
  return res.data;
}

export async function createEmployee(formData: FormData): Promise<Employee> {
  const res = await http.post("/employees", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

// ✅ PATCH /employees/{employee_id}
export async function updateEmployee(
  id: string,
  payload: EmployeeUpdate,
): Promise<Employee> {
  const res = await http.patch(`/employees/${id}`, payload);
  return res.data;
}

// ✅ POST /employees/{employee_id}/photo
export async function updateEmployeePhoto(
  id: string,
  formData: FormData,
): Promise<Employee> {
  const res = await http.post(`/employees/${id}/photo`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}
