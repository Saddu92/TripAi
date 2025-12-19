"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export function useAdminGuard() {
  const router = useRouter();
  const user = useAuth();

  useEffect(() => {
    if (!user) {
      router.replace("/login");
      return;
    }

    // ✅ Allow BOTH admin & super_admin
    if (!user.role || !["admin", "super_admin"].includes(user.role)) {
      router.replace("/planner");
    }
  }, [user, router]);
}
