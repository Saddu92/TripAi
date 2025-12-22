"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import {
  Share2,
  Download,
  Heart,
  Pencil,
  Mail,
  Twitter,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import toast from "react-hot-toast";
import api from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";

export default function ItineraryActions() {
  const [showShare, setShowShare] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const btnRef = useRef<HTMLButtonElement | null>(null);

  const [portalPos, setPortalPos] = useState<{ top: number; left: number } | null>(null);

  /* -----------------------------
     Close on outside click
  ----------------------------- */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      if (btnRef.current?.contains(target)) return;
      if (menuRef.current && !menuRef.current.contains(target)) {
        setShowShare(false);
      }
    };

    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  /* -----------------------------
     Resolve itinerary
  ----------------------------- */
  const resolveItinerary = async () => {
    if (typeof window === "undefined") return null;

    const path = window.location.pathname.split("/").filter(Boolean);
    const tripsIndex = path.indexOf("trips");

    if (tripsIndex !== -1 && path[tripsIndex + 1]) {
      try {
        const res = await api.get(`/itineraries/${path[tripsIndex + 1]}`);
        return res.data;
      } catch {
        toast.error("Failed to load itinerary");
        return null;
      }
    }

    try {
      const raw = localStorage.getItem("itinerary");
      if (raw) return JSON.parse(raw);
    } catch {}

    return null;
  };

  /* -----------------------------
     Save
  ----------------------------- */
  const handleSave = async () => {
    const itinerary = await resolveItinerary();
    if (!itinerary) return toast.error("No itinerary found");

    try {
      await api.post("/itineraries/save", itinerary);
      toast.success("Itinerary saved");
    } catch {
      toast.error("Save failed");
    }
  };

  /* -----------------------------
     Download PDF
  ----------------------------- */
  const handleDownloadPDF = async () => {
    const itinerary = await resolveItinerary();
    if (!itinerary) return toast.error("No itinerary found");

    const html = buildPrintableHTML(itinerary);
    const win = window.open("", "_blank");
    if (!win) return toast.error("Popup blocked");

    win.document.write(html);
    win.document.close();

    setTimeout(() => {
      win.print();
      win.close();
    }, 700);
  };

  /* -----------------------------
     Share helpers
  ----------------------------- */
  const buildShareText = (itinerary: any) => {
    const dest = itinerary.destination;
    const dates = `${itinerary.start_date} → ${itinerary.end_date}`;
    return `${dest}\n${dates}\n${window.location.href}`;
  };

  const openShare = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer,width=600,height=600");
    setShowShare(false);
  };

  const handleShare = async (type: "whatsapp" | "twitter" | "email") => {
    const itinerary = await resolveItinerary();
    if (!itinerary) return;

    const text = encodeURIComponent(buildShareText(itinerary));
    const url = encodeURIComponent(window.location.href);

    if (type === "whatsapp") {
      openShare(`https://wa.me/?text=${text}`);
    }

    if (type === "twitter") {
      openShare(`https://twitter.com/intent/tweet?text=${text}`);
    }

    if (type === "email") {
      window.location.href = `mailto:?subject=${encodeURIComponent(
        itinerary.destination
      )}&body=${text}`;
      setShowShare(false);
    }
  };

  /* -----------------------------
     Printable HTML
  ----------------------------- */
  const buildPrintableHTML = (itinerary: any) => {
    const days = itinerary.days || [];
    return `
<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<title>${itinerary.destination}</title>
<style>
body { font-family: Arial; }
h3 { background:#f3f4f6;padding:6px;border-radius:6px }
</style>
</head>
<body>
<h1>${itinerary.destination}</h1>
<p>${itinerary.start_date} → ${itinerary.end_date}</p>
${days
  .map(
    (d: any) => `
<h3>Day ${d.day}</h3>
<ul>
${(d.places || []).map((p: any) => `<li>${p.display_name}</li>`).join("")}
</ul>`
  )
  .join("")}
</body>
</html>`;
  };

  /* -----------------------------
     UI
  ----------------------------- */
  return (
    <div className="flex flex-wrap items-center gap-3 justify-end">
      <button
        onClick={handleSave}
        className="inline-flex items-center gap-2 rounded-lg bg-pink-600 px-4 py-2 text-sm text-white hover:bg-pink-700"
      >
        <Heart size={15} /> Save
      </button>

      <Button
        ref={btnRef as any}
        variant="outline"
        onClick={(e) => {
          e.stopPropagation();
          const rect = btnRef.current?.getBoundingClientRect();
          if (rect) {
            setPortalPos({
              top: rect.bottom + 8,
              left: Math.min(rect.left, window.innerWidth - 220),
            });
          }
          setShowShare((s) => !s);
        }}
      >
        <Share2 size={16} /> Share
      </Button>

      {portalPos &&
        createPortal(
          <AnimatePresence>
            {showShare && (
              <motion.div
                ref={menuRef}
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                style={{
                  position: "fixed",
                  top: portalPos.top,
                  left: portalPos.left,
                  zIndex: 9999,
                }}
                className="w-56 rounded-lg border bg-white shadow-lg p-2"
                onClick={(e) => e.stopPropagation()}
              >
                <ShareItem icon={<FaWhatsapp />} label="WhatsApp" onClick={() => handleShare("whatsapp")} />
                <ShareItem icon={<Twitter size={16} />} label="Twitter" onClick={() => handleShare("twitter")} />
                <ShareItem icon={<Mail size={16} />} label="Email" onClick={() => handleShare("email")} />
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}

      <Button variant="outline">
        <Pencil size={16} /> Edit
      </Button>

      <button
        onClick={handleDownloadPDF}
        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2 text-sm text-white hover:bg-blue-700"
      >
        <Download size={16} /> Download PDF
      </button>
    </div>
  );
}

/* -----------------------------
   Share Item
----------------------------- */
function ShareItem({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-gray-100"
    >
      <span className="text-lg">{icon}</span>
      {label}
    </button>
  );
}
