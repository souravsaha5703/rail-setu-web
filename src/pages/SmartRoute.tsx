import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState } from '../store';
import { setCachedSmartRoutes } from '../store/searchSlice';
import type { SmartRouteResult } from '../store/searchSlice';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ArrowRight, ArrowLeft, Sparkles, Loader2, AlertCircle, Search, RefreshCw } from 'lucide-react';
import SmartRouteCard from '../components/SmartRouteCard';

export type { SmartRouteResult };

const formatWaitTime = (minutes: number) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m}m`;
};

const SmartRoute: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { from, to, date, smartRoutesCache } = useSelector((state: RootState) => state.search);
    const [routes, setRoutes] = useState<SmartRouteResult[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [progress, setProgress] = useState<string>("Initializing smart search...");
    const [visibleCount, setVisibleCount] = useState(10);
    const [forceRefreshCounter, setForceRefreshCounter] = useState(0);

    const handleRefresh = useCallback(() => {
        setForceRefreshCounter(prev => prev + 1);
    }, []);

    useEffect(() => {
        if (!from?.code || !to?.code) {
            setError("Please select source and destination stations.");
            setLoading(false);
            return;
        }

        let formattedDate = "";
        if (date) {
            const [year, month, day] = date.split('-');
            formattedDate = `${day}-${month}-${year}`;
        } else {
            const today = new Date();
            formattedDate = today.toLocaleDateString('en-GB').replace(/\//g, '-');
        }

        const cacheKey = `${from.code}_${to.code}_${formattedDate}`;

        // 1. Check if cached routes exist for this journey (and not a forced refresh)
        if (forceRefreshCounter === 0 && smartRoutesCache && smartRoutesCache[cacheKey]) {
            const cached = smartRoutesCache[cacheKey];
            setRoutes(cached);
            setLoading(false);
            setError(cached.length === 0 ? "No confirmed seat combinations found via junctions." : null);
            return;
        }

        let isSubscribed = true;
        let hasCompleted = false;
        setLoading(true);
        setError(null);
        setVisibleCount(10);
        setProgress("Connecting to Route-Breaker Engine...");

        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
        const url = `${apiUrl}/api/trains/smart-connect?sourceCode=${from.code}&destCode=${to.code}&date=${formattedDate}`;

        const eventSource = new EventSource(url);

        eventSource.onopen = () => {
            console.log("[SmartRoute SSE] Connection opened successfully to:", url);
        };

        const handleMessage = (event: MessageEvent) => {
            if (!isSubscribed) return;
            try {
                let result: any;
                try {
                    result = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
                } catch {
                    result = { message: event.data };
                }

                console.log(`[SmartRoute SSE received (${event.type})]:`, result);

                if (result.error) {
                    hasCompleted = true;
                    setError(result.error);
                    setLoading(false);
                    eventSource.close();
                    return;
                }

                const isDone =
                    event.type === "done" ||
                    event.type === "result" ||
                    event.type === "complete" ||
                    result.message === "Done!" ||
                    result.message?.toLowerCase?.() === "done" ||
                    result.message?.toLowerCase?.().includes("complete") ||
                    result.status === "completed" ||
                    result.status === "Done" ||
                    (result.data && Array.isArray(result.data)) ||
                    (result.response?.data && Array.isArray(result.response.data));

                if (isDone) {
                    hasCompleted = true;
                    const availabilityData = result.data || result.response?.data || (Array.isArray(result) ? result : null);

                    if (availabilityData && Array.isArray(availabilityData)) {
                        const generatedRoutes: SmartRouteResult[] = [];
                        let routeId = 1;

                        availabilityData.forEach((junctionOption: any) => {
                            const connections = junctionOption.successfulConnections || [];
                            const seenPairs = new Set<string>();

                            connections.forEach((conn: any) => {
                                const t1 = conn.leg1Train;
                                const t2 = conn.leg2Train;
                                const waitMinutes = conn.waitTimeMinutes;

                                if (!t1 || !t2) return;

                                const pairKey = `${t1.trainNumber}_${t2.trainNumber}_${junctionOption.stationCode}`;
                                if (seenPairs.has(pairKey)) return;

                                generatedRoutes.push({
                                    id: routeId++,
                                    junction: { name: junctionOption.stationName, code: junctionOption.stationCode },
                                    waitTime: formatWaitTime(waitMinutes),
                                    leg1: t1,
                                    leg2: t2,
                                    leg1DepartureDate: formattedDate,
                                    leg1ArrivalDate: conn.connectionDates?.leg1ArrivalDate || "",
                                    leg2DepartureDate: conn.connectionDates?.leg2DepartureDate || "",
                                    leg2ArrivalDate: conn.connectionDates?.leg2ArrivalDate || ""
                                });
                                seenPairs.add(pairKey);
                            });
                        });

                        setRoutes(generatedRoutes);
                        dispatch(setCachedSmartRoutes({ key: cacheKey, routes: generatedRoutes }));
                        if (generatedRoutes.length === 0) {
                            setError("No confirmed seat combinations found via junctions.");
                        }
                    } else {
                        setError("No smart routes found.");
                        dispatch(setCachedSmartRoutes({ key: cacheKey, routes: [] }));
                    }
                    setLoading(false);
                    eventSource.close();
                } else if (result.message) {
                    // Update the progress message shown to the user
                    setProgress(String(result.message));
                }
            } catch (err) {
                console.error("Error processing SSE data:", err);
            }
        };

        eventSource.onmessage = handleMessage;
        eventSource.addEventListener("progress", handleMessage as EventListener);
        eventSource.addEventListener("done", handleMessage as EventListener);
        eventSource.addEventListener("result", handleMessage as EventListener);
        eventSource.addEventListener("complete", handleMessage as EventListener);

        eventSource.onerror = (err) => {
            eventSource.close();
            // If the search already completed, the server closing the stream is expected and NOT an error!
            if (!isSubscribed || hasCompleted) return;

            console.error("EventSource failed:", err);
            setError("Connection to search engine lost. Please try again.");
            setLoading(false);
        };

        return () => {
            isSubscribed = false;
            hasCompleted = true;
            eventSource.close();
        };
    }, [from?.code, to?.code, date, forceRefreshCounter, smartRoutesCache, dispatch]);

    return (
        <div className="min-h-screen bg-card flex flex-col">
            <Navbar />

            <main className="flex-1 w-full max-w-4xl mx-auto px-4 pt-24 pb-8 sm:pt-28">
                {/* Navigation and Actions */}
                <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
                    <button
                        onClick={() => navigate('/search')}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground cursor-pointer transition-colors bg-accent/40 hover:bg-accent px-3.5 py-2 rounded-xl border border-border/50 shadow-xs"
                    >
                        <ArrowLeft size={14} />
                        Back to Direct Trains
                    </button>
                    <button
                        onClick={handleRefresh}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground cursor-pointer transition-colors bg-accent/40 hover:bg-accent px-3.5 py-2 rounded-xl border border-border/50 shadow-xs"
                        title="Re-run Route-Breaker search"
                    >
                        <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
                        <span>Refresh Routes</span>
                    </button>
                </div>

                <div className="mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center flex-wrap gap-3">
                        <span>{from?.name || "Select Source"}</span>
                        <ArrowRight className="text-primary hidden sm:block" />
                        <span className="text-muted-foreground text-sm sm:hidden">to</span>
                        <span>{to?.name || "Select Destination"}</span>
                    </h1>
                    <div className="flex items-center gap-2 mt-3">
                        <span className="bg-primary/10 px-3 py-1 rounded-full font-bold text-primary flex items-center gap-1.5 text-xs sm:text-sm border border-muted/20">
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

                <div className="flex flex-col gap-8 min-h-100">
                    {loading ? (
                        <div className="flex-1 flex flex-col items-center justify-center py-12">
                            <div className="relative">
                                <Loader2 className="w-12 h-12 text-primary animate-spin" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Sparkles size={16} className="text-primary/50" />
                                </div>
                            </div>
                            <h3 className="text-lg font-bold mt-4 text-foreground" aria-live="polite">{progress}</h3>
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
                                onClick={handleRefresh}
                                className="mt-6 px-6 py-2 bg-primary text-primary-foreground rounded-lg font-semibold text-sm hover:brightness-105 transition-all cursor-pointer"
                            >
                                Try Again
                            </button>
                        </div>
                    ) : routes.length > 0 ? (
                        <>
                            {routes.slice(0, visibleCount).map((route) => (
                                <div key={route.id} className="flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="mb-3 text-lg font-bold text-foreground flex items-center gap-2">
                                        <span className="w-2.5 h-2.5 rounded-full bg-primary shadow-sm shadow-primary/40"></span>
                                        Via {route.junction.name} <span className="text-muted-foreground text-sm">({route.junction.code})</span>
                                    </div>
                                    <SmartRouteCard route={route} />
                                </div>
                            ))}
                            {routes.length > visibleCount && (
                                <div className="flex justify-center mt-6">
                                    <button
                                        onClick={() => setVisibleCount(prev => prev + 10)}
                                        className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-bold text-sm hover:brightness-105 transition-all cursor-pointer"
                                    >
                                        View More Routes ({routes.length - visibleCount} remaining)
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center py-12 text-center">
                            <div className="w-16 h-16 bg-card rounded-full flex items-center justify-center mb-4">
                                <Search className="w-8 h-8 text-foreground" />
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