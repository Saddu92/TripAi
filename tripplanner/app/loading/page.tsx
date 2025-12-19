"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

const messages = [
  "Finding best places to visit…",
  "Planning the most efficient route…",
  "Checking popular attractions…",
  "Optimizing schedule for your days…",
  "Almost there, finalizing your itinerary…",
];

export default function LoadingPage() {
    const [index, setIndex] = useState(0);
  
    useEffect(() => {
      const interval = setInterval(() => {
        setIndex((prev) => (prev + 1) % messages.length);
      }, 2000);
  
      return () => clearInterval(interval);
    }, []);

    return (
        <div className="h-screen w-full flex flex-col items-center justify-center bg-gray-50 text-center px-4">
          {/* Loader icon */}
          <Loader2 className="animate-spin text-blue-600" size={70} />
    
          {/* Status message */}
          <h2 className="text-2xl font-semibold mt-8">{messages[index]}</h2>
    
          <p className="text-gray-500 mt-3">
            We’re generating your perfect itinerary. Please wait…
          </p>
        </div>
      );
    }