"use client";

import { Home, Map, BarChart2, Settings } from "lucide-react";
import Link from "next/link";

export default function Sidebar() {
  const menu = [
    { label: "Dashboard", icon: <Home size={18} />, path: "/admin/analytics" },
    { label: "Users", icon: <Map size={18} />, path: "/admin/users" },
    { label: "Reports", icon: <BarChart2 size={18} />, path: "/admin/reports" },
    { label: "Settings", icon: <Settings size={18} />, path: "/admin/settings" },
  ];

  return (
    <aside className="card-style h-[calc(100vh-2rem)] w-64 fixed left-6 top-6 p-4 flex flex-col">
      <div className="px-3 py-2">
        <h1 className="text-lg font-semibold">AI Travel Buddy</h1>
        <div className="text-xs text-muted-foreground mt-1">Your smart itinerary planner</div>
      </div>

      <nav className="flex flex-col gap-2 mt-6 px-2">
        {menu.map((item) => (
          <Link
            key={item.label}
            href={item.path}
            className="flex items-center gap-3 text-sm px-3 py-2 rounded-md hover:bg-gray-100 transition"
          >
            <span className="text-gray-600">{item.icon}</span>
            <span className="text-gray-800">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="mt-auto px-3 py-4 text-sm text-muted-foreground">
        © {new Date().getFullYear()} AI Travel
      </div>
    </aside>
  );
}
