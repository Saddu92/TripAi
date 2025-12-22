"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import toast from "react-hot-toast";

export default function UserProfileMenu() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const user = useAuth();
  if (!user) return null;

  const email = user.email;
  if (!email) return null;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");

    setOpen(false);

    toast.success("Logged out successfully 👋");

    router.push("/");
  };

  return (
    <div className="relative">
      {/* Avatar Button */}
      <button
        onClick={() => setOpen(!open)}
        className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold"
      >
        {email.charAt(0).toUpperCase()}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border z-50">
          <div className="px-4 py-3 border-b text-sm text-gray-700 truncate">
            {email}
          </div>

          <Link
            href="/trips"
            className="block px-4 py-2 hover:bg-gray-100 text-sm"
            onClick={() => setOpen(false)}
          >
            My Trips
          </Link>

          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-red-600"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
