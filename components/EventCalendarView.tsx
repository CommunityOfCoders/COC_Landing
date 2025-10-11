"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon,
  MapPin,
  Users,
  Clock
} from "lucide-react";
import { EventWithStats } from "@/types/events";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, addMonths, subMonths, isToday, parseISO } from "date-fns";

interface EventCalendarViewProps {
  events: EventWithStats[];
  onEventClick?: (event: EventWithStats) => void;
}

export default function EventCalendarView({ events, onEventClick }: EventCalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [view, setView] = useState<'month' | 'list'>('month');

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get events for a specific day
  const getEventsForDay = (day: Date) => {
    return events.filter(event => {
      try {
        const eventDate = parseISO(event.date);
        return isSameDay(eventDate, day);
      } catch {
        return false;
      }
    });
  };

  // Get events for current month
  const monthEvents = useMemo(() => {
    return events.filter(event => {
      try {
        const eventDate = parseISO(event.date);
        return isSameMonth(eventDate, currentMonth);
      } catch {
        return false;
      }
    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [events, currentMonth]);

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      workshop: "bg-blue-500/20 text-blue-300 border-blue-500/30",
      hackathon: "bg-purple-500/20 text-purple-300 border-purple-500/30",
      seminar: "bg-green-500/20 text-green-300 border-green-500/30",
      competition: "bg-red-500/20 text-red-300 border-red-500/30",
      webinar: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
      bootcamp: "bg-orange-500/20 text-orange-300 border-orange-500/30",
      conference: "bg-pink-500/20 text-pink-300 border-pink-500/30",
      networking: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
      "tech-talk": "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
      "panel-discussion": "bg-teal-500/20 text-teal-300 border-teal-500/30",
      "project-showcase": "bg-violet-500/20 text-violet-300 border-violet-500/30",
      "coding-contest": "bg-rose-500/20 text-rose-300 border-rose-500/30",
      "study-group": "bg-lime-500/20 text-lime-300 border-lime-500/30",
      other: "bg-gray-500/20 text-gray-300 border-gray-500/30",
    };
    return colors[category] || colors.other;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      open: "bg-emerald-500/20 text-emerald-300",
      closed: "bg-red-500/20 text-red-300",
      upcoming: "bg-blue-500/20 text-blue-300",
    };
    return colors[status] || colors.upcoming;
  };

  // Get the starting day of the week for the month (0 = Sunday)
  const startingDayOfWeek = monthStart.getDay();
  
  // Calculate empty cells before the first day
  const emptyCells = Array.from({ length: startingDayOfWeek }, (_, i) => i);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            variant="outline"
            size="sm"
            className="border-neutral-700 text-neutral-200 hover:bg-neutral-800"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <h2 className="text-xl font-bold text-neutral-200">
            {format(currentMonth, 'MMMM yyyy')}
          </h2>
          <Button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            variant="outline"
            size="sm"
            className="border-neutral-700 text-neutral-200 hover:bg-neutral-800"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
          <Button
            onClick={() => setCurrentMonth(new Date())}
            variant="outline"
            size="sm"
            className="border-neutral-700 text-neutral-200 hover:bg-neutral-800"
          >
            Today
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            onClick={() => setView('month')}
            variant={view === 'month' ? 'default' : 'outline'}
            size="sm"
            className={view === 'month' 
              ? "bg-emerald-600 hover:bg-emerald-700" 
              : "border-neutral-700 text-neutral-200 hover:bg-neutral-800"
            }
          >
            <CalendarIcon className="w-4 h-4 mr-2" />
            Month
          </Button>
          <Button
            onClick={() => setView('list')}
            variant={view === 'list' ? 'default' : 'outline'}
            size="sm"
            className={view === 'list' 
              ? "bg-emerald-600 hover:bg-emerald-700" 
              : "border-neutral-700 text-neutral-200 hover:bg-neutral-800"
            }
          >
            List
          </Button>
        </div>
      </div>

      {/* Calendar or List View */}
      {view === 'month' ? (
        <Card className="bg-neutral-900/50 border-neutral-800/50 p-4">
          {/* Day headers */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-sm font-semibold text-neutral-400 p-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-2">
            {/* Empty cells before first day */}
            {emptyCells.map(i => (
              <div key={`empty-${i}`} className="aspect-square" />
            ))}
            
            {/* Day cells */}
            {monthDays.map((day: Date) => {
              const dayEvents = getEventsForDay(day);
              const isCurrentDay = isToday(day);
              
              return (
                <motion.div
                  key={day.toISOString()}
                  whileHover={{ scale: 1.02 }}
                  className={`
                    aspect-square border rounded-lg p-2 transition-all cursor-pointer
                    ${isCurrentDay 
                      ? 'border-emerald-500 bg-emerald-500/10' 
                      : 'border-neutral-800 hover:border-neutral-700 hover:bg-neutral-800/30'
                    }
                  `}
                >
                  <div className="flex flex-col h-full">
                    <div className={`text-sm font-medium mb-1 ${isCurrentDay ? 'text-emerald-400' : 'text-neutral-300'}`}>
                      {format(day, 'd')}
                    </div>
                    <div className="flex-1 overflow-y-auto space-y-1">
                      {dayEvents.map(event => (
                        <div
                          key={event.id}
                          onClick={() => onEventClick?.(event)}
                          className={`
                            text-xs px-2 py-1 rounded truncate cursor-pointer
                            ${getCategoryColor(event.category)}
                            hover:opacity-80 transition-opacity
                          `}
                          title={event.title}
                        >
                          {event.title}
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {monthEvents.length > 0 ? (
            monthEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card 
                  className="bg-neutral-900/50 border-neutral-800/50 p-4 hover:bg-neutral-800/50 transition-all cursor-pointer"
                  onClick={() => onEventClick?.(event)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-semibold text-neutral-200">
                          {event.title}
                        </h3>
                        <Badge className={getCategoryColor(event.category)}>
                          {event.category}
                        </Badge>
                        <Badge className={getStatusColor(event.registrationStatus)}>
                          {event.registrationStatus}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-400">
                        <div className="flex items-center space-x-1">
                          <CalendarIcon className="w-4 h-4" />
                          <span>{format(parseISO(event.date), 'MMM dd, yyyy')}</span>
                        </div>
                        {event.time && (
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{event.time}</span>
                          </div>
                        )}
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4" />
                          <span>{event.location}</span>
                        </div>
                        {event.maxParticipants && (
                          <div className="flex items-center space-x-1">
                            <Users className="w-4 h-4" />
                            <span>
                              {event.participantCount} / {event.maxParticipants}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))
          ) : (
            <Card className="bg-neutral-900/50 border-neutral-800/50 p-8">
              <div className="text-center text-neutral-400">
                <CalendarIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No events scheduled for {format(currentMonth, 'MMMM yyyy')}</p>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Month summary */}
      <Card className="bg-neutral-900/50 border-neutral-800/50 p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-emerald-400">{monthEvents.length}</p>
            <p className="text-sm text-neutral-400">Total Events</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-blue-400">
              {monthEvents.filter(e => e.registrationStatus === 'open').length}
            </p>
            <p className="text-sm text-neutral-400">Open Registration</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-purple-400">
              {monthEvents.reduce((sum, e) => sum + e.participantCount, 0)}
            </p>
            <p className="text-sm text-neutral-400">Total Participants</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-orange-400">
              {monthEvents.filter(e => e.maxParticipants && e.participantCount >= e.maxParticipants).length}
            </p>
            <p className="text-sm text-neutral-400">Full Events</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
