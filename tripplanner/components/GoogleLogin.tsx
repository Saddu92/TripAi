"use client";

import { GoogleLogin } from "@react-oauth/google";
import api from "@/lib/api";
import axios from "axios";
import toast from "react-hot-toast";

export default function GoogleLoginButton() {
  const handleSuccess = async (credentialResponse: any) => {
    try {
      const token = credentialResponse.credential;

      const res = await api.post(
        "/auth/google",
        { token }
      );

      localStorage.setItem("token", res.data.access_token);
      window.location.href = "/planner";
    } catch (err) {
      toast.error("Google login failed");
    }
  };

  return (
    <div className="flex justify-center">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => toast.error("Google Login Failed")}
      />
    </div>
  );
}
