"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { domains } from "@/config/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { LayoutGrid, Calendar, MapPin, Users, Clock, ChevronLeft, ChevronRight, CalendarIcon as CalendarIconLucide } from "lucide-react";
import { getEvents } from "@/app/actions/events";
import { getParticipants } from "@/app/actions/participants";
import { getCurrentUserProfile } from "@/app/actions/users";
import { EventWithStats } from "@/types/events";
import { format, startOfMonth, endOfMonth, isSameMonth, addMonths, subMonths, parseISO } from "date-fns";

export default function Dashboard() {
  const { data: session } = useSession();
  const [events, setEvents] = useState<EventWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [registeredEventIds, setRegisteredEventIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchEvents();
    fetchUserRegistrations();
  }, []);

  const fetchUserRegistrations = async () => {
    try {
      // Get current user's UID
      const userResult = await getCurrentUserProfile();
      if (!userResult.success || !userResult.data) {
        console.error("Failed to get user profile");
        return;
      }

      const userId = userResult.data.uid;

      // Fetch only this user's registrations
      const result = await getParticipants({ userId });

      if (result.success && result.data) {
        const eventIds = new Set<string>(
          result.data.map((p: any) => p.event_id as string)
        );
        setRegisteredEventIds(eventIds);
      }
    } catch (error) {
      console.error("Error fetching registrations:", error);
    }
  };

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const result = await getEvents();
      
      if (result.success && result.data) {
        // Filter to show only upcoming and ongoing events (event_status is auto-updated)
        const upcomingEvents = result.data.filter((event: any) => 
          event.event_status === 'upcoming' || event.event_status === 'ongoing'
        );
        
        const transformedEvents = upcomingEvents.map((event: any) => ({
          id: event.id,
          title: event.title,
          description: event.description,
          date: event.date || new Date().toISOString().split('T')[0],
          time: event.time,
          location: event.location,
          maxParticipants: event.maxparticipants,
          registrationstatus: event.registrationstatus || 'upcoming',
          category: event.category,
          organizer: event.organizer,
          imageUrl: event.imageurl,
          tags: event.tags || [],
          requirements: event.requirements || [],
          createdAt: event.created_at,
          updatedAt: event.updated_at,
          participantCount: event.participantcount || 0,
          teamEvent: event.team_event || false,
          maxTeamSize: event.max_team_size || 1,
          minTeamSize: event.min_team_size || 1,
          eventStatus: event.event_status,
          isFeatured: event.is_featured,
          stats: event.stats || {
            total: 0,
            confirmed: 0,
            attended: 0,
            cancelled: 0
          }
        }));
        setEvents(transformedEvents);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
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

  // Count user's registered events in the current month
  const userRegisteredCount = useMemo(() => {
    return monthEvents.filter(event => registeredEventIds.has(event.id)).length;
  }, [monthEvents, registeredEventIds]);

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

  return (
    <div className="h-full w-full bg-[#000000] overflow-hidden">
      <motion.div initial="initial" animate="animate" className="space-y-4 md:space-y-6 max-w-7xl mx-auto h-full flex flex-col px-4 sm:px-6 md:px-8 py-4 md:py-6">
        <motion.div
          variants={{
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
          }}
          className="space-y-2 md:space-y-3 flex-shrink-0"
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-500 bg-clip-text text-transparent">
            Welcome back, {session?.user?.name?.split(" ")[0]}!
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-neutral-400">
            Your central hub for resources and events.
          </p>
        </motion.div>

        {/* Main Dashboard Sections */}
        <motion.div
          variants={{
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
          }}
          className="flex flex-col lg:grid gap-4 md:gap-6 lg:grid-cols-2 flex-1 min-h-0 overflow-hidden"
        >
          {/* Resources Card */}
          <Card className="relative bg-neutral-900/50 border-neutral-800/50 p-4 md:p-6 h-full overflow-hidden">
            <div className="flex flex-col h-full overflow-hidden">
              <div className="flex items-center justify-between mb-3 md:mb-4">
                <div className="flex items-center space-x-2 md:space-x-3">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-400/20 to-teal-500/20 ring-1 ring-neutral-700/50">
                    <LayoutGrid className="w-5 h-5 md:w-6 md:h-6 text-emerald-400" />
                  </div>
                  <h2 className="text-lg md:text-xl font-bold text-neutral-200">
                    Browse Resources
                  </h2>
                </div>
              </div>

              <p className="text-xs md:text-sm text-neutral-400 mb-3 md:mb-4">
                Explore curated educational resources across different domains
              </p>

              {/* Domain Resources Grid */}
              <div className="space-y-2 md:space-y-3 overflow-y-auto flex-1 min-h-0 pr-2">
                {domains.map((domain, index) => (
                  <Link
                    key={domain.name}
                    href={`/dashboard/${domain.resources}`}
                    className="block"
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                    >
                      <Card className="group relative bg-neutral-800/30 border-neutral-800 p-3 md:p-4 hover:bg-neutral-800/50 transition-all duration-300">
                        <div className="flex items-center gap-2 md:gap-3">
                          <div
                            className={cn(
                              "p-1.5 md:p-2 rounded-lg transition-all duration-300",
                              `bg-gradient-to-br ${domain.gradient} bg-opacity-10 group-hover:bg-opacity-20`,
                              "ring-1 ring-neutral-700/50 group-hover:ring-neutral-600/50"
                            )}
                          >
                            <domain.icon className="w-4 h-4 md:w-5 md:h-5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-xs md:text-sm font-semibold text-neutral-200 group-hover:text-white transition-colors">
                              {domain.name}
                            </h3>
                            <p className="text-[10px] md:text-xs text-neutral-400 truncate">
                              {domain.description}
                            </p>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </div>
          </Card>

          {/* Events Calendar Card with Month List */}
          <Card className="relative bg-neutral-900/50 border-neutral-800/50 p-4 md:p-6 h-full overflow-hidden">
            <div className="flex flex-col h-full overflow-hidden">
              <div className="flex items-center justify-between mb-3 md:mb-4">
                <div className="flex items-center space-x-2 md:space-x-3">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-blue-400/20 to-indigo-500/20 ring-1 ring-neutral-700/50">
                    <Calendar className="w-5 h-5 md:w-6 md:h-6 text-blue-400" />
                  </div>
                  <h2 className="text-lg md:text-xl font-bold text-neutral-200">
                    Event Calendar
                  </h2>
                </div>
                <Link href="/dashboard/events">
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="border-neutral-700 text-neutral-200 hover:bg-neutral-800 text-xs md:text-sm"
                  >
                    View All
                  </Button>
                </Link>
              </div>

              {/* Month Navigation */}
              <div className="flex items-center justify-between mb-3 md:mb-4">
                <div className="flex items-center space-x-1 md:space-x-2">
                  <Button
                    onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                    variant="outline"
                    size="sm"
                    className="border-neutral-700 text-neutral-200 hover:bg-neutral-800 h-7 w-7 md:h-8 md:w-8 p-0"
                  >
                    <ChevronLeft className="w-3 h-3 md:w-4 md:h-4" />
                  </Button>
                  <span className="text-xs md:text-sm font-semibold text-neutral-200 min-w-[100px] md:min-w-[120px] text-center">
                    {format(currentMonth, 'MMMM yyyy')}
                  </span>
                  <Button
                    onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                    variant="outline"
                    size="sm"
                    className="border-neutral-700 text-neutral-200 hover:bg-neutral-800 h-7 w-7 md:h-8 md:w-8 p-0"
                  >
                    <ChevronRight className="w-3 h-3 md:w-4 md:h-4" />
                  </Button>
                </div>
                <Button
                  onClick={() => setCurrentMonth(new Date())}
                  variant="outline"
                  size="sm"
                  className="border-neutral-700 text-neutral-200 hover:bg-neutral-800 text-[10px] md:text-xs px-2 md:px-3"
                >
                  Today
                </Button>
              </div>

              {/* Events List */}
              <div className="space-y-2 overflow-y-auto flex-1 min-h-0 pr-2">
                {loading ? (
                  <div className="text-center text-neutral-400 py-8">
                    <div className="animate-pulse">Loading events...</div>
                  </div>
                ) : monthEvents.length > 0 ? (
                  monthEvents.map((event, index) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                      className="rounded-lg bg-neutral-800/30 border border-neutral-800 hover:bg-neutral-800/50 transition-all cursor-pointer overflow-hidden"
                      onClick={() => window.location.href = '/dashboard/events'}
                    >
                      <div className="flex gap-2 md:gap-3 min-h-0">
                        {/* Event Image */}
                        {event.imageUrl && (
                          <div className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 shrink-0">
                            <img 
                              src={event.imageUrl} 
                              alt={event.title}
                              className="w-full h-full object-cover rounded"
                            />
                          </div>
                        )}
                        
                        {/* Event Content */}
                        <div className="flex-1 min-w-0 py-2 pr-1 md:p-3 flex flex-col justify-between overflow-hidden">
                          <div className="min-h-0">
                            <div className="flex items-center gap-1 md:gap-2 mb-1 flex-wrap">
                              <h3 className="text-xs md:text-sm font-semibold text-neutral-200 truncate">
                                {event.title}
                              </h3>
                              <Badge className={`${getCategoryColor(event.category)} text-[10px] md:text-xs`}>
                                {event.category}
                              </Badge>
                            </div>
                            <div className="flex flex-wrap items-center gap-2 md:gap-3 text-[10px] md:text-xs text-neutral-400 mb-1 md:mb-2">
                              <div className="flex items-center space-x-1">
                                <CalendarIconLucide className="w-2.5 h-2.5 md:w-3 md:h-3" />
                                <span className="hidden sm:inline">{format(parseISO(event.date), 'MMM dd, yyyy')}</span>
                                <span className="sm:hidden">{format(parseISO(event.date), 'MMM dd')}</span>
                              </div>
                              {event.time && (
                                <div className="flex items-center space-x-1">
                                  <Clock className="w-2.5 h-2.5 md:w-3 md:h-3" />
                                  <span className="hidden sm:inline">{event.time}</span>
                                </div>
                              )}
                            </div>
                            <div className="flex flex-wrap items-center gap-2 md:gap-3 text-[10px] md:text-xs text-neutral-400">
                              <div className="flex items-center space-x-1">
                                <MapPin className="w-2.5 h-2.5 md:w-3 md:h-3" />
                                <span className="truncate max-w-[80px] md:max-w-[150px]">{event.location}</span>
                              </div>
                              {event.maxParticipants && (
                                <div className="flex items-center space-x-1">
                                  <Users className="w-2.5 h-2.5 md:w-3 md:h-3" />
                                  <span>
                                    {event.participantCount}/{event.maxParticipants}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        {/* Status Badge */}
                        <div className="py-2 px-1 md:p-3 flex items-start justify-end">
                          <Badge className={`${getStatusColor(event.registrationstatus)} text-[10px] md:text-xs shrink-0 whitespace-nowrap`}>
                            {event.registrationstatus}
                          </Badge>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center text-neutral-400 py-8">
                    <CalendarIconLucide className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">No events for {format(currentMonth, 'MMMM yyyy')}</p>
                  </div>
                )}
              </div>

              {/* Month Summary */}
              {!loading && monthEvents.length > 0 && (
                <div className="mt-3 md:mt-4 pt-3 md:pt-4 border-t border-neutral-800">
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <p className="text-base md:text-lg font-bold text-emerald-400">{monthEvents.length}</p>
                      <p className="text-[10px] md:text-xs text-neutral-400">Events</p>
                    </div>
                    <div>
                      <p className="text-base md:text-lg font-bold text-blue-400">
                        {monthEvents.filter(e => e.registrationstatus === 'open').length}
                      </p>
                      <p className="text-[10px] md:text-xs text-neutral-400">Open</p>
                    </div>
                    <div>
                      <p className="text-base md:text-lg font-bold text-purple-400">
                        {userRegisteredCount}
                      </p>
                      <p className="text-[10px] md:text-xs text-neutral-400">Registered</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
