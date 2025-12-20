"use client";

import { useState } from "react";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import PageTransition from "@/components/PageTransition";

export default function RegisterPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    try {
      setLoading(true);
      await axios.post("http://localhost:8000/auth/register", {
        email,
        password,
      });

      toast.success("Account created successfully");
      router.push("/login");
    } catch (err) {
       console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md">
          <h1 className="text-3xl font-bold text-center mb-6">
            Create Account
          </h1>

          <p className="text-center text-gray-600 mb-6">
            Join us and start planning smarter
          </p>

          <div className="space-y-4">
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
              className="w-full bg-blue-600 hover:bg-blue-700 py-5 text-lg"
              onClick={handleSignup}
              disabled={loading}
            >
              {loading ? "Creating account..." : "Sign Up"}
            </Button>
          </div>

          <div className="text-center mt-6 text-sm">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 font-semibold">
              Log in
            </Link>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
