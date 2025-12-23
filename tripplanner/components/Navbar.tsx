"use client";

import Link from "next/link";
import AvatarMenu from "./AvatarMenu";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";

export default function Navbar() {
  const user = useAuth();
  const [mounted, setMounted] = useState(false);

  const adminRoles = ["admin", "super_admin"];

  useEffect(() => {
    setMounted(true);
  }, []);

  // ⛔ Prevent hydration mismatch
  if (!mounted) {
    return (
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            ✈️ AI Travel Buddy
          </Link>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-blue-600">
          ✈️ AI Travel Buddy
        </Link>

        {/* Right Section */}
        <div className="flex items-center gap-8">
          <nav className="flex items-center gap-8 text-sm font-medium text-gray-600">
            <Link href="/planner" className="hover:text-blue-600">
              Plan Trip
            </Link>

            {user && (
              <Link href="/trips" className="hover:text-blue-600">
                My Trips
              </Link>
            )}

            {adminRoles.includes(user?.role ?? "") && (
              <Link href="/admin/analytics" className="hover:text-blue-600">
                Admin
              </Link>
            )}
          </nav>

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
