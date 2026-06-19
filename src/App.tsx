import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/landing/Hero";
import Footer from "./components/Footer";
import SearchResults from "./pages/SearchResults";
import SmartRoute from "./pages/SmartRoute";
import { getStationsLocal, saveStationsLocal } from "./services/stationDB";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import type { Station } from "./utils/AppInterfaces";

const LandingPage = () => (
  <>
    <Navbar />
    <main>
      <Hero />
    </main>
    <Footer />
  </>
);

const App: React.FC = () => {
  const [isDataReady, setIsDataReady] = useState(false);
  useEffect(() => {
    const syncStations = async () => {
      try {
        // 1. Check if stations exist in IndexedDB
        const localStations = await getStationsLocal()

        if (!localStations || localStations.length === 0) {
          console.log("Station cache empty. Fetching from backend...")

          // 2. Fetch from backend
          // const response = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000"}/api/stations`)

          const response = await fetch('/indian-railway-stations-2026-04-29.json');

          if (!response.ok) throw new Error("Failed to fetch stations")

          const rawData: [string, string][] = await response.json()

          // 3. Map the [code, name] format to the Station interface
          const mappedData: Station[] = rawData.map(([code, name]) => ({
            code,
            name
          }))

          // 4. Store in IndexedDB for future use
          await saveStationsLocal(mappedData);
          console.log(`Successfully cached ${mappedData.length} stations locally.`);
        } else {
          console.log(`Loaded ${localStations.length} stations from local cache.`);
        }
      } catch (error) {
        console.error("Failed to sync station data:", error)
      }
      finally {
        setIsDataReady(true);
      }
    }

    syncStations();
  }, []);

  if (!isDataReady) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <DotLottieReact
          src="https://lottie.host/39bf089a-c3a8-4a58-a3ae-844821e14310/ktxpuDyfks.lottie"
          loop
          autoplay
          style={{ width: 250, height: 250 }}
        />
      </div>
    );
  }

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

export default App;