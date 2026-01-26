import { http } from "../lib/http";
import type {
  Employee,
  EmployeeListParams,
  EmployeeUpdate,
} from "../types/domain";

export async function listEmployees(
  params?: EmployeeListParams,
): Promise<Employee[]> {
  const res = await http.get<Employee[]>("/employees", { params });
  return res.data;
}

export async function getEmployee(id: string): Promise<Employee> {
  const res = await http.get<Employee>(`/employees/${id}`);
  return res.data;
}

export async function createEmployee(form: FormData): Promise<Employee> {
  const res = await http.post<Employee>("/employees", form);
  return res.data;
}

export async function updateEmployee(
  id: string,
  payload: EmployeeUpdate,
): Promise<Employee> {
  const res = await http.patch<Employee>(`/employees/${id}`, payload);
  return res.data;
}

export async function updateEmployeePhoto(
  id: string,
  form: FormData,
): Promise<Employee> {
  const res = await http.post<Employee>(`/employees/${id}/photo`, form);
  return res.data;
}
