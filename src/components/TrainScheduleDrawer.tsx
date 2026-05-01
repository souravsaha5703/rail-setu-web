import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerClose
} from "./ui/drawer";
import { ArrowLeft, TrainFront, Loader2, AlertCircle, Search } from "lucide-react";
import type { TrainInfo } from "./TrainCard";

interface TrainScheduleDrawerProps {
  train: TrainInfo;
  children: React.ReactNode;
}

interface ScheduleStop {
  sno: number;
  name: string;
  code: string;
  arr: string;
  dep: string;
  halt: string;
  date?: string;
  isOrigin?: boolean;
}

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const TrainScheduleDrawer: React.FC<TrainScheduleDrawerProps> = ({ train, children }) => {
  const [schedule, setSchedule] = useState<ScheduleStop[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const { date: searchDate } = useSelector((state: RootState) => state.search);
  const runningDaysList = train.runningDays.split(', ').map(d => d.trim());

  const formatMinutes = (minutes: number | null) => {
    if (minutes === null) return "--";
    const h = Math.floor(minutes / 60) % 24;
    const m = minutes % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  };

  const calculateHalt = (arr: number | null, dep: number | null) => {
    if (arr === null || dep === null) return "--";
    const diff = dep - arr;
    if (diff <= 0) return "--";
    const h = Math.floor(diff / 60);
    const m = diff % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  };

  const getStopDate = (searchDateStr: string | null, dayOffset: number) => {
    const base = searchDateStr ? new Date(searchDateStr) : new Date();
    const d = new Date(base);
    d.setDate(base.getDate() + (dayOffset - 1));
    return d.toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short' });
  };

  const fetchSchedule = async () => {
    try {
      setLoading(true);
      setError(null);

      // Format date to dd-mm-yyyy
      let formattedDate = "";
      if (searchDate) {
        const [year, month, day] = searchDate.split('-');
        formattedDate = `${day}-${month}-${year}`;
      } else {
        const today = new Date();
        formattedDate = today.toLocaleDateString('en-GB').replace(/\//g, '-');
      }

      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
      const trainNo = train.trainNumber;
      const date = formattedDate;
      const response = await fetch(`${apiUrl}/api/trains/schedule?trainNo=${trainNo}&date=${date}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch schedule: ${response.statusText}`);
      }

      const result = await response.json();
      
      // Handle both wrapped (status/response) and unwrapped (direct data) responses
      const scheduleContainer = (result.status === 200 && result.response?.data) ? result.response.data : result.data;
      const routeData = scheduleContainer?.route;

      if (routeData && Array.isArray(routeData)) {
        const mappedSchedule = routeData.map((item: any, idx: number) => {
          const arr = formatMinutes(item.arrivalMinutes);
          const dep = formatMinutes(item.departureMinutes);
          const halt = calculateHalt(item.arrivalMinutes, item.departureMinutes);
          
          // Show date only if it's the first stop or day changes
          const prevDay = idx > 0 ? routeData[idx - 1].day : null;
          const showDate = idx === 0 || (prevDay !== null && item.day !== prevDay);
          const stopDate = showDate ? getStopDate(searchDate, item.day) : "";

          return {
            sno: idx + 1,
            name: item.stationName,
            code: item.stationCode,
            arr: item.arrivalMinutes === null ? "Start" : arr,
            dep: item.departureMinutes === null ? "End" : dep,
            halt: halt,
            date: stopDate,
            isOrigin: item.arrivalMinutes === null
          };
        });
        setSchedule(mappedSchedule);
      } else {
        throw new Error(result.message || "Invalid schedule data structure received from backend");
      }
    } catch (err) {
      console.error("Error fetching schedule:", err);
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchSchedule();
    }
  }, [isOpen, train.trainNumber, searchDate]);

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        {children}
      </DrawerTrigger>
      <DrawerContent className="max-h-[90vh] flex flex-col p-0">
        <DrawerHeader className="border-b px-4 py-4 sm:px-6">
          <DrawerTitle className="flex items-center gap-3 text-lg sm:text-xl font-bold">
            <DrawerClose asChild>
                <ArrowLeft className="w-5 h-5 cursor-pointer text-muted-foreground hover:text-foreground" />
            </DrawerClose>
            {train.trainNumber} - {train.trainName.toUpperCase()}
          </DrawerTitle>
          <div className="mt-3 text-sm flex gap-2 items-center text-muted-foreground font-medium text-left">
            <span>Running Days :</span>
            <div className="flex gap-1.5">
              {days.map(day => (
                <span key={day} className={runningDaysList.includes(day) ? "text-emerald-500 font-semibold" : "opacity-50"}>
                  {day}
                </span>
              ))}
            </div>
          </div>
        </DrawerHeader>

        {/* Table Header */}
        <div className="flex items-center px-4 sm:px-6 py-3 bg-accent/50 border-b text-xs sm:text-sm font-bold text-muted-foreground">
          <div className="w-8 sm:w-10">S.no</div>
          <div className="flex-1 ml-8 sm:ml-12">Station</div>
          <div className="w-16 sm:w-20 text-right">Arr.<br/>Dep.</div>
          <div className="w-12 sm:w-16 text-right">Halt</div>
        </div>

        {/* Schedule List / Content */}
        <div className="overflow-y-auto flex-1 px-4 sm:px-6 pb-6 pt-2 min-h-[300px] flex flex-col">
          {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center py-12">
              <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
              <p className="text-muted-foreground font-medium">Fetching train schedule...</p>
            </div>
          ) : error ? (
            <div className="flex-1 flex flex-col items-center justify-center py-12 text-center px-4">
              <AlertCircle className="w-12 h-12 text-destructive mb-4" />
              <h3 className="text-lg font-bold text-foreground">Failed to load schedule</h3>
              <p className="text-muted-foreground text-sm max-w-xs mx-auto mb-6">{error}</p>
              <button 
                onClick={fetchSchedule}
                className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-semibold text-sm hover:brightness-105 transition-all"
              >
                Try Again
              </button>
            </div>
          ) : schedule.length > 0 ? (
            schedule.map((stop, idx) => (
              <React.Fragment key={idx}>
                {/* Date Header if exists */}
                {stop.date && (
                  <div className="flex mb-1 mt-2">
                    <div className="w-8 sm:w-10"></div>
                    <div className="w-6 sm:w-8 flex justify-center relative">
                      <div className="absolute top-1/2 bottom-0 w-[3px] bg-border/60 z-0" />
                    </div>
                    <div className="bg-accent text-foreground text-xs font-bold px-3 py-1.5 rounded-full shadow-sm ml-2 sm:ml-4 z-10">
                      {stop.date}
                    </div>
                  </div>
                )}

                {/* Station Row */}
                <div className={`flex items-stretch relative ${stop.isOrigin ? 'bg-emerald-500/10 -mx-4 sm:-mx-6 px-4 sm:px-6 rounded-lg' : ''}`}>
                  
                  {/* S.no */}
                  <div className="w-8 sm:w-10 py-4 flex items-center text-xs sm:text-sm font-medium text-muted-foreground">
                    {stop.sno}
                  </div>
                  
                  {/* Timeline Icon */}
                  <div className="w-6 sm:w-8 flex justify-center relative py-4">
                    {/* Timeline connecting line */}
                    <div className={`absolute w-[3px] bg-border/60 z-0 
                      ${idx === 0 && stop.date ? 'top-0 bottom-0' : ''} 
                      ${idx === 0 && !stop.date ? 'top-1/2 bottom-0' : ''} 
                      ${idx > 0 && idx < schedule.length - 1 ? 'top-0 bottom-0' : ''} 
                      ${idx === schedule.length - 1 ? 'top-0 bottom-1/2' : ''}`} 
                    />
                    
                    {/* Circle / Icon */}
                    <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center border-2 bg-background z-10 mt-auto mb-auto ${stop.isOrigin ? 'border-emerald-500 text-emerald-600' : 'border-border'}`}>
                      {stop.isOrigin ? <TrainFront size={14} /> : <div className="w-2 h-2 rounded-full bg-border" />}
                    </div>
                  </div>

                  {/* Station Info */}
                  <div className="flex-1 ml-2 sm:ml-4 py-4 flex flex-col justify-center">
                    <div className={`text-sm sm:text-base font-bold uppercase ${stop.isOrigin ? 'text-emerald-600 dark:text-emerald-500' : 'text-foreground'}`}>
                      {stop.name}
                    </div>
                    <div className={`text-xs ${stop.isOrigin ? 'text-emerald-500' : 'text-muted-foreground'}`}>
                      ({stop.code})
                    </div>
                  </div>

                  {/* Arr / Dep */}
                  <div className="w-16 sm:w-20 py-4 text-right text-xs sm:text-sm flex flex-col justify-center">
                    <div className={stop.arr === 'Start' ? 'text-emerald-500 font-semibold' : 'text-muted-foreground'}>{stop.arr}</div>
                    <div className="font-medium text-foreground">{stop.dep}</div>
                  </div>

                  {/* Halt */}
                  <div className="w-12 sm:w-16 py-4 text-right text-xs sm:text-sm text-muted-foreground font-medium flex items-center justify-end">
                    {stop.halt}
                  </div>
                </div>
              </React.Fragment>
            ))
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center py-12 text-center">
              <Search className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-bold text-foreground">No Schedule Found</h3>
              <p className="text-muted-foreground text-sm max-w-xs mx-auto">We couldn't retrieve the schedule for this train.</p>
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default TrainScheduleDrawer;
