"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import MapModal from "./MapModal";
export default function MapPreview({ data }: { data: any }){
    const [open,setOpen]=useState(false);
    return(
        <>
        {/* Preview Box */}
<div className="card-style rounded-2xl p-4 h-72 flex flex-col items-center justify-center text-center">
    <p className="text-muted-foreground mb-4">Map Preview</p>

    <Button className="btn-primary-soft" onClick={()=>setOpen(true)}>
        View Full Map
    </Button>
</div>
<MapModal open={open} onClose={() => setOpen(false)} places={data?.places || []} />
        </>
    )
}