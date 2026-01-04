"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Github, ExternalLink, Video, Heart, Eye, Users, Calendar } from "lucide-react";
import { Project } from "@/types/projects";

interface ProjectDetailsModalProps {
  project: Project;
  open: boolean;
  onClose: () => void;
  isLiked: boolean;
  onLike: (projectId: string) => void;
}

export default function ProjectDetailsModal({
  project,
  open,
  onClose,
  isLiked,
  onLike,
}: ProjectDetailsModalProps) {
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
          className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-900 border border-gray-800 rounded-lg shadow-2xl"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 text-gray-400 hover:text-white transition-colors bg-gray-900/80 rounded-full p-2"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Image */}
          {project.imageUrl && (
            <div className="w-full h-64 md:h-96 overflow-hidden">
              <img
                src={project.imageUrl}
                alt={project.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Content */}
          <div className="p-6 md:p-8 space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-start justify-between gap-4 mb-3">
                <h2 className="text-3xl md:text-4xl font-bold text-white">
                  {project.title}
                </h2>
                {project.isFeatured && (
                  <Badge className="bg-yellow-500/90 text-black border-none">
                    Featured
                  </Badge>
                )}
              </div>

              {/* Category & Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="outline" className="border-purple-500 text-purple-400">
                  {project.category.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                </Badge>
                {project.tags.map((tag, i) => (
                  <Badge key={i} variant="secondary" className="bg-gray-800 text-gray-300">
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  <span>{project.viewsCount} views</span>
                </div>
                <button
                  onClick={() => onLike(project.id)}
                  className="flex items-center gap-1 hover:text-red-400 transition-colors"
                >
                  <Heart className={`h-4 w-4 ${isLiked ? 'fill-red-400 text-red-400' : ''}`} />
                  <span>{project.likesCount} likes</span>
                </button>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-3">About</h3>
              <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                {project.fullDescription || project.description}
              </p>
            </div>

            {/* Team Info */}
            {project.teamName && (
              <div>
                <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Team: {project.teamName}
                </h3>
                {project.teamMembers && project.teamMembers.length > 0 && (
                  <div className="space-y-2">
                    {project.teamMembers.map((member, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 bg-gray-800/50 p-3 rounded-lg"
                      >
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                          {member.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-white font-medium">{member.name}</p>
                          {member.role && (
                            <p className="text-sm text-gray-400">{member.role}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Creator Info */}
            <div className="bg-gray-800/50 p-4 rounded-lg">
              <h3 className="text-sm font-semibold text-gray-400 mb-2">Created By</h3>
              <p className="text-white font-medium">{project.submitterName}</p>
              {project.submitterYear && project.submitterBranch && (
                <p className="text-sm text-gray-400">
                  {project.submitterBranch} • Year {project.submitterYear}
                </p>
              )}
            </div>

            {/* Additional Images */}
            {project.additionalImages && project.additionalImages.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">Gallery</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {project.additionalImages.map((img, i) => (
                    <div key={i} className="aspect-video overflow-hidden rounded-lg">
                      <img
                        src={img}
                        alt={`${project.title} - Image ${i + 1}`}
                        className="w-full h-full object-cover hover:scale-110 transition-transform"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-800">
              {project.githubUrl && (
                <Button
                  onClick={() => window.open(project.githubUrl, '_blank')}
                  className="flex-1 bg-gray-800 hover:bg-gray-700 border border-gray-700"
                >
                  <Github className="mr-2 h-5 w-5" />
                  View Code
                </Button>
              )}
              {project.liveUrl && (
                <Button
                  onClick={() => window.open(project.liveUrl, '_blank')}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                >
                  <ExternalLink className="mr-2 h-5 w-5" />
                  Live Demo
                </Button>
              )}
              {project.videoUrl && (
                <Button
                  onClick={() => window.open(project.videoUrl, '_blank')}
                  variant="outline"
                  className="flex-1 border-gray-700"
                >
                  <Video className="mr-2 h-5 w-5" />
                  Watch Demo
                </Button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
