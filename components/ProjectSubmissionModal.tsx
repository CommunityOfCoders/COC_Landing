"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, Plus, Trash2, Loader2 } from "lucide-react";
import { ProjectCategory, ProjectSubmission, TeamMember } from "@/types/projects";
import { submitProject } from "@/app/actions/projects";

interface ProjectSubmissionModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ProjectSubmissionModal({
  open,
  onClose,
  onSuccess,
}: ProjectSubmissionModalProps) {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [currentTag, setCurrentTag] = useState("");
  const [formData, setFormData] = useState<ProjectSubmission>({
    title: "",
    description: "",
    fullDescription: "",
    category: "web-development",
    tags: [],
    githubUrl: "",
    liveUrl: "",
    videoUrl: "",
    imageUrl: "",
    additionalImages: [],
    teamName: "",
    teamMembers: [],
  });

  const [currentMember, setCurrentMember] = useState<TeamMember>({
    name: "",
    role: "",
    email: "",
  });

  const categories: { value: ProjectCategory; label: string }[] = [
    { value: "web-development", label: "Web Development" },
    { value: "app-development", label: "App Development" },
    { value: "machine-learning", label: "Machine Learning" },
    { value: "ai", label: "Artificial Intelligence" },
    { value: "blockchain", label: "Blockchain" },
    { value: "iot", label: "IoT" },
    { value: "game-development", label: "Game Development" },
    { value: "data-science", label: "Data Science" },
    { value: "cybersecurity", label: "Cybersecurity" },
    { value: "other", label: "Other" },
  ];

  const handleAddTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, currentTag.trim()],
      });
      setCurrentTag("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((t) => t !== tag),
    });
  };

  const handleAddTeamMember = () => {
    if (currentMember.name.trim() && currentMember.email.trim()) {
      setFormData({
        ...formData,
        teamMembers: [...(formData.teamMembers || []), currentMember],
      });
      setCurrentMember({ name: "", role: "", email: "" });
    }
  };

  const handleRemoveTeamMember = (index: number) => {
    setFormData({
      ...formData,
      teamMembers: formData.teamMembers?.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session) {
      alert("You must be signed in to submit a project");
      return;
    }

    if (!formData.title || !formData.description || !formData.category) {
      alert("Please fill in all required fields");
      return;
    }

    setLoading(true);
    const result = await submitProject(formData);
    setLoading(false);

    if (result.success) {
      alert("Project submitted successfully! It will be reviewed by admins.");
      onSuccess();
      // Reset form
      setFormData({
        title: "",
        description: "",
        fullDescription: "",
        category: "web-development",
        tags: [],
        githubUrl: "",
        liveUrl: "",
        videoUrl: "",
        imageUrl: "",
        additionalImages: [],
        teamName: "",
        teamMembers: [],
      });
    } else {
      alert(`Error: ${result.error}`);
    }
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-gray-900 border border-gray-800 rounded-lg shadow-2xl"
        >
          {/* Header */}
          <div className="sticky top-0 bg-gray-900 border-b border-gray-800 p-6 flex items-center justify-between z-10">
            <h2 className="text-2xl font-bold text-white">Submit Your Project</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="title" className="text-white">
                  Project Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="bg-gray-800 border-gray-700 text-white"
                  placeholder="My Awesome Project"
                  required
                />
              </div>

              <div>
                <Label htmlFor="category" className="text-white">
                  Category <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormData({ ...formData, category: value as ProjectCategory })
                  }
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value} className="text-white">
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="description" className="text-white">
                  Short Description <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="bg-gray-800 border-gray-700 text-white min-h-[80px]"
                  placeholder="A brief description of your project (max 200 characters)"
                  maxLength={200}
                  required
                />
                <p className="text-xs text-gray-400 mt-1">
                  {formData.description.length}/200 characters
                </p>
              </div>

              <div>
                <Label htmlFor="fullDescription" className="text-white">
                  Full Description
                </Label>
                <Textarea
                  id="fullDescription"
                  value={formData.fullDescription}
                  onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                  className="bg-gray-800 border-gray-700 text-white min-h-[120px]"
                  placeholder="Detailed description of your project, features, technologies used, etc."
                />
              </div>
            </div>

            {/* Links */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Project Links</h3>
              
              <div>
                <Label htmlFor="githubUrl" className="text-white">GitHub URL</Label>
                <Input
                  id="githubUrl"
                  type="url"
                  value={formData.githubUrl}
                  onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                  className="bg-gray-800 border-gray-700 text-white"
                  placeholder="https://github.com/username/repo"
                />
              </div>

              <div>
                <Label htmlFor="liveUrl" className="text-white">Live Demo URL</Label>
                <Input
                  id="liveUrl"
                  type="url"
                  value={formData.liveUrl}
                  onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                  className="bg-gray-800 border-gray-700 text-white"
                  placeholder="https://your-project.com"
                />
              </div>

              <div>
                <Label htmlFor="videoUrl" className="text-white">Video Demo URL</Label>
                <Input
                  id="videoUrl"
                  type="url"
                  value={formData.videoUrl}
                  onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                  className="bg-gray-800 border-gray-700 text-white"
                  placeholder="https://youtube.com/watch?v=..."
                />
              </div>

              <div>
                <Label htmlFor="imageUrl" className="text-white">Project Image URL</Label>
                <Input
                  id="imageUrl"
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="bg-gray-800 border-gray-700 text-white"
                  placeholder="https://example.com/image.png"
                />
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Tags</h3>
              <div className="flex gap-2">
                <Input
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
                  className="bg-gray-800 border-gray-700 text-white flex-1"
                  placeholder="Add a tag (e.g., React, Python, AI)"
                />
                <Button
                  type="button"
                  onClick={handleAddTag}
                  variant="outline"
                  className="border-gray-700"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, i) => (
                  <Badge key={i} variant="secondary" className="bg-gray-800 text-gray-300">
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-2 hover:text-red-400"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            {/* Team Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Team Information (Optional)</h3>
              
              <div>
                <Label htmlFor="teamName" className="text-white">Team Name</Label>
                <Input
                  id="teamName"
                  value={formData.teamName}
                  onChange={(e) => setFormData({ ...formData, teamName: e.target.value })}
                  className="bg-gray-800 border-gray-700 text-white"
                  placeholder="Team Awesome"
                />
              </div>

              <div className="space-y-3">
                <Label className="text-white">Team Members</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <Input
                    value={currentMember.name}
                    onChange={(e) => setCurrentMember({ ...currentMember, name: e.target.value })}
                    className="bg-gray-800 border-gray-700 text-white"
                    placeholder="Member Name"
                  />
                  <Input
                    value={currentMember.role}
                    onChange={(e) => setCurrentMember({ ...currentMember, role: e.target.value })}
                    className="bg-gray-800 border-gray-700 text-white"
                    placeholder="Role (optional)"
                  />
                  <div className="flex gap-2">
                    <Input
                      type="email"
                      value={currentMember.email}
                      onChange={(e) => setCurrentMember({ ...currentMember, email: e.target.value })}
                      className="bg-gray-800 border-gray-700 text-white flex-1"
                      placeholder="Email"
                    />
                    <Button
                      type="button"
                      onClick={handleAddTeamMember}
                      variant="outline"
                      className="border-gray-700"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {formData.teamMembers && formData.teamMembers.length > 0 && (
                  <div className="space-y-2 mt-3">
                    {formData.teamMembers.map((member, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between bg-gray-800 p-3 rounded-lg"
                      >
                        <div className="text-sm text-white">
                          <span className="font-semibold">{member.name}</span>
                          {member.role && <span className="text-gray-400"> - {member.role}</span>}
                          <div className="text-gray-400 text-xs">{member.email}</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveTeamMember(i)}
                          className="text-red-400 hover:text-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-4 border-t border-gray-800">
              <Button
                type="button"
                onClick={onClose}
                variant="outline"
                className="flex-1 border-gray-700"
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Project"
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
