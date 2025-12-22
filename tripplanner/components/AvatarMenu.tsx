"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, User, LogOut, Map, BarChart2 } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@/hooks/useAuth";

function AvatarMenu() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const user = useAuth();

  // If not logged in → don’t render avatar
  if (!user) return null;

  const email = user.email;
  const initial = email?.charAt(0).toUpperCase() || "U";

  const toggle = () => setOpen((prev) => !prev);

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
        onClick={toggle}
        className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 px-3 py-2 rounded-full transition"
      >
        <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
          {initial}
        </div>
        <ChevronDown size={18} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 bg-white shadow-xl border rounded-xl w-52 overflow-hidden z-50"
          >
            <div className="px-4 py-3 border-b text-sm text-gray-600 truncate">
              {email}
            </div>

            <Link
              href="/profile"
              className="menu-item"
              onClick={() => setOpen(false)}
            >
              <User size={18} />
              Profile
            </Link>

            <Link
              href="/trips"
              className="menu-item"
              onClick={() => setOpen(false)}
            >
              <Map size={18} />
              My Trips
            </Link>

            {user.role === "admin" && (
              <Link
                href="/admin/analytics"
                className="menu-item"
                onClick={() => setOpen(false)}
              >
                <BarChart2 size={18} />
                Admin Panel
              </Link>
            )}

            <button
              onClick={handleLogout}
              className="menu-item w-full text-left text-red-600 hover:text-red-700"
            >
              <LogOut size={18} />
              Logout
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default AvatarMenu;
