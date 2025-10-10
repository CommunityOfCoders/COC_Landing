"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Calendar, 
  MapPin, 
  Users, 
  Clock, 
  Tag,
  CheckCircle,
  XCircle,
  UsersRound,
  User
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

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

interface EventDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event: Event;
  isRegistered: boolean;
  onRegister: (event: Event) => void;
  registering: boolean;
}

export function EventDetailsModal({
  open,
  onOpenChange,
  event,
  isRegistered,
  onRegister,
  registering,
}: EventDetailsModalProps) {
  const isOpen = typeof event.registrationstatus === 'string' 
    ? event.registrationstatus === 'open' 
    : event.registrationstatus;
  const isFull = event.participantcount >= event.maxparticipants;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto bg-neutral-950 border-neutral-800">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex-1">
              <DialogTitle className="text-2xl text-neutral-100 mb-2">
                {event.title}
              </DialogTitle>
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant="outline"
                  className={
                    isOpen
                      ? "border-green-500/50 text-green-400"
                      : "border-red-500/50 text-red-400"
                  }
                >
                  {isOpen ? (
                    <CheckCircle className="w-3 h-3 mr-1" />
                  ) : (
                    <XCircle className="w-3 h-3 mr-1" />
                  )}
                  {isOpen ? "Open" : "Closed"}
                </Badge>
                <Badge variant="outline" className="border-neutral-700 text-neutral-200">
                  {event.category}
                </Badge>
                {event.team_event && (
                  <Badge variant="outline" className="border-emerald-500/50 text-emerald-400">
                    <UsersRound className="w-3 h-3 mr-1" />
                    Team Event
                  </Badge>
                )}
                {isRegistered && (
                  <Badge variant="outline" className="border-blue-500/50 text-blue-400">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Registered
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </DialogHeader>

        {event.imageurl && (
          <div className="w-full h-48 rounded-lg overflow-hidden bg-neutral-900 mb-4">
            <img 
              src={event.imageurl} 
              alt={event.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="space-y-6">
          {/* Event Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center text-sm text-neutral-200">
              <Calendar className="w-4 h-4 mr-2 text-emerald-500" />
              {event.date || new Date(event.created_at).toLocaleDateString()}
            </div>
            <div className="flex items-center text-sm text-neutral-200">
              <Clock className="w-4 h-4 mr-2 text-emerald-500" />
              {event.time}
            </div>
            <div className="flex items-center text-sm text-neutral-200">
              <MapPin className="w-4 h-4 mr-2 text-emerald-500" />
              {event.location}
            </div>
            <div className="flex items-center text-sm text-neutral-200">
              <Users className="w-4 h-4 mr-2 text-emerald-500" />
              {event.participantcount} / {event.maxparticipants} registered
            </div>
            {event.team_event && (
              <div className="flex items-center text-sm text-emerald-400">
                <UsersRound className="w-4 h-4 mr-2" />
                Team Size: {event.min_team_size}-{event.max_team_size} members
              </div>
            )}
            <div className="flex items-center text-sm text-neutral-200">
              <User className="w-4 h-4 mr-2 text-emerald-500" />
              Organized by {event.organizer}
            </div>
          </div>

          <Separator className="bg-neutral-800" />

          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold text-neutral-100 mb-3">
              About this event
            </h3>
            <div className="prose prose-invert prose-sm max-w-none text-neutral-300 space-y-2">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ node, ...props }) => <h1 className="text-2xl font-bold text-neutral-100 mt-4 mb-2" {...props} />,
                  h2: ({ node, ...props }) => <h2 className="text-xl font-bold text-neutral-100 mt-3 mb-2" {...props} />,
                  h3: ({ node, ...props }) => <h3 className="text-lg font-semibold text-neutral-200 mt-2 mb-1" {...props} />,
                  p: ({ node, ...props }) => <p className="text-neutral-300 mb-2" {...props} />,
                  ul: ({ node, ...props }) => <ul className="list-disc list-inside text-neutral-300 space-y-1 mb-2" {...props} />,
                  ol: ({ node, ...props }) => <ol className="list-decimal list-inside text-neutral-300 space-y-1 mb-2" {...props} />,
                  li: ({ node, ...props }) => <li className="text-neutral-300" {...props} />,
                  a: ({ node, ...props }) => <a className="text-emerald-400 hover:text-emerald-300 underline" {...props} />,
                  code: ({ node, ...props }) => <code className="bg-neutral-800 px-1 py-0.5 rounded text-emerald-400 text-sm" {...props} />,
                  pre: ({ node, ...props }) => <pre className="bg-neutral-900 p-3 rounded-lg overflow-x-auto mb-2" {...props} />,
                  blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-emerald-500 pl-4 italic text-neutral-400 my-2" {...props} />,
                }}
              >
                {event.description}
              </ReactMarkdown>
            </div>
          </div>

          {/* Requirements */}
          {event.requirements && event.requirements.length > 0 && (
            <>
              <Separator className="bg-neutral-800" />
              <div>
                <h3 className="text-lg font-semibold text-neutral-100 mb-3">
                  Requirements
                </h3>
                <ul className="space-y-2">
                  {event.requirements.map((req, index) => (
                    <li key={index} className="flex items-start text-sm text-neutral-300">
                      <CheckCircle className="w-4 h-4 mr-2 text-emerald-500 mt-0.5 flex-shrink-0" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}

          {/* Tags */}
          {event.tags && event.tags.length > 0 && (
            <>
              <Separator className="bg-neutral-800" />
              <div>
                <h3 className="text-lg font-semibold text-neutral-100 mb-3 flex items-center">
                  <Tag className="w-4 h-4 mr-2" />
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {event.tags.map((tag, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="border-neutral-700 text-neutral-300"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}

          <Separator className="bg-neutral-800" />

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 border-neutral-800 text-neutral-200 hover:bg-neutral-900 hover:text-white"
            >
              Close
            </Button>
            <Button
              onClick={() => {
                onRegister(event);
                onOpenChange(false);
              }}
              disabled={!isOpen || isFull || registering || isRegistered}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white disabled:bg-neutral-800 disabled:text-neutral-500"
            >
              {registering
                ? "Registering..."
                : isRegistered
                ? "Already Registered"
                : isFull
                ? "Event Full"
                : !isOpen
                ? "Registration Closed"
                : event.team_event
                ? "Register Team"
                : "Register Now"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
