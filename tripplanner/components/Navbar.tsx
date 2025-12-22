"use client";

import Link from "next/link";
import AvatarMenu from "./AvatarMenu";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

export default function Navbar() {
  const user = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-bold text-blue-600 tracking-tight"
        >
          ✈️ AI Travel Buddy
        </Link>

        {/* Right Section */}
        <div className="flex items-center gap-8">
          {/* Navigation */}
          <nav className="flex items-center gap-8 text-sm font-medium text-gray-600">
            <Link href="/planner" className="hover:text-blue-600">
              Plan Trip
            </Link>

            {user && (
              <Link href="/trips" className="hover:text-blue-600">
                My Trips
              </Link>
            )}

            {["admin", "super_admin"].includes(user?.role ?? "") && (
              <Link href="/admin/analytics" className="hover:text-blue-600">
                Admin
              </Link>
            )}
          </nav>

          {/* Auth Action */}
          {user ? (
            <AvatarMenu />
          ) : (
            <Link href="/login">
              <Button className="bg-blue-600 hover:bg-blue-700 rounded-full px-6">
                Login
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
