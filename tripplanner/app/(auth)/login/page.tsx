"use client";

import { useState } from "react";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PageTransition from "@/components/PageTransition";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:8000/auth/login",
        { email, password }
      );

      localStorage.setItem("token", response.data.access_token);
      
// localStorage.setItem("userEmail", email);

      router.push("/planner");
    } catch (err) {
      alert("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md">
          <h1 className="text-3xl font-bold text-center mb-6">
            Welcome Back!
          </h1>

          <p className="text-center text-gray-600 mb-6">
            Login to continue planning your trip
          </p>

          <div className="space-y-4">
            <Input
              type="email"
              placeholder="Enter your Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              type="password"
              placeholder="Enter your Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button
              className="w-full bg-blue-600 hover:bg-blue-700 py-5 text-lg"
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? "Logging in..." : "Log In"}
            </Button>
          </div>

          <div className="text-center mt-6 text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-blue-600 font-semibold">
              Create one
            </Link>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
