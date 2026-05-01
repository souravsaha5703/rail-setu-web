import React from 'react';
import { Star, UtensilsCrossed, Utensils, ShieldCheck, ShieldAlert, ArrowRight, Clock } from 'lucide-react';
import TrainScheduleDrawer from './TrainScheduleDrawer';

export interface ClassAvailability {
    class: string;
    availability: string;
    fare: string;
    prediction: string;
    displayStatus: string;
    predictionPercent: number;
    quota: string;
}

export interface TrainInfo {
    trainNumber: string;
    trainName: string;
    from: {
        code: string;
        name: string;
    };
    to: {
        code: string;
        name: string;
    };
    departure: string;
    arrival: string;
    duration: string;
    distanceKm: number;
    pantry: string;
    rating: number;
    runningDays: string;
    allClasses: string[];
    classAvailability: ClassAvailability[];
}

interface TrainCardProps {
    train: TrainInfo;
}

const getStatusColor = (percent: number, status: string) => {
    const isAvailable = status.toUpperCase().includes('AVAILABLE') || status.toUpperCase().includes('CURR_AV');

    // Green for available or high chance
    if (isAvailable || percent >= 75) return {
        wrapper: "bg-linear-to-br from-emerald-500/10 to-emerald-500/5 border-emerald-500/20 hover:border-emerald-500/40 hover:shadow-emerald-500/10",
        badge: "text-emerald-700 dark:text-emerald-500",
        icon: <ShieldCheck size={16} className="text-emerald-600 dark:text-emerald-500" />
    };
    // Darker Amber for medium chance for better readability
    if (percent >= 40) return {
        wrapper: "bg-linear-to-br from-amber-600/10 to-amber-600/5 border-amber-600/30 hover:border-amber-600/50 hover:shadow-amber-600/10",
        badge: "text-amber-700 dark:text-amber-500",
        icon: <ShieldAlert size={16} className="text-amber-600 dark:text-amber-500" />
    };
    // Red for low chance
    return {
        wrapper: "bg-linear-to-br from-rose-500/10 to-rose-500/5 border-rose-500/20 hover:border-rose-500/40 hover:shadow-rose-500/10",
        badge: "text-rose-700 dark:text-rose-500",
        icon: <ShieldAlert size={16} className="text-rose-600 dark:text-rose-500" />
    };
};

