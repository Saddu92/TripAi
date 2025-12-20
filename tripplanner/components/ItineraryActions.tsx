"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Share2, Download, Heart, Pencil, Copy } from "lucide-react";
import toast from "react-hot-toast";

export default function ItineraryActions() {
  const [showShare, setShowShare] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const [portalPos, setPortalPos] = useState<{ top: number; left: number } | null>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target as Node)) setShowShare(false);
    };
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please log in to save this itinerary");
        return;
      }

      const raw = localStorage.getItem("itinerary");
      if (!raw) {
        toast("No itinerary found to save", { icon: "ℹ️" });
        return;
      }

      const itinerary = JSON.parse(raw);

      await axios.post(
        "http://localhost:8000/itineraries/save",
        itinerary,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Itinerary saved successfully!");
    } catch (error: any) {
      console.error("Save itinerary failed", error);
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        toast.error("Session expired. Please log in again.");
      } else {
        toast.error("Failed to save itinerary. Try again later.");
      }
    }
  };

  async function resolveItinerary() {
    // Try localStorage first
    try {
      const raw = localStorage.getItem("itinerary");
      if (raw) return JSON.parse(raw);
    } catch (e) {
      // ignore
    }

    // Fallback: if on /trips/:id try fetching
    try {
      const path = window.location.pathname.split("/").filter(Boolean);
      const tripsIndex = path.indexOf("trips");
      if (tripsIndex !== -1 && path[tripsIndex + 1]) {
        const id = path[tripsIndex + 1];
        const res = await axios.get(`http://localhost:8000/itineraries/${id}`);
        return res.data;
      }
    } catch (e) {
      // ignore
    }

    return null;
  }

  const buildShareText = (itinerary: any) => {
    const dest = itinerary?.destination ?? "My trip";
    const dates = itinerary?.start_date && itinerary?.end_date ? `${itinerary.start_date} → ${itinerary.end_date}` : "";
    const url = window.location.href;
    return `${dest} ${dates}\nView itinerary: ${url}\nPlanned with AI Travel Buddy`;
  };

  const handleNativeShare = async () => {
    try {
      const itinerary = await resolveItinerary();
      const text = buildShareText(itinerary);
      if (navigator.share) {
        await navigator.share({ title: itinerary?.destination ?? "Itinerary", text, url: window.location.href });
        toast.success("Shared successfully");
      } else {
        // fallback to copy link
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard");
      }
    } catch (e) {
      console.error(e);
      toast.error("Sharing failed");
    }
    setShowShare(false);
  };

  const openShareWindow = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer,width=600,height=600");
    setShowShare(false);
  };

  const handleShareWhatsApp = async () => {
    const itinerary = await resolveItinerary();
    const text = encodeURIComponent(buildShareText(itinerary));
    openShareWindow(`https://wa.me/?text=${text}`);
  };

  const handleShareFacebook = () => {
    const url = encodeURIComponent(window.location.href);
    openShareWindow(`https://www.facebook.com/sharer/sharer.php?u=${url}`);
  };

  const handleShareTwitter = async () => {
    const itinerary = await resolveItinerary();
    const text = encodeURIComponent((itinerary?.destination ?? "My trip") + " - " + (itinerary?.start_date ?? ""));
    const url = encodeURIComponent(window.location.href);
    openShareWindow(`https://twitter.com/intent/tweet?text=${text}&url=${url}`);
  };

  const handleShareEmail = async () => {
    const itinerary = await resolveItinerary();
    const subject = encodeURIComponent(`Itinerary: ${itinerary?.destination ?? "Trip"}`);
    const body = encodeURIComponent(buildShareText(itinerary));
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
    setShowShare(false);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard");
    } catch (e) {
      console.error(e);
      toast.error("Failed to copy link");
    }
    setShowShare(false);
  };

  const handleDownload = async () => {
    try {
      const itinerary = await resolveItinerary();
      if (!itinerary) {
        toast.error("No itinerary data to download");
        return;
      }

      // Build printable HTML
      const html = buildPrintableHTML(itinerary);
      const w = window.open("", "_blank");
      if (!w) {
        toast.error("Unable to open print window");
        return;
      }
      w.document.write(html);
      w.document.close();
      // wait for images/styles to load
      setTimeout(() => {
        try {
          w.focus();
          w.print();
        } catch (e) {
          console.error(e);
          toast.error("Print failed");
        }
      }, 600);
    } catch (e) {
      console.error(e);
      toast.error("Failed to prepare download");
    }
  };

  const buildPrintableHTML = (itinerary: any) => {
    const title = itinerary.destination || "Itinerary";
    const dates = itinerary.start_date && itinerary.end_date ? `${itinerary.start_date} → ${itinerary.end_date}` : "";
    const days = Array.isArray(itinerary.days) ? itinerary.days : itinerary.days ?? [];

    const rows = days
      .map((d: any) => {
        const places = (d.places || []).map((p: any) => `<li><strong>${p.display_name}</strong> — ${p.category ?? ""}</li>`).join("\n");
        return `<h3>Day ${d.day}</h3><ul>${places}</ul>`;
      })
      .join("\n");

    return `<!doctype html><html><head><meta charset="utf-8"><title>${title}</title><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{font-family:Arial,Helvetica,sans-serif;padding:24px;color:#111}h1{font-size:26px}h3{margin-top:18px}ul{margin-left:18px}</style></head><body><h1>${title}</h1><p>${dates}</p>${rows}</body></html>`;
  };

  return (
    <div className="card-style p-3 flex flex-wrap gap-3 justify-end relative">
      <button onClick={handleSave} className="btn-primary flex gap-2 items-center px-4 py-2 rounded-lg">
        <Heart size={16} /> Save
      </button>

      <div ref={menuRef} className="relative">
        <Button
          variant="outline"
          onClick={() => {
            setShowShare((s) => !s);
            // compute portal position
            const b = btnRef.current?.getBoundingClientRect();
            if (b) setPortalPos({ top: b.bottom + 8, left: b.left });
          }}
          className="flex gap-2 items-center"
          ref={btnRef as any}
        >
          <Share2 size={16} /> Share
        </Button>

        {showShare && portalPos && createPortal(
          <div style={{ position: "fixed", top: portalPos.top, left: portalPos.left, zIndex: 9999 }}>
            <div className="w-48 bg-white border rounded-md shadow p-2">
              <button onClick={handleNativeShare} className="w-full text-left px-2 py-2 hover:bg-gray-50">Share (native)</button>
              <button onClick={handleShareWhatsApp} className="w-full text-left px-2 py-2 hover:bg-gray-50">WhatsApp</button>
              <button onClick={handleShareFacebook} className="w-full text-left px-2 py-2 hover:bg-gray-50">Facebook</button>
              <button onClick={handleShareTwitter} className="w-full text-left px-2 py-2 hover:bg-gray-50">Twitter</button>
              <button onClick={handleShareEmail} className="w-full text-left px-2 py-2 hover:bg-gray-50">Email</button>
              <button onClick={handleCopyLink} className="w-full text-left px-2 py-2 hover:bg-gray-50 flex items-center gap-2"><Copy size={14} /> Copy link</button>
            </div>
          </div>,
          document.body
        )}
      </div>

      <Button variant="outline" className="flex gap-2 items-center">
        <Pencil size={16} /> Edit
      </Button>

      <button onClick={handleDownload} className="btn-primary flex gap-2 items-center px-4 py-2 rounded-lg">
        <Download size={16} /> Download
      </button>
    </div>
  );
}
