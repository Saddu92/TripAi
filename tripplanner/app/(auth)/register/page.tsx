"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import PageTransition from "@/components/PageTransition";
import GoogleLoginButton from "@/components/GoogleLogin";
import api from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    try {
      setLoading(true);
      await api.post("/auth/register", {
        email,
        password,
      });

      toast.success("Account created successfully");
      router.push("/login");
    } catch (err) {
      toast.error("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
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
              <h1 className="text-3xl font-bold mb-4">Welcome to AI Travel Buddy</h1>
              <p className="text-center max-w-sm">
                Create an account to start planning smarter.
              </p>
            </div>
          </div>

          {/* FORM */}
          <div className="flex flex-col justify-center p-10">
            <h1 className="text-3xl font-bold mb-2">Create Account</h1>
            <p className="text-gray-500 mb-8">
              Join us and start planning smarter
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
                onClick={handleSignup}
                disabled={loading}
              >
                {loading ? "Creating account..." : "Sign Up"}
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

            <div className="text-center mt-6 text-sm">
              Already have an account?{" "}
              <Link href="/login" className="text-blue-600 font-semibold">
                Log in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
