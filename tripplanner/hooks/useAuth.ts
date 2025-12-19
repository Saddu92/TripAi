"use client";

import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  sub: string;
  email: string;
  role?: "admin" |"user";
  exp: number;
}

export function useAuth() {
  if (typeof window === "undefined") return null;

  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const decoded = jwtDecode<DecodedToken>(token);
    return decoded;
  } catch {
    return null;
  }
}
