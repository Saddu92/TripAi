"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ChevronDown, User, LogOut, Map, BarChart2 } from "lucide-react";

function AvatarMenu() {
const [open,setOpen]= useState(false);

const toggle=()=>setOpen((prev)=>!prev);



  return (
    <div className="relative">
      {/* Avatar Button */}
      <button onClick={toggle} className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 px-3 py-2 rounded-full">
        <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
        S
        </div>
        <ChevronDown size={18} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 bg-white shadow-xl border rounded-lg w-48 overflow-hidden z-50"
          >
            <Link href="/profile" className="menu-item">
              <User size={18} />
              Profile
            </Link>

            <Link href="/trips" className="menu-item">
              <Map size={18} />
              My Trips
            </Link>

            <Link href="/admin/analytics" className="menu-item">
              <BarChart2 size={18} />
              Admin Panel
            </Link>

            <button className="menu-item w-full text-left text-red-600 hover:text-red-700">
              <LogOut size={18} />
              Logout
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default AvatarMenu
