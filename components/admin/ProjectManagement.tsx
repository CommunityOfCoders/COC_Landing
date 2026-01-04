"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CheckCircle,
  XCircle,
  Eye,
  Star,
  Github,
  ExternalLink,
  Video,
  Clock,
  Trash2,
} from "lucide-react";
import { Project, ProjectStatus } from "@/types/projects";
import { reviewProject, toggleFeaturedProject, deleteProject } from "@/app/actions/projects";

interface ProjectManagementProps {
  projects: Project[];
  onRefresh: () => void;
}

export default function ProjectManagement({ projects, onRefresh }: ProjectManagementProps) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [reviewNotes, setReviewNotes] = useState("");
  const [filter, setFilter] = useState<string>("all");
  const [loading, setLoading] = useState(false);

  const filteredProjects = projects.filter((project) => {
    if (filter === "all") return true;
    return project.status === filter;
  });

  const handleReview = async (projectId: string, status: ProjectStatus) => {
    setLoading(true);
    const result = await reviewProject(projectId, {
      status,
      reviewNotes: reviewNotes || undefined,
    });
    setLoading(false);

    if (result.success) {
      alert(`Project ${status} successfully!`);
      setSelectedProject(null);
      setReviewNotes("");
      onRefresh();
    } else {
      alert(`Error: ${result.error}`);
    }
  };

  const handleToggleFeatured = async (projectId: string) => {
    const result = await toggleFeaturedProject(projectId);
    if (result.success) {
      onRefresh();
    } else {
      alert(`Error: ${result.error}`);
    }
  };

  const handleDelete = async (projectId: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    const result = await deleteProject(projectId);
    if (result.success) {
      alert("Project deleted successfully!");
      onRefresh();
    } else {
      alert(`Error: ${result.error}`);
    }
  };

  const getStatusBadge = (status: ProjectStatus) => {
    switch (status) {
      case "approved":
        return (
          <Badge className="bg-green-500/20 text-green-400 border-green-500/50">
            <CheckCircle className="h-3 w-3 mr-1" />
            Approved
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-500/20 text-red-400 border-red-500/50">
            <XCircle className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/50">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
    }
  };

  const stats = {
    total: projects.length,
    pending: projects.filter((p) => p.status === "pending").length,
    approved: projects.filter((p) => p.status === "approved").length,
    rejected: projects.filter((p) => p.status === "rejected").length,
    featured: projects.filter((p) => p.isFeatured).length,
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="bg-gray-900/50 border-gray-800">
          <CardContent className="p-4">
            <p className="text-sm text-gray-400">Total Projects</p>
            <p className="text-2xl font-bold text-white">{stats.total}</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-900/50 border-gray-800">
          <CardContent className="p-4">
            <p className="text-sm text-gray-400">Pending</p>
            <p className="text-2xl font-bold text-yellow-400">{stats.pending}</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-900/50 border-gray-800">
          <CardContent className="p-4">
            <p className="text-sm text-gray-400">Approved</p>
            <p className="text-2xl font-bold text-green-400">{stats.approved}</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-900/50 border-gray-800">
          <CardContent className="p-4">
            <p className="text-sm text-gray-400">Rejected</p>
            <p className="text-2xl font-bold text-red-400">{stats.rejected}</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-900/50 border-gray-800">
          <CardContent className="p-4">
            <p className="text-sm text-gray-400">Featured</p>
            <p className="text-2xl font-bold text-purple-400">{stats.featured}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-3">
        <Label className="text-white">Filter:</Label>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-48 bg-gray-900 border-gray-800 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-gray-900 border-gray-800">
            <SelectItem value="all" className="text-white">All Projects</SelectItem>
            <SelectItem value="pending" className="text-white">Pending</SelectItem>
            <SelectItem value="approved" className="text-white">Approved</SelectItem>
            <SelectItem value="rejected" className="text-white">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Projects Table */}
      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Projects ({filteredProjects.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-800 hover:bg-gray-800/50">
                  <TableHead className="text-gray-400">Title</TableHead>
                  <TableHead className="text-gray-400">Submitter</TableHead>
                  <TableHead className="text-gray-400">Category</TableHead>
                  <TableHead className="text-gray-400">Status</TableHead>
                  <TableHead className="text-gray-400">Stats</TableHead>
                  <TableHead className="text-gray-400">Date</TableHead>
                  <TableHead className="text-gray-400">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProjects.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-gray-400 py-8">
                      No projects found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProjects.map((project) => (
                    <TableRow
                      key={project.id}
                      className="border-gray-800 hover:bg-gray-800/50"
                    >
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div>
                            <p className="text-white font-medium">{project.title}</p>
                            <p className="text-sm text-gray-400 line-clamp-1">
                              {project.description}
                            </p>
                          </div>
                          {project.isFeatured && (
                            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-white text-sm">{project.submitterName}</p>
                        {project.submitterBranch && (
                          <p className="text-xs text-gray-400">
                            {project.submitterBranch} - Y{project.submitterYear}
                          </p>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-gray-700 text-gray-300 text-xs">
                          {project.category}
                        </Badge>
                      </TableCell>
                      <TableCell>{getStatusBadge(project.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3 text-sm text-gray-400">
                          <div className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {project.viewsCount}
                          </div>
                          <div className="flex items-center gap-1">
                            ❤️ {project.likesCount}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-gray-400">
                        {new Date(project.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedProject(project)}
                            className="border-gray-700 text-white hover:bg-gray-800"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleToggleFeatured(project.id)}
                            className={`border-gray-700 ${
                              project.isFeatured
                                ? "text-yellow-400 hover:text-yellow-500"
                                : "text-gray-400 hover:text-yellow-400"
                            }`}
                          >
                            <Star
                              className={`h-4 w-4 ${
                                project.isFeatured ? "fill-yellow-400" : ""
                              }`}
                            />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(project.id)}
                            className="border-gray-700 text-red-400 hover:text-red-500 hover:bg-gray-800"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Review Dialog */}
      <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Review Project</DialogTitle>
            <DialogDescription className="text-gray-400">
              Review and approve or reject the project submission
            </DialogDescription>
          </DialogHeader>

          {selectedProject && (
            <div className="space-y-6">
              {/* Image */}
              {selectedProject.imageUrl && (
                <div className="w-full h-48 rounded-lg overflow-hidden">
                  <img
                    src={selectedProject.imageUrl}
                    alt={selectedProject.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Title & Status */}
              <div>
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h3 className="text-xl font-bold">{selectedProject.title}</h3>
                  {getStatusBadge(selectedProject.status)}
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="outline" className="border-purple-500 text-purple-400">
                    {selectedProject.category}
                  </Badge>
                  {selectedProject.isFeatured && (
                    <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/50">
                      <Star className="h-3 w-3 mr-1 fill-yellow-400" />
                      Featured
                    </Badge>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <Label className="text-white mb-2">Description</Label>
                <p className="text-gray-300 text-sm">
                  {selectedProject.fullDescription || selectedProject.description}
                </p>
              </div>

              {/* Tags */}
              {selectedProject.tags.length > 0 && (
                <div>
                  <Label className="text-white mb-2">Tags</Label>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.tags.map((tag, i) => (
                      <Badge key={i} variant="secondary" className="bg-gray-800 text-gray-300">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Links */}
              <div className="flex flex-wrap gap-2">
                {selectedProject.githubUrl && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(selectedProject.githubUrl, "_blank")}
                    className="border-gray-700"
                  >
                    <Github className="h-4 w-4 mr-1" />
                    GitHub
                  </Button>
                )}
                {selectedProject.liveUrl && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(selectedProject.liveUrl, "_blank")}
                    className="border-gray-700"
                  >
                    <ExternalLink className="h-4 w-4 mr-1" />
                    Live Demo
                  </Button>
                )}
                {selectedProject.videoUrl && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(selectedProject.videoUrl, "_blank")}
                    className="border-gray-700"
                  >
                    <Video className="h-4 w-4 mr-1" />
                    Video
                  </Button>
                )}
              </div>

              {/* Submitter Info */}
              <div className="bg-gray-800/50 p-4 rounded-lg">
                <Label className="text-gray-400 text-sm mb-2">Submitted By</Label>
                <p className="text-white font-medium">{selectedProject.submitterName}</p>
                <p className="text-sm text-gray-400">{selectedProject.submittedBy}</p>
                {selectedProject.submitterBranch && (
                  <p className="text-sm text-gray-400">
                    {selectedProject.submitterBranch} • Year {selectedProject.submitterYear}
                  </p>
                )}
              </div>

              {/* Team Info */}
              {selectedProject.teamName && (
                <div>
                  <Label className="text-white mb-2">Team: {selectedProject.teamName}</Label>
                  {selectedProject.teamMembers && selectedProject.teamMembers.length > 0 && (
                    <div className="space-y-2 mt-2">
                      {selectedProject.teamMembers.map((member, i) => (
                        <div key={i} className="bg-gray-800/50 p-3 rounded-lg">
                          <p className="text-white font-medium">{member.name}</p>
                          {member.role && (
                            <p className="text-sm text-gray-400">{member.role}</p>
                          )}
                          <p className="text-sm text-gray-400">{member.email}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Review Notes */}
              {selectedProject.status === "pending" && (
                <div>
                  <Label htmlFor="reviewNotes" className="text-white mb-2">
                    Review Notes (Optional)
                  </Label>
                  <Textarea
                    id="reviewNotes"
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white min-h-[100px]"
                    placeholder="Add notes about your review decision..."
                  />
                </div>
              )}

              {/* Previous Review Info */}
              {selectedProject.reviewNotes && (
                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <Label className="text-gray-400 text-sm mb-2">Review Notes</Label>
                  <p className="text-white text-sm">{selectedProject.reviewNotes}</p>
                  {selectedProject.reviewedBy && (
                    <p className="text-xs text-gray-400 mt-2">
                      Reviewed by {selectedProject.reviewedBy} on{" "}
                      {new Date(selectedProject.reviewedAt!).toLocaleString()}
                    </p>
                  )}
                </div>
              )}

              {/* Actions */}
              {selectedProject.status === "pending" && (
                <div className="flex gap-3 pt-4 border-t border-gray-800">
                  <Button
                    onClick={() => handleReview(selectedProject.id, "approved")}
                    disabled={loading}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                  <Button
                    onClick={() => handleReview(selectedProject.id, "rejected")}
                    disabled={loading}
                    variant="destructive"
                    className="flex-1"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
