#!/usr/bin/env -S node --no-warnings --loader ts-node/esm

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { testAlumni, testResources } from '../data/test-data.js';
import { testTeamMembers } from '../data/test-team-data.js';

// Load environment variables
dotenv.config();

// Initialize Supabase client with service role key for admin operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedDatabase() {
  try {
    console.log('Starting database seeding...');

    // Insert team members
    console.log('Creating team members...');
    for (const member of testTeamMembers) {
      const { error: memberError } = await supabase
        .from('team_members')
        .insert([{
          name: member.name,
          role: member.role,
          description: member.description,
          image_url: member.image_url,
          specialization: member.specialization,
          social_links: member.social_links,
          joined_date: new Date().toISOString()
        }]);

      if (memberError) {
        throw new Error(`Error creating team member: ${memberError.message}`);
      }
    }

    // Insert domains and their resources
    for (const domainData of testResources) {
      console.log(`Creating domain: ${domainData.domain.name}`);
      
      // Insert domain
      const { data: domain, error: domainError } = await supabase
        .from('domains')
        .insert([{
          name: domainData.domain.name,
          slug: domainData.domain.slug,
          description: domainData.domain.description,
          icon: domainData.domain.icon
        }])
        .select()
        .single();

      if (domainError) {
        throw new Error(`Error creating domain: ${domainError.message}`);
      }

      // Insert subjects for this domain
      for (const subjectData of domainData.subjects) {
        console.log(`Creating subject: ${subjectData.name}`);
        
        const { data: subject, error: subjectError } = await supabase
          .from('subjects')
          .insert([{
            domain_id: domain.id,
            name: subjectData.name,
            slug: subjectData.slug,
            description: subjectData.description
          }])
          .select()
          .single();

        if (subjectError) {
          throw new Error(`Error creating subject: ${subjectError.message}`);
        }

        // Insert resources for this subject
        for (const resourceData of subjectData.resources) {
          console.log(`Creating resource: ${resourceData.name}`);
          
          const { error: resourceError } = await supabase
            .from('resources')
            .insert([{
              subject_id: subject.id,
              name: resourceData.name,
              description: resourceData.description,
              url: resourceData.url,
              type: resourceData.type,
              difficulty_level: resourceData.difficulty_level,
              tags: resourceData.tags
            }]);

          if (resourceError) {
            throw new Error(`Error creating resource: ${resourceError.message}`);
          }
        }
      }
    }

    // Insert alumni data
    console.log('Creating alumni records...');
    for (const alumnus of testAlumni) {
      const { error: alumniError } = await supabase
        .from('alumni')
        .insert([{
          name: alumnus.name,
          role: alumnus.role,
          description: alumnus.bio,
          image_url: alumnus.avatar_url,
          graduation_year: alumnus.graduation_year,
          company: alumnus.company,
          specialization: alumnus.expertise.join(', '),
          social_links: {
            linkedin: alumnus.linkedin
          }
        }]);

      if (alumniError) {
        throw new Error(`Error creating alumnus: ${alumniError.message}`);
      }
    }

    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seeding function
seedDatabase();
