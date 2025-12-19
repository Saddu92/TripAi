"use client";

import { Home, Map, BarChart2, Settings } from "lucide-react";
import Link from "next/link";

export default function Sidebar() {
  const menu = [
    { label: "Dashboard", icon: <Home size={20} />, path: "/admin/analytics" },
    { label: "Users", icon: <Map size={20} />, path: "/admin/users" },
    { label: "Reports", icon: <BarChart2 size={20} />, path: "/admin/reports" },
    { label: "Settings", icon: <Settings size={20} />, path: "/admin/settings" },
  ];

  return (
    <aside className="h-screen w-64 bg-gray-900 text-gray-100 fixed left-0 top-0 p-6 flex flex-col">
      <h1 className="text-2xl font-bold mb-10">Admin Panel</h1>

      <nav className="flex flex-col gap-4">
        {menu.map((item) => (
          <Link
            key={item.label}
            href={item.path}
            className="flex items-center gap-3 text-lg hover:text-blue-400 transition"
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
