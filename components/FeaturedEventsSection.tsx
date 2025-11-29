"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, MapPin, Clock, Users, ExternalLink, ArrowRight } from "lucide-react";
import { getFeaturedEvents } from "@/app/actions/events";
import Link from "next/link";

interface FeaturedEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  maxParticipants: number;
  registrationStatus: string;
  eventStatus: string;
  category: string;
  organizer: string;
  imageUrl: string;
  tags: string[];
  externalLink?: string;
}

export function FeaturedEventsSection() {
  const [events, setEvents] = useState<FeaturedEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const result = await getFeaturedEvents();
        if (result.success) {
          setEvents(result.data);
        }
      } catch (error) {
        console.error("Error fetching featured events:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-black">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-10 bg-neutral-800 rounded w-64 mx-auto mb-4"></div>
              <div className="h-4 bg-neutral-800 rounded w-96 mx-auto"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (events.length === 0) {
    return null; // Don't show section if no featured events
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "upcoming":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "closed":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-neutral-500/20 text-neutral-400 border-neutral-500/30";
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      workshop: "bg-blue-500/20 text-blue-400",
      hackathon: "bg-purple-500/20 text-purple-400",
      seminar: "bg-cyan-500/20 text-cyan-400",
      competition: "bg-orange-500/20 text-orange-400",
      webinar: "bg-pink-500/20 text-pink-400",
      bootcamp: "bg-indigo-500/20 text-indigo-400",
      conference: "bg-teal-500/20 text-teal-400",
      networking: "bg-amber-500/20 text-amber-400",
      "tech-talk": "bg-emerald-500/20 text-emerald-400",
      "coding-contest": "bg-red-500/20 text-red-400",
    };
    return colors[category] || "bg-neutral-500/20 text-neutral-400";
  };

  return (
    <section className="py-20 bg-black relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-neutral-950 via-black to-neutral-950" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-green-900/10 via-transparent to-transparent" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16 space-y-4"
        >
          <span className="inline-block px-4 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full text-green-400 text-sm font-medium mb-4">
            Featured Events
          </span>
          <h2 className="text-4xl md:text-5xl font-bold font-montserrat bg-clip-text text-transparent bg-gradient-to-r from-neutral-50 to-neutral-400">
            Don&apos;t Miss Out
          </h2>
          <p className="text-neutral-400 max-w-2xl mx-auto">
            Join our upcoming featured events and level up your skills
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {events.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative"
            >
              <div className="relative bg-neutral-900/50 backdrop-blur-sm border border-neutral-800 rounded-2xl overflow-hidden hover:border-green-500/30 transition-all duration-300">
                {/* Event Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={event.imageUrl}
                    alt={event.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/20 to-transparent" />
                  
                  {/* Status Badge */}
                  <div className="absolute top-3 right-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(event.registrationStatus)}`}>
                      {event.registrationStatus === "open" ? "Registration Open" : 
                       event.registrationStatus === "upcoming" ? "Coming Soon" : "Closed"}
                    </span>
                  </div>

                  {/* Category Badge */}
                  <div className="absolute top-3 left-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(event.category)}`}>
                      {event.category}
                    </span>
                  </div>
                </div>

                {/* Event Content */}
                <div className="p-5 space-y-4">
                  <h3 className="text-xl font-bold text-white group-hover:text-green-400 transition-colors line-clamp-1">
                    {event.title}
                  </h3>
                  
                  <p className="text-neutral-400 text-sm line-clamp-2">
                    {event.description}
                  </p>

                  {/* Event Details */}
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-neutral-400">
                      <Calendar className="h-4 w-4 text-green-500" />
                      <span>{event.date}</span>
                      {event.time && (
                        <>
                          <Clock className="h-4 w-4 text-green-500 ml-2" />
                          <span>{event.time}</span>
                        </>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-neutral-400">
                      <MapPin className="h-4 w-4 text-green-500" />
                      <span className="line-clamp-1">{event.location}</span>
                    </div>
                    {event.maxParticipants && (
                      <div className="flex items-center gap-2 text-neutral-400">
                        <Users className="h-4 w-4 text-green-500" />
                        <span>{event.maxParticipants} spots</span>
                      </div>
                    )}
                  </div>

                  {/* Tags */}
                  {event.tags && event.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {event.tags.slice(0, 3).map((tag, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 bg-neutral-800 text-neutral-400 rounded text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                      {event.tags.length > 3 && (
                        <span className="px-2 py-0.5 text-neutral-500 text-xs">
                          +{event.tags.length - 3} more
                        </span>
                      )}
                    </div>
                  )}

                  {/* Action Button */}
                  <div className="pt-2">
                    {event.externalLink ? (
                      <a
                        href={event.externalLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 rounded-lg text-green-400 text-sm font-medium transition-colors w-full justify-center"
                      >
                        Learn More
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    ) : (
                      <Link
                        href="/dashboard/events"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 rounded-lg text-green-400 text-sm font-medium transition-colors w-full justify-center"
                      >
                        View Details
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Events Link */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link
            href="/dashboard/events"
            className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 rounded-full text-neutral-300 hover:text-white font-medium transition-all"
          >
            View All Events
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
