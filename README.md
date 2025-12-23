<p align="center">
  <img src="./assets/ai-travel-buddy-logo.png" alt="AI Travel Buddy Logo" width="120"/>
</p>

<h1 align="center">🌍 AI Travel Buddy</h1>
<p align="center">
  AI-powered smart itinerary planner for personalized travel experiences.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/status-active-success" />
  <img src="https://img.shields.io/badge/license-MIT-blue" />
  <img src="https://img.shields.io/badge/frontend-Next.js-black" />
  <img src="https://img.shields.io/badge/backend-FastAPI-009688" />
  <img src="https://img.shields.io/badge/database-MongoDB-47A248" />
  <img src="https://img.shields.io/badge/AI-Gemini-blueviolet" />
</p>

---

## 📑 Table of Contents
- [🧭 About](#-about)
- [🌟 Why AI Travel Buddy?](#-why-ai-travel-buddy)
- [🔑 Key Features](#-key-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [⚙️ How It Works](#️-how-it-works)
- [⚙️ Installation & Setup](#️-installation--setup)
- [🚧 Future Enhancements](#-future-enhancements)
- [🤝 Contributing](#-contributing)
- [📜 License](#-license)

---

## 🧭 About
**AI Travel Buddy** is a smart AI-based travel itinerary planner that helps users plan trips effortlessly by generating **day-wise personalized itineraries** based on destination, travel dates, budget, and preferences.

Instead of manually searching multiple websites, users receive **AI-curated travel plans** with recommended attractions, best visiting times, and interactive maps.

---

## 🌟 Why AI Travel Buddy?
Planning a trip usually involves:
- Searching multiple blogs and apps  
- Manually managing time & budget  
- Guessing which places are worth visiting  

**AI Travel Buddy solves this by:**
- 🤖 Using AI to analyze user preferences  
- 🗺️ Automatically suggesting relevant attractions  
- 📅 Structuring trips into clear day-wise plans  
- 💡 Saving time and improving travel decisions  

---

## 🔑 Key Features
- 🧠 AI-powered itinerary generation (Gemini AI)
- 📅 Day-wise travel planning
- 📍 Smart attraction recommendations
- 🗺️ Interactive maps using OpenStreetMap & Leaflet
- 💾 Save & manage trips
- 📥 Download itineraries as CSV
- 🔐 JWT-based authentication
- 🧑‍💼 Admin dashboard with role-based access
- 📱 Fully responsive UI

---

## 🛠️ Tech Stack

### Frontend
- **Next.js (TypeScript)** – modern React framework  
- **Tailwind CSS + ShadCN UI** – clean & responsive UI  
- **Axios** – API communication  
- **Leaflet.js** – interactive maps  
- **JWT / LocalStorage** – auth handling  

### Backend
- **FastAPI (Python)** – high-performance backend  
- **MongoDB** – users & itineraries storage  
- **JWT Authentication** – secure access  
- **RBAC** – admin & user role management  

### AI & Services
- **Google Gemini AI** – itinerary generation  
- **OpenStreetMap** – maps & geolocation  

---

## ⚙️ How It Works
1. 🔐 User signs up or logs in  
2. 📝 User provides destination, dates, budget & preferences  
3. 📊 Backend calculates trip duration  
4. 🤖 Gemini AI generates places & best timings  
5. 🗓️ Backend structures a day-wise itinerary  
6. 🗺️ Frontend visualizes data with maps & cards  
7. 💾 Users can save or export the itinerary  

---

## ⚙️ Installation & Setup

### 1️⃣ Clone Repository
```bash
git clone https://github.com/your-username/ai-travel-buddy.git
cd ai-travel-buddy
