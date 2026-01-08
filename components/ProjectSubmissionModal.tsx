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
import { X, Plus, Loader2 } from "lucide-react";
import { ProjectCategory, ProjectSubmission } from "@/types/projects";
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session) {
      alert("You must be signed in to submit a project");
      return;
    }

    if (!formData.title || !formData.description || !formData.category || !formData.githubUrl) {
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
      <div className="fixed inset-0 z-50 flex items-center justify-center">
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
          className="mt-20 relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-black border border-green-500/20 rounded-lg shadow-2xl shadow-green-900/10"
        >
          {/* Header */}
          <div className="sticky top-0 bg-black border-b border-green-500/20 p-6 flex items-center justify-between z-10">
            <h2 className="text-2xl font-bold text-green-400">Submit Your Project</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-green-400 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="title" className="text-green-100">
                  Project Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="bg-zinc-900 border-green-500/20 text-white focus:border-green-500/50 focus:ring-green-500/20 placeholder:text-gray-500"
                  placeholder="My Awesome Project"
                  required
                />
              </div>

              <div>
                <Label htmlFor="category" className="text-green-100">
                  Category <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormData({ ...formData, category: value as ProjectCategory })
                  }
                >
                  <SelectTrigger className="bg-zinc-900 border-green-500/20 text-white focus:ring-green-500/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-green-500/20">
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value} className="text-white hover:bg-green-500/10 focus:bg-green-500/10 cursor-pointer">
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="description" className="text-green-100">
                  Short Description <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="bg-zinc-900 border-green-500/20 text-white min-h-[80px] focus:border-green-500/50 focus:ring-green-500/20 placeholder:text-gray-500"
                  placeholder="A brief description of your project (max 200 characters)"
                  maxLength={200}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.description.length}/200 characters
                </p>
              </div>

              <div>
                <Label htmlFor="fullDescription" className="text-green-100">
                  Full Description
                </Label>
                <Textarea
                  id="fullDescription"
                  value={formData.fullDescription}
                  onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                  className="bg-zinc-900 border-green-500/20 text-white min-h-[120px] focus:border-green-500/50 focus:ring-green-500/20 placeholder:text-gray-500"
                  placeholder="Detailed description of your project, features, technologies used, etc."
                />
              </div>
            </div>

            {/* Links */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-green-400">Project Links</h3>
              
              <div>
                <Label htmlFor="githubUrl" className="text-green-100">
                  GitHub URL <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="githubUrl"
                  type="url"
                  value={formData.githubUrl}
                  onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                  className="bg-zinc-900 border-green-500/20 text-white focus:border-green-500/50 focus:ring-green-500/20 placeholder:text-gray-500"
                  placeholder="https://github.com/username/repo"
                  required
                />
              </div>

              <div>
                <Label htmlFor="liveUrl" className="text-green-100">Live Demo URL</Label>
                <Input
                  id="liveUrl"
                  type="url"
                  value={formData.liveUrl}
                  onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                  className="bg-zinc-900 border-green-500/20 text-white focus:border-green-500/50 focus:ring-green-500/20 placeholder:text-gray-500"
                  placeholder="https://your-project.com"
                />
              </div>

              <div>
                <Label htmlFor="videoUrl" className="text-green-100">Video Demo URL</Label>
                <Input
                  id="videoUrl"
                  type="url"
                  value={formData.videoUrl}
                  onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                  className="bg-zinc-900 border-green-500/20 text-white focus:border-green-500/50 focus:ring-green-500/20 placeholder:text-gray-500"
                  placeholder="https://youtube.com/watch?v=..."
                />
              </div>

              <div>
                <Label htmlFor="imageUrl" className="text-green-100">Project Image URL</Label>
                <Input
                  id="imageUrl"
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="bg-zinc-900 border-green-500/20 text-white focus:border-green-500/50 focus:ring-green-500/20 placeholder:text-gray-500"
                  placeholder="https://example.com/image.png"
                />
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-green-400">Tags</h3>
              <div className="flex gap-2">
                <Input
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
                  className="bg-zinc-900 border-green-500/20 text-white flex-1 focus:border-green-500/50 focus:ring-green-500/20 placeholder:text-gray-500"
                  placeholder="Add a tag (e.g., React, Python, AI)"
                />
                <Button
                  type="button"
                  onClick={handleAddTag}
                  variant="outline"
                  className="border-green-500/20 bg-green-500/10 hover:bg-green-500/20 text-green-400 hover:text-green-300"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, i) => (
                  <Badge key={i} variant="secondary" className="bg-green-900/30 text-green-300 border border-green-500/20">
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-2 hover:text-red-400 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-4 border-t border-green-500/20">
              <Button
                type="button"
                onClick={onClose}
                variant="outline"
                className="flex-1 border-green-500/20 bg-transparent text-gray-400 hover:text-white hover:bg-zinc-900"
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white"
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