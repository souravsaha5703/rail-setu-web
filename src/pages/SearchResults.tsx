import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import TrainCard from '../components/TrainCard';
import type { TrainInfo } from '../components/TrainCard';
import { Calendar as CalendarIcon, Loader2, AlertCircle, Search } from 'lucide-react';

const SearchResults: React.FC = () => {
    const { from, to, date } = useSelector((state: RootState) => state.search);
    const [trains, setTrains] = useState<TrainInfo[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTrains = async () => {
            if (!from?.code || !to?.code) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);
                
                // Format date as DD-MM-YYYY for the backend
                let formattedDate = "";
                if (date) {
                    const [year, month, day] = date.split('-');
                    formattedDate = `${day}-${month}-${year}`;
                } else {
                    const today = new Date();
                    formattedDate = today.toLocaleDateString('en-GB').replace(/\//g, '-');
                }

                const params = new URLSearchParams({
                    source: from.code,
                    destination: to.code,
                    date: formattedDate
                });

                const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
                // Updated endpoint to /api/trains/between
                const response = await fetch(`${apiUrl}/api/trains/between?${params.toString()}`);
                
                if (!response.ok) {
                    throw new Error(`Failed to fetch trains: ${response.statusText}`);
                }

                const result = await response.json();
                
                // Adjusted parsing based on user's provided response structure
                if (result.status === 200 && result.response && result.response.success) {
                    setTrains(result.response.data);
                } else if (result.status === 404 || (result.response && result.response.success === false)) {
                    setTrains([]);
                    if (result.status !== 404) {
                        setError(result.message || "No trains found");
                    }
                } else {
                    throw new Error(result.message || "Failed to load trains");
                }
            } catch (err) {
                console.error("Error fetching trains:", err);
                setError(err instanceof Error ? err.message : "An unexpected error occurred");
            } finally {
                setLoading(false);
            }
        };

        fetchTrains();
    }, [from, to, date]);

    // Default dates for the tabs based on selected date or today
    const baseDate = date ? new Date(date) : new Date();
    const dateTabs = Array.from({ length: 6 }).map((_, i) => {
        const d = new Date(baseDate);
        d.setDate(baseDate.getDate() + i);
        return {
            date: d,
            isSelected: i === 0
        };
    });

    return (
        <div className="min-h-screen bg-accent/20 flex flex-col">
            <Navbar />
            
            <main className="flex-1 w-full max-w-5xl mx-auto px-4 pt-24 pb-8 sm:pt-28">
                {/* Header Section */}
                <div className="mb-6">
                    <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                        {from?.name || "Select Source"} to {to?.name || "Select Destination"}
                    </h1>
                    <p className="text-muted-foreground mt-1 text-sm sm:text-base">
                        {loading ? "Searching for trains..." : `${trains.length} Trains found between ${from?.name || "Source"} (${from?.code || ""}) to ${to?.name || "Destination"} (${to?.code || ""})`}
                    </p>
                </div>

                {/* Dates & Filters Card */}
                <div className="bg-card border border-border rounded-xl shadow-sm mb-6 overflow-hidden">
                    {/* Date Tabs */}
                    <div className="flex border-b border-border overflow-x-auto scrollbar-hide">
                        {dateTabs.map((tab, idx) => (
                            <button 
                                key={idx} 
                                className={`flex-1 min-w-[100px] py-3 px-4 flex flex-col items-center justify-center border-r border-border last:border-r-0 hover:bg-accent transition-colors
                                ${tab.isSelected ? 'border-b-2 border-b-primary bg-primary/5' : ''}`}
                            >
                                <span className={`text-sm font-semibold ${tab.isSelected ? 'text-primary' : 'text-foreground'}`}>
                                    {tab.date.toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short' })}
                                </span>
                            </button>
                        ))}
                        <button className="px-5 py-3 flex items-center justify-center hover:bg-accent transition-colors">
                            <CalendarIcon size={20} className="text-muted-foreground" />
                        </button>
                    </div>

                    {/* Quick Filters */}
                    <div className="px-5 py-3 flex items-center gap-4 text-sm font-medium">
                        <span className="text-foreground font-semibold">Quick Filters</span>
                        <div className="flex-1"></div>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <div className="w-9 h-5 bg-accent border border-border rounded-full flex items-center px-0.5">
                                <div className="w-4 h-4 bg-background rounded-full shadow-sm"></div>
                            </div>
                            <span className="text-muted-foreground">Best Available</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <div className="w-9 h-5 bg-accent border border-border rounded-full flex items-center px-0.5">
                                <div className="w-4 h-4 bg-background rounded-full shadow-sm"></div>
                            </div>
                            <span className="text-muted-foreground">AC Only</span>
                        </label>
                    </div>
                </div>

                {/* Train List / States */}
                <div className="flex flex-col gap-5 min-h-[400px]">
                    {loading ? (
                        <div className="flex-1 flex flex-col items-center justify-center py-12">
                            <div className="relative">
                                <Loader2 className="w-12 h-12 text-primary animate-spin" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Search size={16} className="text-primary/50" />
                                </div>
                            </div>
                            <h3 className="text-lg font-bold mt-4 text-foreground">Searching Trains</h3>
                            <p className="text-muted-foreground text-sm">We're finding the best connections for your journey...</p>
                        </div>
                    ) : error ? (
                        <div className="flex-1 flex flex-col items-center justify-center py-12 text-center px-4">
                            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
                                <AlertCircle className="w-8 h-8 text-destructive" />
                            </div>
                            <h3 className="text-lg font-bold text-foreground">Something went wrong</h3>
                            <p className="text-muted-foreground text-sm max-w-md">{error}</p>
                            <button 
                                onClick={() => window.location.reload()}
                                className="mt-6 px-6 py-2 bg-primary text-primary-foreground rounded-lg font-semibold text-sm hover:brightness-105 transition-all"
                            >
                                Try Again
                            </button>
                        </div>
                    ) : trains.length > 0 ? (
                        trains.map((train, idx) => (
                            <TrainCard key={idx} train={train} />
                        ))
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center py-12 text-center">
                            <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mb-4">
                                <Search className="w-8 h-8 text-muted-foreground" />
                            </div>
                            <h3 className="text-lg font-bold text-foreground">No Trains Found</h3>
                            <p className="text-muted-foreground text-sm">We couldn't find any trains for the selected route and date.</p>
                        </div>
                    )}
                </div>
            </main>
            
            <Footer />
        </div>
    );
};

export default SearchResults;
