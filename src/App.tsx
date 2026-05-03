import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/landing/Hero";
import HowItWorks from "./components/landing/HowItWorks";
import Features from "./components/landing/Features";
import WhyRailSetu from "./components/landing/WhyRailSetu";
import CTA from "./components/landing/CTA";
import Footer from "./components/Footer";
import SearchResults from "./pages/SearchResults";
import SmartRoute from "./pages/SmartRoute";
import { getStationsLocal, saveStationsLocal } from "./services/stationDB";
import type { Station } from "./utils/AppInterfaces";

const LandingPage = () => (
  <>
    <Navbar />
    <main>
      <Hero />
      <HowItWorks />
      <Features />
      <WhyRailSetu />
      <CTA />
    </main>
    <Footer />
  </>
);

const App: React.FC = () => {
  useEffect(() => {
    const syncStations = async () => {
      try {
        // 1. Check if stations exist in IndexedDB
        const localStations = await getStationsLocal()

        if (!localStations || localStations.length === 0) {
          console.log("Station cache empty. Fetching from backend...")
          
          // 2. Fetch from backend
          const response = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000"}/api/stations`)
          
          if (!response.ok) throw new Error("Failed to fetch stations")
          
          const rawData: [string, string][] = await response.json()

          // 3. Map the [code, name] format to the Station interface
          const mappedData: Station[] = rawData.map(([code, name]) => ({
            code,
            name
          }))

          // 4. Store in IndexedDB for future use
          await saveStationsLocal(mappedData)
          console.log(`Successfully cached ${mappedData.length} stations locally.`)
        } else {
          console.log(`Loaded ${localStations.length} stations from local cache.`)
        }
      } catch (error) {
        console.error("Failed to sync station data:", error)
      }
    }

    syncStations();
  }, [])

  return (
    <div className="min-h-screen bg-background text-foreground antialiased">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/smart-route" element={<SmartRoute />} />
      </Routes>
    </div>
  )
}

export default App
