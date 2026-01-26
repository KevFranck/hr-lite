import { http } from "./http";

export type Department = {
  id: string;
  name: string;
  description?: string | null;
};

export type Position = {
  id: string;
  title: string;
};

export type Employee = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  status: string;
  photo_url: string;
  department: Department;
  position: Position;
  created_at: string;
  updated_at: string;
  hire_date?: string | null;
};

export const api = {
  // Departments
  listDepartments: async () =>
    (await http.get<Department[]>("/departments")).data,
  createDepartment: async (payload: {
    name: string;
    description?: string | null;
  }) => (await http.post<Department>("/departments", payload)).data,

  // Positions
  listPositions: async () => (await http.get<Position[]>("/positions")).data,
  createPosition: async (payload: { title: string }) =>
    (await http.post<Position>("/positions", payload)).data,

  // Employees
  listEmployees: async (params?: {
    department_id?: string;
    position_id?: string;
    q?: string;
    limit?: number;
    offset?: number;
  }) => (await http.get<Employee[]>("/employees", { params })).data,

  getEmployee: async (id: string) =>
    (await http.get<Employee>(`/employees/${id}`)).data,

  createEmployee: async (form: FormData) =>
    (await http.post<Employee>("/employees", form)).data,

  updateEmployee: async (id: string, payload: any) =>
    (await http.patch<Employee>(`/employees/${id}`, payload)).data,

  updateEmployeePhoto: async (id: string, form: FormData) =>
    (await http.post<Employee>(`/employees/${id}/photo`, form)).data,
};

export function mediaUrl(photoUrl: string) {
  // photoUrl: "/media/employees/xxx.jpg"
  return `${import.meta.env.VITE_API_BASE_URL}${photoUrl}`;
}
