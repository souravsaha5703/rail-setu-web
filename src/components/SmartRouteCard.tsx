import React from 'react';
import { ArrowRight, Clock, TrainFront } from 'lucide-react';
import type { TrainInfo, ClassAvailability } from './TrainCard';

interface SmartRouteCardProps {
    route: {
        id: number;
        junction: { name: string; code: string };
        waitTime: string;
        leg1: TrainInfo;
        leg2: TrainInfo;
    }
}

const getStatusColor = (percent: number, status: string) => {
    const isAvailable = status.toUpperCase().includes('AVAILABLE') || status.toUpperCase().includes('CURR_AV');
    if (isAvailable || percent >= 75) return {
        wrapper: "bg-linear-to-br from-emerald-500/10 to-emerald-500/5 border-emerald-500/20",
        badge: "text-emerald-700 dark:text-emerald-500"
    };
    if (percent >= 40) return {
        wrapper: "bg-linear-to-br from-amber-600/10 to-amber-600/5 border-amber-600/30",
        badge: "text-amber-700 dark:text-amber-500"
    };
    return {
        wrapper: "bg-linear-to-br from-rose-500/10 to-rose-500/5 border-rose-500/20",
        badge: "text-rose-700 dark:text-rose-500"
    };
};

const ClassBox: React.FC<{ cls: ClassAvailability }> = ({ cls }) => {
    const colors = getStatusColor(cls.predictionPercent, cls.displayStatus);
    
    return (
        <div className={`flex flex-col p-2 rounded-lg border ${colors.wrapper} min-w-[100px] shrink-0`}>
            <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-foreground text-sm">{cls.class}</span>
                <span className={`text-xs font-bold px-1.5 py-0.5 rounded-md bg-background ${colors.badge}`}>
                    {cls.displayStatus}
                </span>
            </div>
            <div className="flex justify-between items-end mt-1">
                <span className="font-bold text-foreground">₹{cls.fare}</span>
                {cls.predictionPercent > 0 && !cls.displayStatus.toUpperCase().includes('AVL') && (
                    <span className="text-[10px] font-semibold text-muted-foreground">{cls.predictionPercent}%</span>
                )}
            </div>
        </div>
    );
};

const LegDisplay: React.FC<{ leg: TrainInfo; isFirst: boolean }> = ({ leg, isFirst }) => {
    return (
        <div className={`p-4 sm:p-5 flex flex-col gap-4 relative ${isFirst ? 'bg-card' : 'bg-primary/5 dark:bg-primary/10'}`}>
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center z-10">
                <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2 bg-background ${isFirst ? 'border-emerald-500' : 'border-blue-500'}`}>
                        <TrainFront size={20} className={isFirst ? "text-emerald-500" : "text-blue-500"} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h4 className="font-bold text-foreground">{leg.trainNumber}</h4>
                            <span className="text-sm text-muted-foreground font-medium line-clamp-1">{leg.trainName}</span>
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5">{leg.runningDays}</div>
                    </div>
                </div>

                <div className="flex items-center justify-between w-full sm:w-auto gap-4 sm:gap-8">
                    <div className="text-left sm:text-right">
                        <div className="text-lg font-bold text-foreground">{leg.departure}</div>
                        <div className="text-xs text-muted-foreground font-medium">{leg.from.code}</div>
                    </div>
                    
                    <div className="flex flex-col items-center min-w-[60px] sm:min-w-[80px]">
                        <span className="text-[10px] text-muted-foreground font-medium mb-1">{leg.duration}</span>
                        <div className="w-full h-[2px] bg-border relative">
                            <ArrowRight size={12} className="absolute right-0 top-1/2 -translate-y-1/2 text-border translate-x-1/2 bg-card rounded-full" />
                        </div>
                    </div>

                    <div className="text-right sm:text-left">
                        <div className="text-lg font-bold text-foreground">{leg.arrival}</div>
                        <div className="text-xs text-muted-foreground font-medium">{leg.to.code}</div>
                    </div>
                </div>
            </div>

            {/* Classes Display */}
            <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide z-10 w-full">
                {leg.classAvailability.map((cls, idx) => (
                    <ClassBox key={idx} cls={cls} />
                ))}
            </div>
        </div>
    );
};

const SmartRouteCard: React.FC<SmartRouteCardProps> = ({ route }) => {
    // Calculate lowest fare
    let totalFare = 0;
    if (route.leg1.classAvailability.length > 0 && route.leg2.classAvailability.length > 0) {
        totalFare = parseInt(route.leg1.classAvailability[0].fare) + parseInt(route.leg2.classAvailability[0].fare);
    }

    return (
        <div className="w-full bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col relative">
            {/* Leg 1 */}
            <LegDisplay leg={route.leg1} isFirst={true} />
            
            {/* The Gap Indicator */}
            <div className="relative h-14 bg-accent/30 border-y border-border flex items-center justify-center">
                <div className="absolute left-[35px] sm:left-[39px] top-[-20px] bottom-[-20px] w-[2px] border-l-2 border-border border-dashed z-0"></div>
                <div className="z-10 bg-background border border-border rounded-full px-4 py-1.5 flex items-center gap-2 shadow-sm">
                    <Clock size={14} className="text-amber-500" />
                    <span className="text-xs font-bold text-foreground">
                        {route.waitTime} layover at {route.junction.name}
                    </span>
                </div>
            </div>

            {/* Leg 2 */}
            <LegDisplay leg={route.leg2} isFirst={false} />
            
            {/* Action Footer */}
            <div className="p-4 border-t border-border bg-accent/10 flex justify-between items-center z-10">
                <div className="text-sm text-muted-foreground font-medium">
                    Total Starting Fare: <span className="font-bold text-foreground">₹{totalFare || '--'}</span>
                </div>
                <button className="px-5 py-2 bg-primary text-primary-foreground font-bold rounded-lg hover:brightness-110 transition-all text-sm">
                    Book Both Tickets
                </button>
            </div>
        </div>
    );
};

export default SmartRouteCard;
