"use client";

import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { domains } from "@/config/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import EventCalendarView from "@/components/EventCalendarView";
import { EventDetailsModal } from "@/components/EventDetailsModal";
import { TeamRegistrationModal } from "@/components/TeamRegistrationModal";
import { EventWithStats } from "@/types/events";
import { LayoutGrid, Calendar } from "lucide-react";
import { getEvents } from "@/app/actions/events";
import { getParticipants, registerForEvent } from "@/app/actions/participants";

export default function Dashboard() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [events, setEvents] = useState<EventWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<EventWithStats | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [teamModalOpen, setTeamModalOpen] = useState(false);
  const [registeredEventIds, setRegisteredEventIds] = useState<Set<string>>(new Set());
  const [registering, setRegistering] = useState<string | null>(null);
  
  const currentDomain = domains.find(
    (domain) => `/dashboard/${domain.resources}` === pathname
  );

  useEffect(() => {
    fetchEvents();
    fetchUserRegistrations();
  }, []);

  const fetchUserRegistrations = async () => {
    try {
      const result = await getParticipants();

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
        // Filter upcoming and ongoing events only
        const upcomingEvents = result.data.filter((event: any) => 
          event.event_status !== 'completed' && 
          event.event_status !== 'cancelled' &&
          new Date(event.date) >= new Date()
        );
        
        const transformedEvents = upcomingEvents.map((event: any) => ({
          id: event.id,
          title: event.title,
          description: event.description,
          date: event.date || new Date().toISOString().split('T')[0],
          time: event.time,
          location: event.location,
          maxParticipants: event.maxparticipants,
          registrationStatus: event.registrationstatus || 'upcoming',
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

  const handleEventClick = (event: EventWithStats) => {
    setSelectedEvent(event);
    setDetailsModalOpen(true);
  };

  const handleRegister = async (event: any) => {
    // If it's a team event, open the team registration modal
    if (event.team_event) {
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

  return (
    <div className="min-h-screen bg-black px-8 py-6">
      {selectedEvent && (
        <>
          <TeamRegistrationModal
            open={teamModalOpen}
            onOpenChange={setTeamModalOpen}
            eventId={selectedEvent.id}
            eventTitle={selectedEvent.title}
            minTeamSize={selectedEvent.minTeamSize || 1}
            maxTeamSize={selectedEvent.maxTeamSize || 1}
            onSuccess={handleTeamRegistrationSuccess}
          />
          <EventDetailsModal
            open={detailsModalOpen}
            onOpenChange={setDetailsModalOpen}
            event={{
              id: selectedEvent.id,
              title: selectedEvent.title,
              description: selectedEvent.description,
              time: selectedEvent.time || '',
              date: selectedEvent.date,
              location: selectedEvent.location,
              maxparticipants: selectedEvent.maxParticipants || 0,
              registrationstatus: selectedEvent.registrationStatus,
              category: selectedEvent.category,
              organizer: selectedEvent.organizer,
              tags: selectedEvent.tags,
              requirements: selectedEvent.requirements || [],
              participantcount: selectedEvent.participantCount,
              created_at: selectedEvent.createdAt,
              team_event: selectedEvent.teamEvent,
              max_team_size: selectedEvent.maxTeamSize,
              min_team_size: selectedEvent.minTeamSize,
              imageurl: selectedEvent.imageUrl
            }}
            isRegistered={registeredEventIds.has(selectedEvent.id)}
            onRegister={handleRegister}
            registering={registering === selectedEvent.id}
            onTeamUpdate={handleTeamUpdate}
          />
        </>
      )}
      <motion.div initial="initial" animate="animate" className="space-y-8">
        <motion.div
          variants={{
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
          }}
          className="space-y-3"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-500 bg-clip-text text-transparent">
            Welcome back, {session?.user?.name?.split(" ")[0]}!
          </h1>
          <p className="text-lg text-neutral-400">
            Explore {currentDomain?.name || "educational"} resources curated just
            for you.
          </p>
        </motion.div>

        <Tabs defaultValue="resources" className="space-y-6">
          <TabsList className="bg-neutral-900/50 border border-neutral-800/50">
            <TabsTrigger value="resources" className="flex items-center space-x-2">
              <LayoutGrid className="w-4 h-4" />
              <span>Resources</span>
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>Event Calendar</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="resources">
            <motion.div
              variants={{
                initial: { opacity: 0, y: 20 },
                animate: { opacity: 1, y: 0 },
              }}
              className="flex flex-col gap-8 sm:grid md:grid-cols-2 xl:grid-cols-3"
            >
              {domains.map((domain) => (
                <Link
                  key={domain.name}
                  href={`/dashboard/${domain.resources}`}
                  className="w-full"
                >
                  <Card className="group relative w-full bg-neutral-900/50 border-neutral-800/50 p-6 hover:bg-neutral-800/50 transition-all duration-300 flex flex-col">
                    <div className="flex items-start gap-4 flex-grow">
                      <div
                        className={cn(
                          "p-3 rounded-lg transition-all duration-300",
                          `bg-gradient-to-br ${domain.gradient} bg-opacity-10 group-hover:bg-opacity-20`,
                          "ring-1 ring-neutral-700/50 group-hover:ring-neutral-600/50"
                        )}
                      >
                        <domain.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex flex-col flex-grow">
                        <h3 className="text-lg font-semibold text-neutral-200 group-hover:text-white transition-colors">
                          {domain.name}
                        </h3>
                        <p className="text-sm text-neutral-400 mt-1 line-clamp-2 h-[40px]">
                          {domain.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </motion.div>
          </TabsContent>

          <TabsContent value="calendar">
            <motion.div
              variants={{
                initial: { opacity: 0, y: 20 },
                animate: { opacity: 1, y: 0 },
              }}
            >
              {loading ? (
                <Card className="bg-neutral-900/50 border-neutral-800/50 p-12">
                  <div className="text-center text-neutral-400">
                    <div className="animate-pulse">Loading events...</div>
                  </div>
                </Card>
              ) : (
                <EventCalendarView 
                  events={events}
                  onEventClick={handleEventClick}
                />
              )}
            </motion.div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
