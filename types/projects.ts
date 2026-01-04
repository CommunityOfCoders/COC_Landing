export type ProjectCategory = 
  | 'web-development'
  | 'app-development'
  | 'machine-learning'
  | 'blockchain'
  | 'iot'
  | 'game-development'
  | 'ai'
  | 'data-science'
  | 'cybersecurity'
  | 'other';

export type ProjectStatus = 'pending' | 'approved' | 'rejected';

export interface TeamMember {
  name: string;
  role: string;
  email: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  fullDescription?: string;
  category: ProjectCategory;
  tags: string[];
  
  // Project details
  githubUrl?: string;
  liveUrl?: string;
  videoUrl?: string;
  imageUrl?: string;
  additionalImages?: string[];
  
  // Team information
  teamName?: string;
  teamMembers?: TeamMember[];
  
  // Submission metadata
  submittedBy: string;
  submitterName: string;
  submitterYear?: number;
  submitterBranch?: string;
  
  // Review status
  status: ProjectStatus;
  reviewNotes?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  
  // Showcase info
  isFeatured: boolean;
  viewsCount: number;
  likesCount: number;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
}

export interface ProjectWithLikeStatus extends Project {
  isLikedByUser: boolean;
}

export interface ProjectSubmission {
  title: string;
  description: string;
  fullDescription?: string;
  category: ProjectCategory;
  tags: string[];
  githubUrl?: string;
  liveUrl?: string;
  videoUrl?: string;
  imageUrl?: string;
  additionalImages?: string[];
  teamName?: string;
  teamMembers?: TeamMember[];
}

export interface ProjectReviewData {
  status: ProjectStatus;
  reviewNotes?: string;
}
