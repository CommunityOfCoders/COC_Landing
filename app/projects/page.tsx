"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ExternalLink, Github, Video, Heart, Eye, Plus, Filter,
  Code2, Smartphone, Brain, Link2, Gamepad2, Shield, Database
} from "lucide-react";
import { Project, ProjectCategory } from "@/types/projects";
import { getApprovedProjects, toggleProjectLike, hasUserLikedProject } from "@/app/actions/projects";
import ProjectSubmissionModal from "@/components/ProjectSubmissionModal";
import ProjectDetailsModal from "@/components/ProjectDetailsModal";
import Navbar from "@/components/Navbar";

const categoryIcons: Record<ProjectCategory, any> = {
  'web-development': Code2,
  'app-development': Smartphone,
  'machine-learning': Brain,
  'blockchain': Link2,
  'iot': Shield,
  'game-development': Gamepad2,
  'ai': Brain,
  'data-science': Database,
  'cybersecurity': Shield,
  'other': Code2,
};

const categoryColors: Record<ProjectCategory, string> = {
  'web-development': 'from-blue-500 to-cyan-500',
  'app-development': 'from-indigo-500 to-purple-600',
  'machine-learning': 'from-purple-500 to-pink-500',
  'blockchain': 'from-orange-500 to-red-500',
  'iot': 'from-green-500 to-emerald-500',
  'game-development': 'from-violet-500 to-purple-500',
  'ai': 'from-pink-500 to-rose-500',
  'data-science': 'from-cyan-500 to-blue-500',
  'cybersecurity': 'from-red-500 to-orange-500',
  'other': 'from-gray-500 to-slate-500',
};

