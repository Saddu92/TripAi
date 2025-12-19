import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";


interface FeatureProps {
  icon: string;
  title: string;
  desc: string;
}

const Feature: React.FC<FeatureProps> = ({ icon, title, desc }) => (
  <div className="p-6 bg-white rounded-lg shadow-xl text-center border border-gray-100">
    <div className="text-4xl mb-3">{icon}</div>
    <h3 className="text-xl font-semibold mb-2 text-gray-800">{title}</h3>
    <p className="text-gray-600">{desc}</p>
  </div>
);
// --------------------------------------------------------------------------

function Home() {
  return (

    
    <div className="w-full">
      {/* HERO SECTION */}
      <section className="relative h-[80vh] w-full ">
        
      
        <Image
          src="/hero.jpg"
          alt="Travel background"
          fill
          className="object-cover brightness-[0.6]"
        />


        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4 z-10">
          
          <h1 className="text-6xl font-bold mb-4">
            Your Dream Trip, Planned By AI
          </h1>

          <p className="text-xl max-w-2xl mb-6">
            Personalized itineraries based on your budget and interests —
            generated in seconds.
          </p>
          
         
          <Link href="/planner" passHref>
            <Button size="lg" className="text-lg px-8 py-3 bg-blue-600 hover:bg-blue-700 mt-4">
              Start Planning Now 🗺️
            </Button>
          </Link>

        </div>
     
      </section>
      
      ---
      
      {/* FEATURES */}
    
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto py-16 px-4">
        <Feature icon="✈️" title="Smart Itineraries" desc="AI-optimized plans based on your preferences." />
        <Feature icon="💰" title="Budget-Friendly" desc="Get accurate cost breakdowns before booking." />
        <Feature icon="📶" title="Offline Access" desc="Use itineraries without internet connection." />
      </section>
    </div>
  );
}

export default Home;