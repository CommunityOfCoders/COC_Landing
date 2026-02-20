"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Users, Settings, BarChart3, Folder } from "lucide-react";
import EventManagement from "@/components/admin/EventManagement";
import ParticipantManagement from "@/components/admin/ParticipantManagement";
import AdminStats from "@/components/admin/AdminStats";
import ProjectManagement from "@/components/admin/ProjectManagement";
import { Event, EventWithStats } from "@/types/events";
import { Project } from "@/types/projects";
import { getEvents, createEvent, updateEvent, deleteEvent } from "@/app/actions/events";
import { getAllProjects } from "@/app/actions/projects";
import { getCurrentUserProfile } from "@/app/actions/users";

interface UserProfile {
  name: string;
  email: string;
  picture: string;
  branch?: string;
  year?: number;
  is_admin: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [events, setEvents] = useState<EventWithStats[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  // Fetch events and user profile from API
  useEffect(() => {
    fetchEventsData();
    fetchProjectsData();
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const result = await getCurrentUserProfile();
      
      if (result.success && result.data) {
        setUserProfile(result.data as UserProfile);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const fetchEventsData = async () => {
    try {
      setLoading(true);
      const result = await getEvents();
      
      if (result.success) {
        // Transform the data to match EventWithStats interface
        const transformedEvents = result.data.map((event: any) => ({
          id: event.id,
          title: event.title,
          description: event.description,
          date: event.date || event.created_at?.split('T')[0] || new Date().toISOString().split('T')[0],
          time: event.time,
          location: event.location,
          maxParticipants: event.maxparticipants,
          registrationstatus: event.registrationstatus || 'open',
          registrationDeadline: event.registration_deadline,
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

  const fetchProjectsData = async () => {
    try {
      const result = await getAllProjects();
      if (result.success) {
        setProjects(result.data);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const handleCreateEvent = async (eventData: Event) => {
    try {
      const result = await createEvent({
        title: eventData.title,
        description: eventData.description,
        date: eventData.date,
        time: eventData.time,
        location: eventData.location,
        maxParticipants: eventData.maxParticipants,
        registrationstatus: eventData.registrationstatus || 'open',
        registrationDeadline: eventData.registrationDeadline,
        category: eventData.category,
        organizer: eventData.organizer,
        imageUrl: eventData.imageUrl,
        tags: eventData.tags,
        requirements: eventData.requirements,
        teamEvent: eventData.teamEvent || false,
        maxTeamSize: eventData.maxTeamSize || 1,
        minTeamSize: eventData.minTeamSize || 1,
      });

      if (!result.success) {
        throw new Error(result.error || 'Failed to create event');
      }

      // Refresh events list
      await fetchEventsData();
    } catch (error) {
      console.error('Error creating event:', error);
      alert('Failed to create event. Please try again.');
    }
  };

  const handleUpdateEvent = async (eventId: string, updates: Partial<Event>) => {
    try {
      const result = await updateEvent(eventId, updates);

      if (!result.success) {
        throw new Error(result.error || 'Failed to update event');
      }

      // Refresh events list
      await fetchEventsData();
    } catch (error) {
      console.error('Error updating event:', error);
      alert('Failed to update event. Please try again.');
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this event?')) {
      return;
    }

    try {
      const result = await deleteEvent(eventId);

      if (!result.success) {
        throw new Error(result.error || 'Failed to delete event');
      }

      // Refresh events list
      await fetchEventsData();
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Failed to delete event. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="border-b border-neutral-800/50 bg-neutral-900/30 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
              <p className="text-neutral-400 text-sm mt-1">
                Manage events and participants
              </p>
            </div>
            <div className="flex items-center space-x-3">
              {userProfile ? (
                <div className="flex items-center space-x-3">
                  <img 
                    src={userProfile.picture} 
                    alt={userProfile.name}
                    className="w-8 h-8 rounded-full ring-2 ring-emerald-500/20"
                  />
                  <div className="text-right">
                    <p className="text-sm font-medium text-neutral-200">
                      {userProfile.name}
                    </p>
                    <p className="text-xs text-neutral-500">
                      Admin {userProfile.branch ? `• ${userProfile.branch}` : ''}
                    </p>
                  </div>
                </div>
              ) : (
                <span className="text-sm text-neutral-400">
                  Welcome, Admin
                </span>
              )}
              <Button
                onClick={() => router.push("/")}
                variant="outline"
                size="sm"
                className="border-neutral-700 text-neutral-200 hover:bg-neutral-800 hover:text-white"
              >
                Back to Home
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-neutral-900/50 border border-neutral-800/50">
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="events" className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>Events</span>
            </TabsTrigger>
            <TabsTrigger value="participants" className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>Participants</span>
            </TabsTrigger>
            <TabsTrigger value="projects" className="flex items-center space-x-2">
              <Folder className="w-4 h-4" />
              <span>Projects</span>
            </TabsTrigger>
          </TabsList>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {loading ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-32 bg-neutral-900/50 rounded-lg animate-pulse" />
                  ))}
                </div>
                <div className="h-64 bg-neutral-900/50 rounded-lg animate-pulse" />
              </div>
            ) : (
              <>
                <TabsContent value="overview" className="space-y-6">
                  <AdminStats events={events} />
                </TabsContent>

                <TabsContent value="events" className="space-y-6">
                  <EventManagement
                    events={events}
                    onCreateEvent={handleCreateEvent}
                    onUpdateEvent={handleUpdateEvent}
                    onDeleteEvent={handleDeleteEvent}
                  />
                </TabsContent>

                <TabsContent value="participants" className="space-y-6">
                  <ParticipantManagement events={events} />
                </TabsContent>

                <TabsContent value="projects" className="space-y-6">
                  <ProjectManagement 
                    projects={projects} 
                    onRefresh={fetchProjectsData}
                  />
                </TabsContent>
              </>
            )}
          </motion.div>
        </Tabs>
      </div>
    </div>
  );
}