export default function ProjectsShowcase() {
  const { data: session } = useSession();
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [submissionModalOpen, setSubmissionModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [likedProjects, setLikedProjects] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (selectedCategory === "all") {
      setFilteredProjects(projects);
    } else if (selectedCategory === "featured") {
      setFilteredProjects(projects.filter(p => p.isFeatured));
    } else {
      setFilteredProjects(projects.filter(p => p.category === selectedCategory));
    }
  }, [selectedCategory, projects]);

  const fetchProjects = async () => {
    setLoading(true);
    const result = await getApprovedProjects();
    if (result.success) {
      setProjects(result.data);
      setFilteredProjects(result.data);
      
      // Check which projects are liked by user
      if (session?.user?.email) {
        const liked = new Set<string>();
        for (const project of result.data) {
          const likeResult = await hasUserLikedProject(project.id);
          if (likeResult.success && likeResult.data) {
            liked.add(project.id);
          }
        }
        setLikedProjects(liked);
      }
    }
    setLoading(false);
  };

  const handleLike = async (projectId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!session) {
      alert("Please sign in to like projects");
      return;
    }

    const result = await toggleProjectLike(projectId);
    if (result.success) {
      // Update local state
      setProjects(projects.map(p => 
        p.id === projectId ? { ...p, likesCount: result.data.likesCount } : p
      ));
      
      // Update liked projects set
      setLikedProjects(prev => {
        const newSet = new Set(prev);
        if (result.data.liked) {
          newSet.add(projectId);
        } else {
          newSet.delete(projectId);
        }
        return newSet;
      });
    }
  };

  const categories = [
    { value: "all", label: "All Projects" },
    { value: "featured", label: "Featured" },
    { value: "web-development", label: "Web Dev" },
    { value: "app-development", label: "App Dev" },
    { value: "machine-learning", label: "ML" },
    { value: "ai", label: "AI" },
    { value: "blockchain", label: "Blockchain" },
    { value: "iot", label: "IoT" },
    { value: "game-development", label: "Game Dev" },
    { value: "data-science", label: "Data Science" },
    { value: "cybersecurity", label: "Cybersecurity" },
  ];

  return (
    <div className="min-h-screen bg-neutral-950">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-green-900/20 via-emerald-900/10 to-neutral-950" />
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        </div>
        
        <div className="relative max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-green-400 via-emerald-400 to-green-500 text-transparent bg-clip-text">
                Project Showcase
              </span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
              Explore innovative projects built by our community members. Get inspired, learn, and share your own creations.
            </p>
            
            {session && (
              <Button
                onClick={() => setSubmissionModalOpen(true)}
                size="lg"
                className={`bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold px-8 py-6 text-lg rounded-2xl shadow-lg hover:shadow-white/10 hover:scale-105 transition-all duration-300`}
              >
                Submit Your Project 
                <Plus className="ml-2 h-5 w-5" />
              </Button>
              
            )}
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="px-4 sm:px-6 lg:px-8 pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-hide">
            {categories.map((category) => (
              <Button
                key={category.value}
                variant={selectedCategory === category.value ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.value)}
                className={`whitespace-nowrap ${
                  selectedCategory === category.value
                    ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white border-none"
                    : "border-neutral-700 text-neutral-300 hover:bg-neutral-800"
                }`}
              >
                {category.label}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="bg-neutral-900/50 border-neutral-800 animate-pulse">
                  <div className="h-48 bg-neutral-800 rounded-t-lg" />
                  <CardContent className="p-6 space-y-4">
                    <div className="h-6 bg-neutral-800 rounded w-3/4" />
                    <div className="h-4 bg-neutral-800 rounded" />
                    <div className="h-4 bg-neutral-800 rounded w-5/6" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-neutral-400 text-xl">No projects found in this category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project, index) => {
                const Icon = categoryIcons[project.category];
                const gradient = categoryColors[project.category];
                
                return (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <Card 
                      className="bg-neutral-900/50 border-neutral-800 hover:border-green-500/50 transition-all cursor-pointer group overflow-hidden"
                      onClick={() => setSelectedProject(project)}
                    >
                      {/* Image */}
                      <div className="relative h-48 overflow-hidden">
                        {project.imageUrl ? (
                          <img 
                            src={project.imageUrl} 
                            alt={project.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        ) : (
                          <div className={`w-full h-full bg-gradient-to-br ${gradient} opacity-50 flex items-center justify-center`}>
                            <Icon className="h-16 w-16 text-white" />
                          </div>
                        )}
                        {project.isFeatured && (
                          <Badge className="absolute top-3 right-3 bg-yellow-500/90 text-black border-none">
                            Featured
                          </Badge>
                        )}
                      </div>

                      <CardContent className="p-6">
                        {/* Category Badge */}
                        <div className="flex items-center gap-2 mb-3">
                          <Icon className="h-4 w-4 text-neutral-400" />
                          <Badge variant="outline" className="border-neutral-700 text-neutral-300 text-xs">
                            {project.category.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                          </Badge>
                        </div>

                        {/* Title */}
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-green-400 transition-colors">
                          {project.title}
                        </h3>

                        {/* Description */}
                        <p className="text-neutral-400 text-sm mb-4 line-clamp-2">
                          {project.description}
                        </p>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {project.tags.slice(0, 3).map((tag, i) => (
                            <Badge key={i} variant="secondary" className="bg-neutral-800 text-neutral-300 text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {project.tags.length > 3 && (
                            <Badge variant="secondary" className="bg-neutral-800 text-neutral-300 text-xs">
                              +{project.tags.length - 3}
                            </Badge>
                          )}
                        </div>

                        {/* Author & Stats */}
                        <div className="flex items-center justify-between pt-4 border-t border-neutral-800">
                          <div className="text-sm text-neutral-400">
                            by <span className="text-green-400">{project.submitterName}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={(e) => handleLike(project.id, e)}
                              className="flex items-center gap-1 text-neutral-400 hover:text-red-400 transition-colors"
                            >
                              <Heart 
                                className={`h-4 w-4 ${likedProjects.has(project.id) ? 'fill-red-400 text-red-400' : ''}`} 
                              />
                              <span className="text-xs">{project.likesCount}</span>
                            </button>
                            <div className="flex items-center gap-1 text-neutral-400">
                              <Eye className="h-4 w-4" />
                              <span className="text-xs">{project.viewsCount}</span>
                            </div>
                          </div>
                        </div>

                        {/* Links */}
                        <div className="flex gap-2 mt-4">
                          {project.githubUrl && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(project.githubUrl, '_blank');
                              }}
                              className="flex-1 border-neutral-700 hover:border-green-500">
                              <Github className="h-4 w-4 mr-1" />
                              Code
                            </Button>
                          )}
                          {project.liveUrl && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(project.liveUrl, '_blank');
                              }}
                              className="flex-1 border-neutral-700 hover:border-green-500">
                              <ExternalLink className="h-4 w-4 mr-1" />
                              Live
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Modals */}
      <ProjectSubmissionModal
        open={submissionModalOpen}
        onClose={() => setSubmissionModalOpen(false)}
        onSuccess={() => {
          setSubmissionModalOpen(false);
          fetchProjects();
        }}
      />

      {selectedProject && (
        <ProjectDetailsModal
          project={selectedProject}
          open={!!selectedProject}
          onClose={() => setSelectedProject(null)}
          isLiked={likedProjects.has(selectedProject.id)}
          onLike={(projectId) => handleLike(projectId, {} as React.MouseEvent)}
        />
      )}
    </div>
  );
}
