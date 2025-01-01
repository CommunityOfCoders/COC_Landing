"use client";

import { useSession } from "next-auth/react";
// import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { getDomains, getSubjectsByDomain, getResourcesBySubject, type Domain, type Subject, type Resource } from "@/lib/supabase-resources";
// import Link from "next/link";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Code, FileText, Video } from "lucide-react";

export default function Dashboard() {
  const { data: session } = useSession();
  // const pathname = usePathname();
  const [domains, setDomains] = useState<Domain[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [selectedDomain, setSelectedDomain] = useState<string>("");
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const domainsData = await getDomains();
      setDomains(domainsData);
      if (domainsData.length > 0) {
        setSelectedDomain(domainsData[0].slug);
      }
    } catch (error) {
      console.error("Error fetching domains:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchSubjects = async () => {
    try {
      const subjectsData = await getSubjectsByDomain(selectedDomain);
      setSubjects(subjectsData);
      if (subjectsData.length > 0) {
        setSelectedSubject(subjectsData[0].id);
      }
    } catch (error) {
      console.error("Error fetching subjects:", error);
    }
  };

  useEffect(() => {
    if (selectedDomain) {
      fetchSubjects();
    }
  }, [selectedDomain]);

  const fetchResources = async () => {
    try {
      const resourcesData = await getResourcesBySubject(selectedSubject);
      setResources(resourcesData);
    } catch (error) {
      console.error("Error fetching resources:", error);
    }
  };

  useEffect(() => {
    if (selectedSubject) {
      fetchResources();
    }
  }, [selectedSubject]);

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="w-5 h-5" />;
      case 'document':
        return <FileText className="w-5 h-5" />;
      default:
        return <Code className="w-5 h-5" />;
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-emerald-500"></div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-black px-8 py-6">
      <motion.div
        initial="initial"
        animate="animate"
        className="space-y-8"
      >
        <motion.div 
          variants={{
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 }
          }}
          className="space-y-3"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-500 bg-clip-text text-transparent">
            Welcome back, {session?.user?.name?.split(" ")[0]}!
          </h1>
          <p className="text-lg text-neutral-400">
            Explore our curated learning resources
          </p>
        </motion.div>

        <Tabs defaultValue={domains[0]?.slug} className="w-full" onValueChange={setSelectedDomain}>
          <TabsList className="bg-neutral-900/50 border-neutral-800">
            {domains.map((domain) => (
              <TabsTrigger
                key={domain.slug}
                value={domain.slug}
                className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-500"
              >
                {domain.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {domains.map((domain) => (
            <TabsContent key={domain.slug} value={domain.slug} className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-1">
                  <Card className="bg-neutral-900/50 border-neutral-800/50 p-4">
                    <h3 className="font-semibold mb-4 text-neutral-200">Subjects</h3>
                    <div className="space-y-2">
                      {subjects.map((subject) => (
                        <button
                          key={subject.id}
                          onClick={() => setSelectedSubject(subject.id)}
                          className={cn(
                            "w-full text-left px-3 py-2 rounded-lg transition-colors",
                            selectedSubject === subject.id
                              ? "bg-emerald-500/20 text-emerald-500"
                              : "text-neutral-400 hover:bg-neutral-800/50"
                          )}
                        >
                          {subject.name}
                        </button>
                      ))}
                    </div>
                  </Card>
                </div>

                <div className="lg:col-span-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {resources.map((resource) => (
                      <Card
                        key={resource.id}
                        className="bg-neutral-900/50 border-neutral-800/50 p-6 hover:bg-neutral-800/50 transition-all group"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            {getResourceIcon(resource.type)}
                            <h3 className="font-semibold text-neutral-200 group-hover:text-emerald-500 transition-colors">
                              {resource.name}
                            </h3>
                          </div>
                          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
                            {resource.difficulty_level}
                          </Badge>
                        </div>
                        <p className="text-sm text-neutral-400 mb-4">{resource.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {resource.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="bg-neutral-800">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <a
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-4 inline-flex items-center text-sm text-emerald-500 hover:text-emerald-400"
                        >
                          <BookOpen className="w-4 h-4 mr-2" />
                          Open Resource
                        </a>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </motion.div>
    </div>
  );
}