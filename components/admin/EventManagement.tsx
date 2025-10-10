"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Calendar, 
  MapPin, 
  Users, 
  Edit, 
  Trash2, 
  Clock,
  Tag,
  X,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { Event, EventWithStats, EventFormData } from "@/types/events";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface EventManagementProps {
  events: EventWithStats[];
  onCreateEvent: (event: Event) => void;
  onUpdateEvent: (eventId: string, updates: Partial<Event>) => void;
  onDeleteEvent: (eventId: string) => void;
}

export default function EventManagement({
  events,
  onCreateEvent,
  onUpdateEvent,
  onDeleteEvent
}: EventManagementProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<string | null>(null);
  const [formData, setFormData] = useState<EventFormData>({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    maxParticipants: 100,
    category: "workshop",
    tags: [],
    requirements: [],
    teamEvent: false,
    maxTeamSize: 1,
    minTeamSize: 1
  });
  const [newTag, setNewTag] = useState("");
  const [newRequirement, setNewRequirement] = useState("");
  const [expandedDescriptions, setExpandedDescriptions] = useState<Set<string>>(new Set());

  const toggleDescription = (eventId: string) => {
    setExpandedDescriptions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(eventId)) {
        newSet.delete(eventId);
      } else {
        newSet.add(eventId);
      }
      return newSet;
    });
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      date: "",
      time: "",
      location: "",
      maxParticipants: 100,
      category: "workshop",
      tags: [],
      requirements: [],
      teamEvent: false,
      maxTeamSize: 1,
      minTeamSize: 1
    });
    setNewTag("");
    setNewRequirement("");
    setShowCreateForm(false);
    setEditingEvent(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const eventData: Event = {
      id: editingEvent || "",
      title: formData.title,
      description: formData.description,
      date: formData.date,
      time: formData.time,
      location: formData.location,
      maxParticipants: formData.maxParticipants,
      registrationStatus: "upcoming",
      category: formData.category,
      organizer: "Admin",
      tags: formData.tags,
      requirements: formData.requirements,
      imageUrl: formData.imageUrl,
      createdAt: "",
      updatedAt: "",
      teamEvent: formData.teamEvent,
      maxTeamSize: formData.maxTeamSize,
      minTeamSize: formData.minTeamSize
    };

    if (editingEvent) {
      onUpdateEvent(editingEvent, eventData);
    } else {
      onCreateEvent(eventData);
    }
    
    resetForm();
  };

  const handleEdit = (event: EventWithStats) => {
    setFormData({
      title: event.title,
      description: event.description,
      date: event.date,
      time: event.time || "",
      location: event.location,
      maxParticipants: event.maxParticipants || 100,
      category: event.category,
      tags: event.tags,
      requirements: event.requirements || [],
      imageUrl: event.imageUrl,
      teamEvent: event.teamEvent || false,
      maxTeamSize: event.maxTeamSize || 1,
      minTeamSize: event.minTeamSize || 1
    });
    setEditingEvent(event.id);
    setShowCreateForm(true);
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const addRequirement = () => {
    if (newRequirement.trim() && !formData.requirements.includes(newRequirement.trim())) {
      setFormData(prev => ({
        ...prev,
        requirements: [...prev.requirements, newRequirement.trim()]
      }));
      setNewRequirement("");
    }
  };

  const removeRequirement = (reqToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.filter(req => req !== reqToRemove)
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-neutral-200">Event Management</h2>
          <p className="text-neutral-400 text-sm mt-1">Create and manage community events</p>
        </div>
        <Button
          onClick={() => setShowCreateForm(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Event
        </Button>
      </div>

      {/* Create/Edit Form */}
      {showCreateForm && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="bg-neutral-900/50 border-neutral-800/50">
            <CardHeader>
              <CardTitle className="text-neutral-200">
                {editingEvent ? "Edit Event" : "Create New Event"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-2">
                      Event Title
                    </label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter event title"
                      className="bg-neutral-800/50 border-neutral-700 text-neutral-200"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-2">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as Event['category'] }))}
                      className="w-full p-2 rounded-md bg-neutral-800/50 border border-neutral-700 text-neutral-200"
                      required
                    >
                      <option value="workshop">Workshop</option>
                      <option value="hackathon">Hackathon</option>
                      <option value="seminar">Seminar</option>
                      <option value="competition">Competition</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    Description (Markdown supported)
                  </label>
                  <Textarea
                    value={formData.description}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe the event. You can use markdown formatting:\n\n**Bold** *Italic* `Code`\n- Lists\n- More items\n\n[Links](https://example.com)"
                    className="bg-neutral-800/50 border-neutral-700 text-neutral-200 font-mono text-sm"
                    rows={8}
                    required
                  />
                  <p className="text-xs text-neutral-500 mt-1">Supports markdown: **bold**, *italic*, lists, links, code blocks, etc.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-2">
                      Date
                    </label>
                    <Input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                      className="bg-neutral-800/50 border-neutral-700 text-neutral-200"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-2">
                      Time
                    </label>
                    <Input
                      type="time"
                      value={formData.time}
                      onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                      className="bg-neutral-800/50 border-neutral-700 text-neutral-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-2">
                      Max Participants
                    </label>
                    <Input
                      type="number"
                      value={formData.maxParticipants}
                      onChange={(e) => setFormData(prev => ({ ...prev, maxParticipants: parseInt(e.target.value) }))}
                      className="bg-neutral-800/50 border-neutral-700 text-neutral-200"
                      min="1"
                    />
                  </div>
                </div>

                {/* Team Event Settings */}
                <Card className="bg-neutral-800/30 border-neutral-700/50">
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="block text-sm font-medium text-neutral-300 mb-1">
                            Team Event
                          </label>
                          <p className="text-xs text-neutral-500">
                            Enable if participants need to register as teams
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.teamEvent}
                            onChange={(e) => setFormData(prev => ({ ...prev, teamEvent: e.target.checked }))}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-neutral-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-emerald-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                        </label>
                      </div>

                      {formData.teamEvent && (
                        <div className="grid grid-cols-2 gap-4 pt-2">
                          <div>
                            <label className="block text-sm font-medium text-neutral-300 mb-2">
                              Min Team Size
                            </label>
                            <Input
                              type="number"
                              value={formData.minTeamSize}
                              onChange={(e) => setFormData(prev => ({ 
                                ...prev, 
                                minTeamSize: Math.max(1, parseInt(e.target.value) || 1)
                              }))}
                              className="bg-neutral-800/50 border-neutral-700 text-neutral-200"
                              min="1"
                              max={formData.maxTeamSize}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-neutral-300 mb-2">
                              Max Team Size
                            </label>
                            <Input
                              type="number"
                              value={formData.maxTeamSize}
                              onChange={(e) => setFormData(prev => ({ 
                                ...prev, 
                                maxTeamSize: Math.max(prev.minTeamSize || 1, parseInt(e.target.value) || 1)
                              }))}
                              className="bg-neutral-800/50 border-neutral-700 text-neutral-200"
                              min={formData.minTeamSize}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    Location
                  </label>
                  <Input
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="Virtual / Physical location"
                    className="bg-neutral-800/50 border-neutral-700 text-neutral-200"
                    required
                  />
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    Tags
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="bg-emerald-500/20 text-emerald-300">
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-2 hover:bg-red-500/20 rounded-full p-1"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Add a tag"
                      className="bg-neutral-800/50 border-neutral-700 text-neutral-200"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    />
                    <Button type="button" onClick={addTag} variant="outline">
                      <Tag className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Requirements */}
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    Requirements
                  </label>
                  <div className="space-y-2 mb-2">
                    {formData.requirements.map((req, index) => (
                      <div key={index} className="flex items-center justify-between bg-neutral-800/30 p-2 rounded">
                        <span className="text-neutral-300 text-sm">{req}</span>
                        <button
                          type="button"
                          onClick={() => removeRequirement(req)}
                          className="text-red-400 hover:bg-red-500/20 rounded p-1"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={newRequirement}
                      onChange={(e) => setNewRequirement(e.target.value)}
                      placeholder="Add a requirement"
                      className="bg-neutral-800/50 border-neutral-700 text-neutral-200"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addRequirement())}
                    />
                    <Button type="button" onClick={addRequirement} variant="outline">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button type="button" onClick={resetForm} variant="outline">
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                    {editingEvent ? "Update Event" : "Create Event"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Events List */}
      <div className="space-y-4">
        {events.length > 0 ? (
          events.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="bg-neutral-900/50 border-neutral-800/50 hover:bg-neutral-800/30 transition-all">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-neutral-200">{event.title}</h3>
                        <select
                          value={event.registrationStatus}
                          onChange={(e) => onUpdateEvent(event.id, { registrationStatus: e.target.value as Event['registrationStatus'] })}
                          className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer border-0 ${
                            event.registrationStatus === 'open' 
                              ? 'bg-emerald-500/20 text-emerald-300' 
                              : event.registrationStatus === 'upcoming'
                              ? 'bg-blue-500/20 text-blue-300'
                              : 'bg-gray-500/20 text-gray-300'
                          }`}
                        >
                          <option value="upcoming">upcoming</option>
                          <option value="open">open</option>
                          <option value="closed">closed</option>
                        </select>
                        <Badge variant="outline" className="border-neutral-600 text-neutral-300">
                          {event.category}
                        </Badge>
                      </div>
                      
                      {/* Description with Markdown */}
                      <div className="mb-4">
                        <div className={`prose prose-invert prose-sm max-w-none text-neutral-300 overflow-hidden transition-all ${
                          expandedDescriptions.has(event.id) ? 'max-h-none' : 'max-h-20'
                        }`}>
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                              h1: ({ node, ...props }) => <h1 className="text-xl font-bold text-neutral-100 mt-3 mb-2" {...props} />,
                              h2: ({ node, ...props }) => <h2 className="text-lg font-bold text-neutral-100 mt-2 mb-1" {...props} />,
                              h3: ({ node, ...props }) => <h3 className="text-base font-semibold text-neutral-200 mt-2 mb-1" {...props} />,
                              p: ({ node, ...props }) => <p className="text-neutral-300 mb-1" {...props} />,
                              ul: ({ node, ...props }) => <ul className="list-disc list-inside text-neutral-300 space-y-1 mb-1" {...props} />,
                              ol: ({ node, ...props }) => <ol className="list-decimal list-inside text-neutral-300 space-y-1 mb-1" {...props} />,
                              li: ({ node, ...props }) => <li className="text-neutral-300" {...props} />,
                              a: ({ node, ...props }) => <a className="text-emerald-400 hover:text-emerald-300 underline" {...props} />,
                              code: ({ node, ...props }) => <code className="bg-neutral-800 px-1 py-0.5 rounded text-emerald-400 text-xs" {...props} />,
                              pre: ({ node, ...props }) => <pre className="bg-neutral-900 p-2 rounded overflow-x-auto mb-1" {...props} />,
                            }}
                          >
                            {event.description}
                          </ReactMarkdown>
                        </div>
                        {event.description.length > 150 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleDescription(event.id)}
                            className="text-emerald-400 hover:text-emerald-300 hover:bg-neutral-800/50 mt-2 p-1 h-auto"
                          >
                            {expandedDescriptions.has(event.id) ? (
                              <>
                                <ChevronUp className="w-4 h-4 mr-1" />
                                Show less
                              </>
                            ) : (
                              <>
                                <ChevronDown className="w-4 h-4 mr-1" />
                                Show more
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-neutral-400">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(event.date).toLocaleDateString()}</span>
                          {event.time && (
                            <>
                              <Clock className="w-4 h-4 ml-2" />
                              <span>{event.time}</span>
                            </>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4" />
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4" />
                          <span>
                            {event.participantCount}
                            {event.maxParticipants && ` / ${event.maxParticipants}`} participants
                          </span>
                        </div>
                      </div>
                      
                      {event.teamEvent && (
                        <div className="mt-3 p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-md">
                          <div className="flex items-center space-x-2 text-sm text-emerald-300">
                            <Users className="w-4 h-4" />
                            <span className="font-medium">Team Event</span>
                            <span className="text-neutral-400">•</span>
                            <span className="text-neutral-300">
                              {event.minTeamSize}-{event.maxTeamSize} members per team
                            </span>
                          </div>
                        </div>
                      )}
                      
                      {event.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-4">
                          {event.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="bg-neutral-800/50 text-neutral-300">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex space-x-2 ml-4">
                      <Button
                        onClick={() => handleEdit(event)}
                        variant="outline"
                        size="sm"
                        className="border-neutral-700 text-neutral-200 hover:bg-neutral-800 hover:text-white"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => onDeleteEvent(event.id)}
                        variant="outline"
                        size="sm"
                        className="border-red-700 text-red-400 hover:bg-red-500/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        ) : (
          <Card className="bg-neutral-900/50 border-neutral-800/50">
            <CardContent className="py-12 text-center">
              <Calendar className="w-16 h-16 mx-auto mb-4 text-neutral-600" />
              <h3 className="text-lg font-medium text-neutral-300 mb-2">No events yet</h3>
              <p className="text-neutral-400 mb-4">Create your first event to get started</p>
              <Button
                onClick={() => setShowCreateForm(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Event
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}