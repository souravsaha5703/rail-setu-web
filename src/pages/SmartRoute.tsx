import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ArrowRight, Sparkles, Loader2, AlertCircle, Search } from 'lucide-react';
import SmartRouteCard from '../components/SmartRouteCard';
import type { TrainInfo } from '../components/TrainCard';

interface SmartRouteResult {
    id: number;
    junction: { name: string; code: string };
    waitTime: string;
    leg1: TrainInfo;
    leg2: TrainInfo;
}

// Helpers for time calculation
const parseTime = (timeStr: string) => {
    if (!timeStr) return 0;
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
};

const formatWaitTime = (minutes: number) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m}m`;
};

const SmartRoute: React.FC = () => {
    const { from, to, date } = useSelector((state: RootState) => state.search);
    const [routes, setRoutes] = useState<SmartRouteResult[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSmartRoutes = async () => {
            if (!from || !to) {
                setError("Please select source and destination stations.");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);

                let formattedDate = "";
                if (date) {
                    const [year, month, day] = date.split('-');
                    formattedDate = `${day}-${month}-${year}`;
                } else {
                    const today = new Date();
                    formattedDate = today.toLocaleDateString('en-GB').replace(/\//g, '-');
                }

                const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
                const response = await fetch(`${apiUrl}/api/trains/smart-connect?sourceCode=${from.code}&destCode=${to.code}&date=${formattedDate}`);
                
                if (!response.ok) {
                    throw new Error("Failed to fetch smart routes");
                }

                const result = await response.json();
                
                if (result.success && result.data) {
                    const generatedRoutes: SmartRouteResult[] = [];
                    let routeId = 1;

                    // Iterate through each junction recommendation
                    result.data.forEach((junctionOption: any) => {
                        const leg1Trains = junctionOption.leg1?.data?.data || [];
                        const leg2Trains = junctionOption.leg2?.data?.data || [];

                        // The backend already processed the optimal trains.
                        // We will pair them up and display all combinations.
                        // To avoid UI freezing, we only take the first few combinations per junction if there are many.
                        let pairsAdded = 0;

                        for (let i = 0; i < leg1Trains.length; i++) {
                            const t1 = leg1Trains[i];
                            const arrMin = parseTime(t1.arrival);
                            
                            for (let j = 0; j < leg2Trains.length; j++) {
                                // Limit to 10 combinations per junction so the UI is responsive
                                if (pairsAdded >= 10) break;
                                
                                const t2 = leg2Trains[j];
                                let depMin = parseTime(t2.departure);
                                
                                // Calculate layover time. If departure is less than arrival, assume it departs the next day.
                                let waitMinutes = depMin - arrMin;
                                if (waitMinutes < 0) {
                                    waitMinutes += 24 * 60;
                                }

                                generatedRoutes.push({
                                    id: routeId++,
                                    junction: { name: junctionOption.stationName, code: junctionOption.stationCode },
                                    waitTime: formatWaitTime(waitMinutes),
                                    leg1: t1,
                                    leg2: t2
                                });
                                
                                pairsAdded++;
                            }
                            if (pairsAdded >= 10) break;
                        }
                    });

                    setRoutes(generatedRoutes);
                } else {
                    setError(result.message || "No smart routes found.");
                }
            } catch (err) {
                console.error("Error fetching smart routes:", err);
                setError("Something went wrong while connecting to the smart routing engine.");
            } finally {
                setLoading(false);
            }
        };

        fetchSmartRoutes();
    }, [from, to, date]);
    
    return (
        <div className="min-h-screen bg-accent/20 flex flex-col">
            <Navbar />
            
            <main className="flex-1 w-full max-w-4xl mx-auto px-4 pt-24 pb-8 sm:pt-28">
                <div className="mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center flex-wrap gap-3">
                        <span>{from?.name || "Select Source"}</span>
                        <ArrowRight className="text-primary hidden sm:block" />
                        <span className="text-muted-foreground text-sm sm:hidden">to</span>
                        <span>{to?.name || "Select Destination"}</span>
                    </h1>
                    <div className="flex items-center gap-2 mt-3">
                        <span className="bg-primary/10 px-3 py-1 rounded-full font-bold text-primary flex items-center gap-1.5 text-xs sm:text-sm shadow-sm border border-primary/20">
                            <Sparkles size={14} />
                            Powered by Route-Breaker AI
                        </span>
                        {date && (
                            <span className="text-muted-foreground text-xs sm:text-sm font-medium">
                                • {new Date(date).toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short' })}
                            </span>
                        )}
                    </div>
                </div>

                <div className="flex flex-col gap-8 min-h-[400px]">
                    {loading ? (
                        <div className="flex-1 flex flex-col items-center justify-center py-12">
                            <div className="relative">
                                <Loader2 className="w-12 h-12 text-primary animate-spin" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Sparkles size={16} className="text-primary/50" />
                                </div>
                            </div>
                            <h3 className="text-lg font-bold mt-4 text-foreground">Analyzing Billions of Routes</h3>
                            <p className="text-muted-foreground text-sm">Finding the perfect multi-leg connections...</p>
                        </div>
                    ) : error ? (
                        <div className="flex-1 flex flex-col items-center justify-center py-12 text-center px-4">
                            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
                                <AlertCircle className="w-8 h-8 text-destructive" />
                            </div>
                            <h3 className="text-lg font-bold text-foreground">Couldn't find routes</h3>
                            <p className="text-muted-foreground text-sm max-w-md">{error}</p>
                            <button 
                                onClick={() => window.location.reload()}
                                className="mt-6 px-6 py-2 bg-primary text-primary-foreground rounded-lg font-semibold text-sm hover:brightness-105 transition-all"
                            >
                                Try Again
                            </button>
                        </div>
                    ) : routes.length > 0 ? (
                        routes.map((route) => (
                            <div key={route.id} className="flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="mb-3 text-lg font-bold text-foreground flex items-center gap-2">
                                    <span className="w-2.5 h-2.5 rounded-full bg-primary shadow-sm shadow-primary/40"></span>
                                    Via {route.junction.name} <span className="text-muted-foreground text-sm">({route.junction.code})</span>
                                </div>
                                <SmartRouteCard route={route} />
                            </div>
                        ))
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center py-12 text-center">
                            <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mb-4">
                                <Search className="w-8 h-8 text-muted-foreground" />
                            </div>
                            <h3 className="text-lg font-bold text-foreground">No Smart Routes Found</h3>
                            <p className="text-muted-foreground text-sm">We couldn't find any viable multi-leg connections for this journey.</p>
                        </div>
                    )}
                </div>
            </main>
            
            <Footer />
        </div>
    );
};

export default SmartRoute;
