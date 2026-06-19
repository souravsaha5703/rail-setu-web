import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import TrainCard from '../components/TrainCard';
import type { TrainInfo } from '../components/TrainCard';
import { Calendar as CalendarIcon, Loader2, AlertCircle, Search, Route as RouteIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SearchResults: React.FC = () => {
    const navigate = useNavigate();
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

    // Determine if we should show the Smart Connect rescue feature
    const hasAvailableSeats = trains.some(train => 
        train.classAvailability.some(c => 
            c.displayStatus.toUpperCase().includes("AVAILABLE") || 
            c.displayStatus.toUpperCase().includes("CURR_AV")
        )
    );
    const showSmartConnect = !loading && !error && (!hasAvailableSeats || trains.length === 0);

    // Default dates for the tabs based on selected date or today
    const baseDate = date ? new Date(date) : new Date();

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

                {/* Journey Date Info Bar */}
                <div className="bg-card border border-border rounded-xl shadow-sm mb-6 px-5 py-4 flex items-center justify-between bg-accent/10">
                    <div className="flex items-center gap-2.5">
                        <CalendarIcon size={18} className="text-primary" />
                        <span className="text-sm font-semibold text-foreground">
                            Journey Date: <span className="text-muted-foreground font-normal">{baseDate.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
                        </span>
                    </div>
                    <button 
                        onClick={() => navigate('/')}
                        className="text-xs font-bold text-primary hover:underline cursor-pointer"
                    >
                        Modify Search
                    </button>
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
                        <>
                            {trains.map((train, idx) => (
                                <TrainCard key={idx} train={train} />
                            ))}
                            
                            {/* Waitlist Trigger Button */}
                            {showSmartConnect && (
                                <div className="mt-4 flex flex-col items-center justify-center p-6 bg-primary/5 border border-primary/20 rounded-xl">
                                    <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2">No confirmed seats available?</h3>
                                    <p className="text-muted-foreground mb-4 text-center text-sm sm:text-base max-w-md">Our AI-powered Route-Breaker can find you a multi-leg journey with confirmed tickets.</p>
                                    <button 
                                        onClick={() => navigate('/smart-route')}
                                        className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:brightness-110 transition-all flex items-center gap-2"
                                    >
                                        <RouteIcon size={18} />
                                        Try RailSetu Smart Connect
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center py-12 text-center">
                            <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mb-4">
                                <Search className="w-8 h-8 text-muted-foreground" />
                            </div>
                            <h3 className="text-lg font-bold text-foreground">No Direct Trains Found</h3>
                            <p className="text-muted-foreground text-sm mb-6">We couldn't find any direct trains for the selected route and date.</p>
                            <button 
                                onClick={() => navigate('/smart-route')}
                                className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:brightness-110 transition-all flex items-center gap-2"
                            >
                                <RouteIcon size={18} />
                                Try RailSetu Smart Connect
                            </button>
                        </div>
                    )}
                </div>
            </main>
            
            <Footer />

            {/* Floating Action Button for Smart Connect */}
            {showSmartConnect && trains.length > 0 && (
                <div className="fixed bottom-6 right-6 z-40 hidden sm:block">
                    <button 
                        onClick={() => navigate('/smart-route')}
                        className="px-5 py-3 bg-primary text-primary-foreground rounded-full shadow-lg shadow-primary/30 font-bold hover:scale-105 transition-all flex items-center gap-2 animate-in fade-in slide-in-from-bottom-4 duration-500"
                    >
                        <RouteIcon size={18} />
                        No seats? Try Smart Connect
                    </button>
                </div>
            )}
        </div>
    );
};

export default SearchResults;