const TrainCard: React.FC<TrainCardProps> = ({ train }) => {
    return (
        <div className="w-full bg-card border border-border/60 hover:border-primary/30 rounded-xl p-4 sm:p-5 shadow-sm hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 group">
            {/* Header: Train Info & Rating */}
            <div className="flex justify-between items-start gap-3">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="rounded-md text-foreground font-semibold text-sm tracking-wider">
                            {train.trainNumber}
                        </span>
                        <h3 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
                            {train.trainName}
                        </h3>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
                        <Clock size={12} />
                        Runs: {train.runningDays}
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 sm:gap-3 shrink-0">
                    <div className="flex items-center gap-1 border border-border bg-accent/50 rounded-full px-2 py-0.5 text-xs font-bold shadow-sm">
                        <Star size={13} className="fill-amber-600 text-amber-600" />
                        <span className="text-foreground">{train.rating}</span>
                    </div>
                    {train.pantry.toLowerCase() === 'no' ? (
                        <div className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground bg-accent/50 rounded-full px-2 py-0.5">
                            <UtensilsCrossed size={12} strokeWidth={2} className="opacity-60" />
                            <span className="hidden sm:inline">No Pantry</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-1 text-[11px] font-medium text-primary bg-primary/5 border border-primary/10 rounded-full px-2 py-0.5">
                            <Utensils size={12} strokeWidth={2} />
                            <span className="hidden sm:inline">Pantry</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Schedule Info */}
            <div className="flex items-center justify-between mt-4 bg-accent/30 rounded-lg p-3 sm:p-4 border border-border/50">
                <div className="flex flex-1 items-center gap-3 sm:gap-5 justify-between sm:justify-start">
                    <div className="flex flex-col">
                        <span className="text-xl sm:text-2xl font-semibold text-foreground">
                            {train.departure}
                        </span>
                        <span className="text-muted-foreground font-semibold text-[11px] sm:text-xs mt-0.5">
                            {train.from.name} <span className="text-foreground">{train.from.code}</span>
                        </span>
                    </div>

                    <div className="flex flex-col items-center px-3 sm:px-6 flex-1 sm:flex-none">
                        <span className="text-[10px] sm:text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">
                            {train.duration}
                        </span>
                        <div className="flex items-center w-full min-w-[50px] sm:w-24 relative">
                            <div className="absolute left-0 w-1.5 h-1.5 rounded-full bg-primary/50" />
                            <div className="h-[2px] w-full bg-linear-to-r from-primary/30 via-primary/50 to-primary/30" />
                            <div className="absolute right-0 w-1.5 h-1.5 rounded-full bg-primary/50" />
                            <ArrowRight size={12} className="absolute right-0 text-primary translate-x-1/2 bg-card rounded-full" strokeWidth={3} />
                        </div>
                        <span className="text-[9px] sm:text-[10px] font-medium text-muted-foreground mt-1.5">
                            {train.distanceKm} km
                        </span>
                    </div>

                    <div className="flex flex-col text-right sm:text-left">
                        <span className="text-xl sm:text-2xl font-semibold text-foreground">
                            {train.arrival}
                        </span>
                        <span className="text-muted-foreground font-semibold text-[11px] sm:text-xs mt-0.5">
                            {train.to.name} <span className="text-foreground">{train.to.code}</span>
                        </span>
                    </div>
                </div>
                <TrainScheduleDrawer train={train}>
                    <button className="hidden sm:block text-[11px] sm:text-xs font-bold text-primary hover:text-primary/80 transition-colors bg-primary/10 hover:bg-primary/20 px-3 py-1.5 rounded-md">
                        Schedule
                    </button>
                </TrainScheduleDrawer>
            </div>

            {/* Class Availability List */}
            <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-bold text-foreground">Availability Status</h4>
                </div>
                <div className="flex gap-2.5 overflow-x-auto pb-3 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    {train.classAvailability.map((cls, idx) => {
                        const colors = getStatusColor(cls.predictionPercent, cls.displayStatus);
                        const isWaitlist = cls.displayStatus.toUpperCase().includes('WL');
                        const isAvailable = cls.displayStatus.toUpperCase().includes('AVAILABLE') || cls.displayStatus.toUpperCase().includes('CURR_AV');

                        const minsAgo = (idx * 15) + 5;

                        return (
                            <div key={idx} className="flex flex-col gap-1 min-w-[140px] sm:min-w-[140px] shrink-0">
                                {/* Time ago placeholder */}
                                <span className="text-[9px] text-muted-foreground px-1 font-semibold uppercase tracking-wider flex items-center gap-1">
                                    <Clock size={10} />
                                    Updated {minsAgo}m ago
                                </span>

                                <div className={`rounded-xl border p-4 flex flex-col shadow-sm cursor-pointer transition-all duration-300 hover:-translate-y-1 ${colors.wrapper}`}>
                                    {/* Prediction Banner */}
                                    <div className={`text-xs font-semibold mb-2 ${colors.badge}`}>
                                        {cls.prediction}
                                    </div>

                                    {/* Class & Fare */}
                                    <div className="flex justify-between items-center mb-1.5">
                                        <span className="text-lg font-bold text-foreground">{cls.class}</span>
                                        <span className="text-sm font-bold text-foreground">₹{cls.fare}</span>
                                    </div>

                                    {/* Status */}
                                    <div className={`text-base font-bold flex items-center gap-1 ${colors.badge}`}>
                                        {cls.displayStatus} {colors.icon}
                                    </div>

                                    {/* Sub Status */}
                                    <div className="text-[10px] font-semibold mt-1 text-foreground/60 uppercase tracking-widest">
                                        {isWaitlist ? "Waitlist" : isAvailable ? "Available" : "RAC"}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default TrainCard;
