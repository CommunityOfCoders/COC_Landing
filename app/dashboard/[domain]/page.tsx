"use client";

import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import ResourceTable from "@/components/ResourceTable";
import { useEffect, useState } from "react";
import { getDomainBySlug, getSubjectsByDomain, type Domain, type Subject } from "@/lib/supabase-resources";
import { Code, Database, FileText, Video, LucideIcon } from "lucide-react";

const domainIcons: { [key: string]: LucideIcon } = {
  'web-development': Code,
  'machine-learning': Database,
  'mobile-development': FileText,
  'cloud-computing': Video,
};

export default function DomainPage() {
  const params = useParams();
  const [domain, setDomain] = useState<Domain | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDomainData = async () => {
      try {
        setLoading(true);
        const domainSlug = params.domain as string;
        const [domainData, subjectsData] = await Promise.all([
          getDomainBySlug(domainSlug),
          getSubjectsByDomain(domainSlug)
        ]);
        setDomain(domainData);
        setSubjects(subjectsData);
      } catch (error) {
        console.error('Error fetching domain data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (params.domain) {
      fetchDomainData();
    }
  }, [params.domain]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (!domain) return null;

  const DomainIcon = domainIcons[domain.slug] || Code;

  return (
    <div className="min-h-screen bg-black px-8 py-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        {/* Welcome Section */}
        <div className="space-y-3">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-500 bg-clip-text text-transparent">
            {domain.name}
          </h1>
          <p className="text-lg text-neutral-400">
            Browse through {domain.name.toLowerCase()} resources curated for VJTI students.
          </p>
        </div>

        {/* Resources Section */}
        <Card className="bg-neutral-900/50 backdrop-blur-sm border-neutral-800">
          <div className="p-8 border-b border-neutral-800">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 bg-opacity-10">
                <DomainIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-neutral-100">
                  Resources
                </h2>
                <p className="text-sm text-neutral-400 mt-1">
                  {domain.description}
                </p>
              </div>
            </div>
          </div>
          
          <ScrollArea className="h-[calc(100vh-16rem)]">
            <div className="space-y-8 p-8">
              {subjects.map((subject) => (
                <div key={subject.id} className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                    <h2 className="text-lg font-medium text-neutral-200">
                      {subject.name}
                    </h2>
                  </div>
                  <Card className="border-neutral-800/50 bg-neutral-900/30">
                    <ResourceTable 
                      subjectId={subject.id}
                    />
                  </Card>
                </div>
              ))}
            </div>
          </ScrollArea>
        </Card>
      </motion.div>
    </div>
  );
}