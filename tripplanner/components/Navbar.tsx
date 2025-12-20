"use client";

import AvatarMenu from "./AvatarMenu";
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="bg-white/80 backdrop-blur border-b border-gray-100 px-6 py-4 flex justify-between items-center">
      <Link href="/" className="text-2xl font-semibold text-blue-600">
        AI Travel Buddy
      </Link>

      <nav className="hidden md:flex gap-8 text-sm font-medium text-gray-600">
        <Link href="/planner" className="hover:text-blue-600">
          Plan Trip
        </Link>
        <Link href="/trips" className="hover:text-blue-600">
          My Trips
        </Link>
        <Link href="/admin/analytics" className="hover:text-blue-600">
          Admin
        </Link>
      </nav>

      <AvatarMenu />
    </header>
  );
}
