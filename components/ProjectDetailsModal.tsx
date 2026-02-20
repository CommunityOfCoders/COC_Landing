"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Github, ExternalLink, Video, Heart, Eye, Users, Calendar, Terminal } from "lucide-react";
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
          className="absolute inset-0 bg-black/90 backdrop-blur-md"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative mt-10 w-full max-w-4xl max-h-[85vh] overflow-y-auto bg-black border border-green-500/20 rounded-xl shadow-[0_0_50px_-12px_rgba(16,185,129,0.2)] scrollbar-thin scrollbar-thumb-green-900 scrollbar-track-black"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 text-gray-400 hover:text-green-400 transition-colors bg-black/60 backdrop-blur-md border border-white/10 hover:border-green-500/50 rounded-full p-2 group"
          >
            <X className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
          </button>

          {/* Image Section */}
          <div className="relative w-full h-64 md:h-96 group">
            {project.imageUrl ? (
              <img
                src={project.imageUrl}
                alt={project.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-zinc-900 flex items-center justify-center">
                <Terminal className="h-20 w-20 text-green-900" />
              </div>
            )}
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-90" />
            
            {/* Floating Title on Image (Desktop) */}
            <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <motion.h2 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-3xl md:text-5xl font-bold text-white mb-2 tracking-tight"
                  >
                    {project.title}
                  </motion.h2>
                  <div className="flex flex-wrap gap-2 items-center">
                     {project.isFeatured && (
                      <Badge className="bg-yellow-500/10 text-yellow-400 border-yellow-500/20 hover:bg-yellow-500/20">
                        Featured
                      </Badge>
                    )}
                    <Badge variant="outline" className="bg-green-500/10 border-green-500/20 text-green-400 backdrop-blur-sm">
                      {project.category.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 md:p-8 space-y-8 relative">
            
            {/* Stats Row */}
            <div className="flex items-center gap-6 text-sm text-gray-400 border-b border-white/10 pb-6">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-green-500" />
                <span>{new Date(project.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-green-500" />
                <span>{project.viewsCount} views</span>
              </div>
              <button
                onClick={() => onLike(project.id)}
                className="flex items-center gap-2 hover:text-green-400 transition-colors group"
              >
                <Heart className={`h-4 w-4 transition-all ${isLiked ? 'fill-green-500 text-green-500' : 'group-hover:text-green-500'}`} />
                <span>{project.likesCount} likes</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Main Column */}
              <div className="md:col-span-2 space-y-8">
                {/* Description */}
                <div>
                  <h3 className="text-xl font-semibold text-green-400 mb-4 flex items-center gap-2">
                    <span className="w-1 h-6 bg-green-500 rounded-full"></span>
                    About Project
                  </h3>
                  <div className="prose prose-invert max-w-none text-gray-300 leading-relaxed whitespace-pre-wrap font-light">
                    {project.fullDescription || project.description}
                  </div>
                </div>

                 {/* Tags */}
                 <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    Technologies
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag, i) => (
                      <Badge 
                        key={i} 
                        variant="secondary" 
                        className="bg-zinc-900 text-gray-300 border border-white/10 hover:border-green-500/30 transition-colors"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Additional Images (Gallery) */}
                {project.additionalImages && project.additionalImages.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold text-green-400 mb-4 flex items-center gap-2">
                      <span className="w-1 h-6 bg-green-500 rounded-full"></span>
                      Gallery
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {project.additionalImages.map((img, i) => (
                        <div key={i} className="aspect-video overflow-hidden rounded-lg border border-white/10 group/img cursor-pointer">
                          <img
                            src={img}
                            alt={`${project.title} - Image ${i + 1}`}
                            className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-500"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar Column */}
              <div className="space-y-6">
                {/* Action Buttons */}
                <div className="flex flex-col gap-3 p-4 rounded-xl bg-zinc-900/50 border border-white/5">
                  {project.liveUrl && (
                    <Button
                      onClick={() => window.open(project.liveUrl, '_blank')}
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-semibold shadow-lg shadow-green-900/20"
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Live Demo
                    </Button>
                  )}
                  {project.githubUrl && (
                    <Button
                      onClick={() => window.open(project.githubUrl, '_blank')}
                      className="w-full bg-zinc-900 hover:bg-zinc-800 border border-white/10 hover:border-green-500/50 text-white transition-all"
                    >
                      <Github className="mr-2 h-4 w-4" />
                      View Source
                    </Button>
                  )}
                  {project.videoUrl && (
                    <Button
                      onClick={() => window.open(project.videoUrl, '_blank')}
                      variant="outline"
                      className="w-full border-white/10 hover:bg-zinc-800 text-gray-300 hover:text-white"
                    >
                      <Video className="mr-2 h-4 w-4" />
                      Watch Demo
                    </Button>
                  )}
                </div>

                {/* Creator Info */}
                <div className="p-5 rounded-xl bg-zinc-900/50 border border-white/5 space-y-4">
                  <div>
                    <h3 className="text-xs font-semibold text-green-500 uppercase tracking-wider mb-2">Created By</h3>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-800 flex items-center justify-center text-white font-bold text-lg shadow-inner">
                        {project.submitterName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-white font-medium">{project.submitterName}</p>
                        {(project.submitterYear || project.submitterBranch) && (
                          <p className="text-xs text-gray-400">
                            {project.submitterBranch} {project.submitterYear ? `• ${project.submitterYear}` : ''}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}