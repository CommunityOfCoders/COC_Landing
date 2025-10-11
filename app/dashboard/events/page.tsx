"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Calendar, 
  MapPin, 
  Users, 
  Clock, 
  Tag,
  CheckCircle,
  XCircle,
  AlertCircle,
  UsersRound,
  Info
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { TeamRegistrationModal } from "@/components/TeamRegistrationModal";
import { EventDetailsModal } from "@/components/EventDetailsModal";
import { getEvents } from "@/app/actions/events";
import { getParticipants, registerForEvent } from "@/app/actions/participants";
import { getCurrentUserProfile } from "@/app/actions/users";

interface Event {
  id: string;
  title: string;
  description: string;
  time: string;
  date?: string;
  location: string;
  maxparticipants: number;
  registrationstatus: string | boolean;
  category: string;
  organizer: string;
  tags: string[];
  requirements: string[];
  participantcount: number;
  created_at: string;
  team_event?: boolean;
  max_team_size?: number;
  min_team_size?: number;
  imageurl?: string;
}

export default function EventsPage() {
  const { data: session } = useSession();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [registering, setRegistering] = useState<string | null>(null);
  const [teamModalOpen, setTeamModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [registeredEventIds, setRegisteredEventIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchEvents();
    fetchUserRegistrations();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const result = await getEvents();

      if (result.success && result.data) {
        setEvents(result.data);
      } else if (!result.success) {
        console.error("Error fetching events:", result.error);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserRegistrations = async () => {
    try {
      // Get current user's UID
      const userResult = await getCurrentUserProfile();
      if (!userResult.success || !userResult.data) {
        console.error("Failed to get user profile:", !userResult.success ? (userResult as any).error : "No user data");
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

  const handleRegister = async (event: Event) => {
    // If it's a team event, open the team registration modal
    if (event.team_event) {
      setSelectedEvent(event);
      setTeamModalOpen(true);
      return;
    }

    // Individual registration
    try {
      setRegistering(event.id);
      const result = await registerForEvent({ event_id: event.id });

      if (result.success) {
        alert("Successfully registered for the event!");
        await fetchEvents();
        await fetchUserRegistrations();
      } else {
        alert(result.error || "Failed to register");
      }
    } catch (error: any) {
      console.error("Error registering:", error);
      alert(error.message || "Failed to register. Please try again.");
    } finally {
      setRegistering(null);
    }
  };

  const handleTeamRegistrationSuccess = async () => {
    await fetchEvents();
    await fetchUserRegistrations();
    setTeamModalOpen(false);
  };

  const handleTeamUpdate = async () => {
    await fetchEvents();
  };

  const filteredEvents = events.filter((event) => {
    if (filter === "all") return true;
    const isOpen = typeof event.registrationstatus === 'string' 
      ? event.registrationstatus === 'open' 
      : event.registrationstatus;
    if (filter === "open") return isOpen;
    if (filter === "closed") return !isOpen;
    return event.category === filter;
  });

  const categories = ["all", "open", "closed", "workshop", "hackathon", "seminar", "competition", "other"];

  return (
    <>
      {selectedEvent && (
        <>
          <TeamRegistrationModal
            open={teamModalOpen}
            onOpenChange={setTeamModalOpen}
            eventId={selectedEvent.id}
            eventTitle={selectedEvent.title}
            minTeamSize={selectedEvent.min_team_size || 1}
            maxTeamSize={selectedEvent.max_team_size || 1}
            onSuccess={handleTeamRegistrationSuccess}
          />
          <EventDetailsModal
            open={detailsModalOpen}
            onOpenChange={setDetailsModalOpen}
            event={selectedEvent}
            isRegistered={registeredEventIds.has(selectedEvent.id)}
            onRegister={handleRegister}
            registering={registering === selectedEvent.id}
            onTeamUpdate={handleTeamUpdate}
          />
        </>
      )}
      
      <div className="min-h-screen bg-black">
        {/* Header */}
      <div className="border-b border-neutral-800/50 bg-neutral-900/30 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-6">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">
              Upcoming Events
            </h1>
            <p className="text-neutral-400 text-sm mt-2">
              Discover and register for events organized by COC
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Filters */}
        <div className="mb-8 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <Button
              key={cat}
              onClick={() => setFilter(cat)}
              variant={filter === cat ? "default" : "outline"}
              size="sm"
              className={
                filter === cat
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                  : "border-neutral-700 text-neutral-200 hover:bg-neutral-800 hover:text-white"
              }
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </Button>
          ))}
        </div>

        {/* Events Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-96 bg-neutral-900/50 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-16">
            <AlertCircle className="w-16 h-16 text-neutral-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-neutral-300 mb-2">No events found</h3>
            <p className="text-neutral-500">
              {filter === "all" 
                ? "There are no events available at the moment."
                : `No ${filter} events found. Try a different filter.`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event, index) => {
              const isRegistered = registeredEventIds.has(event.id);
              const registrationstatus = typeof event.registrationstatus === 'string' 
                ? event.registrationstatus.toLowerCase()
                : 'closed';
              
              const getStatusBadge = () => {
                switch (registrationstatus) {
                  case 'open':
                    return {
                      className: "border-green-500/50 text-green-400",
                      icon: <CheckCircle className="w-3 h-3 mr-1" />,
                      text: "Open"
                    };
                  case 'upcoming':
                    return {
                      className: "border-blue-500/50 text-blue-400",
                      icon: <Clock className="w-3 h-3 mr-1" />,
                      text: "Upcoming"
                    };
                  case 'closed':
                  default:
                    return {
                      className: "border-red-500/50 text-red-400",
                      icon: <XCircle className="w-3 h-3 mr-1" />,
                      text: "Closed"
                    };
                }
              };

              const statusBadge = getStatusBadge();
              
              return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="bg-neutral-900/50 border-neutral-800 hover:border-emerald-500/50 transition-all h-full flex flex-col">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex flex-wrap gap-2">
                        <Badge
                          variant="outline"
                          className={statusBadge.className}
                        >
                          {statusBadge.icon}
                          {statusBadge.text}
                        </Badge>
                        {isRegistered && (
                          <Badge variant="outline" className="border-blue-500/50 text-blue-400">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Registered
                          </Badge>
                        )}
                      </div>
                      <Badge variant="outline" className="border-neutral-700 text-neutral-200">
                        {event.category}
                      </Badge>
                    </div>
                    <CardTitle className="text-neutral-100 text-xl">{event.title}</CardTitle>
                    <CardDescription className="text-neutral-400 line-clamp-2">
                      {event.description.replace(/[#*`]/g, '')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col justify-between">
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center text-sm text-neutral-400">
                        <Clock className="w-4 h-4 mr-2 text-emerald-500" />
                        <span>
                          {event.time}
                          {event.date ? (
                            <span className="ml-2 text-neutral-400">· {format(parseISO(event.date), 'MMM dd')}</span>
                          ) : null}
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-neutral-400">
                        <MapPin className="w-4 h-4 mr-2 text-emerald-500" />
                        {event.location}
                      </div>
                      <div className="flex items-center text-sm text-neutral-400">
                        <Users className="w-4 h-4 mr-2 text-emerald-500" />
                        {event.participantcount} / {event.maxparticipants} {event.team_event ? 'participants' : 'registered'}
                      </div>
                      {event.team_event && (
                        <div className="flex items-center text-sm text-emerald-400">
                          <UsersRound className="w-4 h-4 mr-2" />
                          Team Event ({event.min_team_size}-{event.max_team_size} members)
                        </div>
                      )}
                      
                      {event.tags && event.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-3">
                          {event.tags.slice(0, 3).map((tag, i) => (
                            <Badge
                              key={i}
                              variant="outline"
                              className="border-neutral-700 text-neutral-400 text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                          {event.tags.length > 3 && (
                            <Badge
                              variant="outline"
                              className="border-neutral-700 text-neutral-400 text-xs"
                            >
                              +{event.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={() => {
                          setSelectedEvent(event);
                          setDetailsModalOpen(true);
                        }}
                        variant="outline"
                        className="flex-1 border-neutral-700 text-neutral-200 hover:bg-neutral-800 hover:text-white"
                      >
                        <Info className="w-4 h-4 mr-2" />
                        Details
                      </Button>
                      <Button
                        onClick={() => handleRegister(event)}
                        disabled={
                          registrationstatus !== 'open' ||
                          event.participantcount >= event.maxparticipants ||
                          registering === event.id ||
                          isRegistered
                        }
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white disabled:bg-neutral-800 disabled:text-neutral-500"
                      >
                        {registering === event.id
                          ? "Registering..."
                          : isRegistered
                          ? "Registered"
                          : event.participantcount >= event.maxparticipants
                          ? "Full"
                          : registrationstatus === 'upcoming'
                          ? "Coming Soon"
                          : registrationstatus !== 'open'
                          ? "Closed"
                          : event.team_event
                          ? "Register"
                          : "Register"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
            )}
          </div>
        )}
      </div>
    </div>
    </>
  );
}
