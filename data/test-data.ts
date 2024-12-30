export const testAlumni = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@example.com',
    graduation_year: 2020,
    company: 'Google',
    role: 'Software Engineer',
    linkedin: 'https://linkedin.com/in/johnsmith',
    expertise: ['Web Development', 'Machine Learning'],
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
    bio: 'Full stack developer with 3 years of experience in building scalable web applications.'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.j@example.com',
    graduation_year: 2019,
    company: 'Microsoft',
    role: 'Product Manager',
    linkedin: 'https://linkedin.com/in/sarahj',
    expertise: ['Product Management', 'UX Design'],
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
    bio: 'Product manager passionate about creating user-centric solutions.'
  }
];

export const testResources = [
  {
    domain: {
      name: 'Web Development',
      slug: 'web-dev',
      description: 'Resources for modern web development',
      icon: '🌐'
    },
    subjects: [
      {
        name: 'Frontend Development',
        slug: 'frontend',
        description: 'Learn frontend development with React, Next.js and more',
        resources: [
          {
            name: 'React Fundamentals',
            description: 'Complete guide to React fundamentals including hooks and state management',
            type: 'video',
            url: 'https://example.com/react-fundamentals',
            tags: ['react', 'javascript', 'frontend'],
            difficulty_level: 'beginner'
          },
          {
            name: 'Next.js Documentation',
            description: 'Official Next.js documentation and tutorials',
            type: 'document',
            url: 'https://nextjs.org/docs',
            tags: ['nextjs', 'react', 'frontend'],
            difficulty_level: 'intermediate'
          }
        ]
      }
    ]
  },
  {
    domain: {
      name: 'Machine Learning',
      slug: 'ml',
      description: 'Resources for machine learning and AI',
      icon: '🤖'
    },
    subjects: [
      {
        name: 'Deep Learning',
        slug: 'deep-learning',
        description: 'Resources for deep learning and neural networks',
        resources: [
          {
            name: 'Neural Networks Explained',
            description: 'Comprehensive guide to understanding neural networks',
            type: 'video',
            url: 'https://example.com/neural-networks',
            tags: ['deep-learning', 'neural-networks', 'python'],
            difficulty_level: 'intermediate'
          },
          {
            name: 'PyTorch Tutorial',
            description: 'Hands-on tutorial for deep learning with PyTorch',
            type: 'document',
            url: 'https://pytorch.org/tutorials',
            tags: ['pytorch', 'deep-learning', 'python'],
            difficulty_level: 'advanced'
          }
        ]
      }
    ]
  }
];
