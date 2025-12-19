"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import PageTransition from "@/components/PageTransition";
import DayAccordion from "@/components/DayAccordion";
import api from "@/lib/api";


function TripDetailPage() {

    const {id}= useParams();
    const [trip,setTrip]=useState<any>(null);

    useEffect(()=>{
        const fetchTrip=async()=>{
            const response= await api.get(`/itineraries/${id}`);

            setTrip(response.data);

        };

        fetchTrip();
    },[id])

    if(!trip) return <p className="text-center mt-10">Loading...</p>;
  return (
    <PageTransition>
      <div className="max-w-3xl mx-auto py-6">
        <h1 className="text-4xl font-bold">{trip.destination}</h1>
        <p className="text-gray-600 text-lg">
          {trip.start_date} → {trip.end_date}
        </p>

        <div className="mt-6 space-y-4">
          {trip.days?.map((day: any) => (
            <DayAccordion key={day.day} day={day} />
          ))}
        </div>
      </div>
    </PageTransition>
  )
}

export default TripDetailPage
