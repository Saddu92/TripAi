"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export function useAdminGuard() {
  const router = useRouter();
  const user = useAuth();

  useEffect(() => {
    if (!user) {
      router.replace("/login");      // not logged in
    } else if (user.role !== "admin") {
      router.replace("/planner");    // logged in but not admin
    }
  }, [user, router]);
}
