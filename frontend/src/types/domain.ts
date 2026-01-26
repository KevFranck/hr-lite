export type Department = {
  id: string;
  name: string;
  description?: string | null;
  created_at?: string;
  updated_at?: string;
};

export type Position = {
  id: string;
  title: string;
  created_at?: string;
  updated_at?: string;
};

export type Employee = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  status: "active" | "inactive" | string;
  photo_url: string;

  department: Department;
  position: Position;

  created_at: string;
  updated_at: string;
  hire_date?: string | null;
};

export type EmployeeListParams = {
  department_id?: string;
  position_id?: string;
  q?: string;
  limit?: number;
  offset?: number;
};

export type DepartmentCreate = {
  name: string;
  description?: string | null;
};

export type PositionCreate = {
  title: string;
};

export type EmployeeUpdate = Partial<{
  first_name: string;
  last_name: string;
  email: string;
  department_id: string;
  position_id: string;
  hire_date: string | null;
  status: "active" | "inactive";
}>;
