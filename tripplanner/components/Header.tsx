"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import UserProfileMenu from "@/components/userProfileMenu";
import { Button } from "@/components/ui/button";

export default function Header() {
  const [mounted, setMounted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsLoggedIn(!!localStorage.getItem("token"));
  }, []);

  if (!mounted) return null; // prevent hydration mismatch

  return (
    <header className="bg-white/80 backdrop-blur-sm sticky top-0 z-40 border-b">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-2xl font-extrabold text-indigo-600">
            AI Travel Buddy
          </Link>
          <div className="hidden md:block text-sm text-gray-600">Plan smarter trips with AI</div>
        </div>

        <div className="flex items-center gap-4">
          <nav className="hidden md:flex gap-4">
            <Link href="/planner" className="text-sm text-gray-700 hover:text-indigo-600">Planner</Link>
            <Link href="/trips" className="text-sm text-gray-700 hover:text-indigo-600">Trips</Link>
            <Link href="/admin/analytics" className="text-sm text-gray-700 hover:text-indigo-600">Analytics</Link>
          </nav>

          {!isLoggedIn && (
            <Link href="/login">
              <Button variant="ghost">Log in</Button>
            </Link>
          )}

          <UserProfileMenu />
        </div>
      </div>
    </header>
  );
}
