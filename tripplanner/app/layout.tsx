import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/Navbar";
import { GoogleOAuthProvider } from "@react-oauth/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "AI Travel Buddy",
  icons: {
    icon: "/favicon.ico",   // or /icon.png
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* ✅ GOOGLE OAUTH PROVIDER MUST WRAP EVERYTHING */}
        <GoogleOAuthProvider
          clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}
        >
          <Navbar />

          <div className="page-wrap bg-gradient-to-b from-gray-50 to-white min-h-screen pb-16">
            <main className="w-full px-4 md:px-6">
              {children}
            </main>
          </div>

          <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
