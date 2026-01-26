import { createBrowserRouter } from "react-router-dom";
import AdminLayout from "./components/layout/AdminLayout";

import DepartmentsPage from "./features/departments/DepartmentsPage";
import EmployeesPage from "./features/employees/EmployeesPage";
import NewEmployeePage from "./features/employees/NewEmployeePage";
import PositionsPage from "./features/positions/PositionsPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AdminLayout />,
    children: [
      { index: true, element: <EmployeesPage /> },
      { path: "employees", element: <EmployeesPage /> },
      { path: "employees/new", element: <NewEmployeePage /> },
      { path: "departments", element: <DepartmentsPage /> },
      { path: "positions", element: <PositionsPage /> },
    ],
  },
]);
