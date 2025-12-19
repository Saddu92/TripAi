"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import MapModal from "./MapModal";
export default function MapPreview({ data }: { data: any }){
    const [open,setOpen]=useState(false);
    return(
        <>
        {/* Preview Box */}
<div className="bg-white rounded-2xl shadow p-4 h-72 flex flex-col items-center justify-center text-center">
    <p className="text-gray-600 mb-4">Map Preview Placeholder</p>

    <Button className="bg-blue-600 " onClick={()=>setOpen(true)}>
        View Full Map
    </Button>
</div>
<MapModal open={open} onClose={() => setOpen(false)} places={data?.places || []} />
        </>
    )
}