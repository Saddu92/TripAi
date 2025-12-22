"use client";

import { useState } from "react";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import PageTransition from "@/components/PageTransition";
import Image from "next/image";
import GoogleLoginButton from "@/components/GoogleLogin";

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
      toast.success("Login Successfully!");
      router.push("/planner");
    } catch (err) {
      toast.error("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 px-4">
        <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2">

          {/* LEFT IMAGE */}
          <div className="hidden md:block relative">
            <Image
              src="/login.jpg"
              alt="Travel"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-white p-8">
              <h1 className="text-3xl font-bold mb-4">AI Travel Buddy</h1>
              <p className="text-center max-w-sm">
                Plan trips, manage budgets and explore destinations effortlessly.
              </p>
            </div>
          </div>

          {/* FORM */}
          <div className="flex flex-col justify-center p-10">
            <h2 className="text-3xl font-bold mb-2">Welcome Back 👋</h2>
            <p className="text-gray-500 mb-8">
              Login to continue planning your trip
            </p>

            <div className="space-y-5">
              <Input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 py-6 text-lg rounded-xl"
                onClick={handleLogin}
                disabled={loading}
              >
                {loading ? "Logging in..." : "Log In"}
              </Button>

              {/* Divider */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-sm text-gray-400">OR</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              {/* Google */}
              <GoogleLoginButton />
            </div>

            <div className="text-center mt-6 text-sm text-gray-600">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-blue-600 font-semibold">
                Create one
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
