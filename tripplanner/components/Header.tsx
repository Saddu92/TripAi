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
    <header className="flex justify-between items-center px-6 py-4 border-b bg-white">
      <Link href="/" className="text-xl font-bold">
        AI Travel Buddy
      </Link>

      <div className="flex items-center gap-4">
        {!isLoggedIn && (
          <Link href="/login">
            <Button variant="outline">Login</Button>
          </Link>
        )}

        <UserProfileMenu />
      </div>
    </header>
  );
}
