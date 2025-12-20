"use client";

import { Home, Users, BarChart2, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const menu = [
    { label: "Dashboard", icon: Home, path: "/admin/analytics" },
    { label: "Users", icon: Users, path: "/admin/users" },
    { label: "Reports", icon: BarChart2, path: "/admin/reports" },
    { label: "Settings", icon: Settings, path: "/admin/settings" },
  ];

  return (
    <aside className="sticky top-6 h-[calc(100vh-3rem)] w-64 rounded-2xl bg-white shadow-lg border border-gray-100 flex flex-col">
      <div className="px-6 py-5 border-b">
        <h1 className="text-lg font-semibold">AI Travel Buddy</h1>
        <p className="text-xs text-gray-400 mt-1">Admin Dashboard</p>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {menu.map((item) => {
          const active = pathname === item.path;
          const Icon = item.icon;

          return (
            <Link
              key={item.label}
              href={item.path}
              className={`flex items-center gap-3 px-4 py-2 rounded-xl text-sm transition
                ${
                  active
                    ? "bg-blue-600 text-white shadow"
                    : "text-gray-600 hover:bg-gray-100"
                }
              `}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-6 py-4 text-xs text-gray-400">
        © {new Date().getFullYear()}
      </div>
    </aside>
  );
}
