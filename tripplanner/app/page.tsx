"use client"
import  Link from "next/link";
import React, { useState, useEffect } from "react";

interface FeatureProps {
  icon: string;
  title: string;
  desc: string;
}

const Feature: React.FC<FeatureProps> = ({ icon, title, desc }) => (
  <div className="group relative bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
    <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-3 text-gray-900">
      {title}
    </h3>
    <p className="text-gray-600 leading-relaxed">{desc}</p>
  </div>
);

function Home() {
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* High-Quality Background Image - Fixed Blur */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=95&w=2400&auto=format&fit=crop"
            alt="Travel destination"
            className="w-full h-full object-cover"
            style={{
              imageRendering: '-webkit-optimize-contrast',
              transform: `translateY(${scrollY * 0.3}px)`,
            }}
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>


        {/* Hero Content */}
        <div className={`relative z-10 text-center px-6 max-w-5xl mx-auto transition-all duration-1000 transform ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight text-white drop-shadow-2xl">
            Make Every Trip <br />
            <span className="text-blue-400">Unforgettable</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white mb-10 max-w-3xl mx-auto leading-relaxed drop-shadow-lg">
            Journeys planned by AI, inspired by you — personalized itineraries, 
            realistic budgets, and effortless booking.
          </p>
          
          <Link href="/planner" className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300" >
            Plan my trip
          </Link>
          
          <p className="mt-10 text-white/90 text-lg italic drop-shadow-lg">
            "Travel smarter — collect memories, not stress."
          </p>

          {/* <div className="flex justify-center gap-4 mt-8">
            <button className="w-12 h-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-full flex items-center justify-center transition-all duration-300">
              ←
            </button>
            <button className="w-12 h-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-full flex items-center justify-center transition-all duration-300">
              →
            </button>
          </div> */}
        </div>

        {/* Scroll Indicator */}
        {/* <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
          <div className="flex flex-col items-center text-white">
            <span className="text-sm mb-2">Scroll down</span>
            <div className="text-2xl">↓</div>
          </div>
        </div> */}
      </section>

      {/* FEATURES SECTION */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              Why Choose Us
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience seamless travel planning with our AI-powered platform
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Feature
              icon="🤖"
              title="AI-Powered Planning"
              desc="Advanced algorithms create personalized itineraries based on your preferences, budget, and travel style."
            />
            <Feature
              icon="💰"
              title="Smart Budgeting"
              desc="Realistic cost estimates and money-saving tips to make your dream trip affordable."
            />
            <Feature
              icon="⚡"
              title="Instant Booking"
              desc="Seamless integration with top travel platforms for one-click reservations."
            />
            <Feature
              icon="🗺️"
              title="Local Insights"
              desc="Discover hidden gems and authentic experiences recommended by locals and AI."
            />
            <Feature
              icon="📱"
              title="Mobile Ready"
              desc="Access your itinerary anywhere, anytime with our responsive mobile design."
            />
            <Feature
              icon="🛡️"
              title="Secure & Private"
              desc="Your travel data is encrypted and protected with enterprise-grade security."
            />
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;