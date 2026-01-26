import { NavLink, Outlet } from "react-router-dom";

const navItems = [
  { to: "/employees", label: "Employees" },
  { to: "/employees/new", label: "New Employee" },
  { to: "/departments", label: "Departments" },
  { to: "/positions", label: "Positions" },
];

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="flex min-h-screen">
        <aside className="w-64 border-r bg-white">
          <div className="border-b p-4">
            <div className="text-lg font-semibold">HR Lite</div>
            <div className="text-xs text-gray-500">Admin dashboard</div>
          </div>

          <nav className="p-2 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  [
                    "block rounded-lg px-3 py-2 text-sm transition",
                    isActive
                      ? "bg-gray-900 text-white"
                      : "hover:bg-gray-100 text-gray-700",
                  ].join(" ")
                }
                end
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <main className="flex-1">
          <header className="h-14 border-b bg-white flex items-center px-6">
            <div className="text-sm text-gray-600">Welcome 👋</div>
          </header>

          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
