"use client";


import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ExternalLink, Info, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";

interface Resource {
  name: string;
  type: string;
  link: string;
  description: string;
  tags: string[];
}

interface ResourceTableProps {
  category: string;
  domain: string;
}

export default function ResourceTable({ category, domain }: ResourceTableProps) {
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<{ name: string; description: string } | null>(null);

  useEffect(() => {
    // file name: data/resources/{domain}.json
    const fetchResources = async () => {
      try {
        setIsLoading(true);
        console.log(category, domain);
        const response = await fetch(`/api/resources/${domain}`);
        if (!response.ok) {
          throw new Error('Failed to fetch resources');
        }
        const data = await response.json();

        // Get resources for the specific category from the nested structure
        const categoryResources = data[category] || [];
        setResources(categoryResources);
      } catch (err) {
        console.error('Error:', err);
        setError('Failed to load resources');
      } finally {
        setIsLoading(false);
      }
    };

    fetchResources();
  }, [category, domain]);

  if (isLoading) return <div className="p-8 text-center text-neutral-400">Loading resources...</div>;
  if (error) return <div className="p-8 text-center text-red-400">{error}</div>;
  if (!resources.length) return <div className="p-8 text-center text-neutral-400">No resources found.</div>;

  return (
    <>
      {/* Desktop/table view */}
      <div className="hidden sm:block">
        <Table className="table-fixed w-full">
          <TableHeader className="bg-neutral-900/50">
            <TableRow className="border-neutral-800/50 hover:bg-transparent">
              <TableHead className="w-1/3 text-neutral-400 px-3">Name</TableHead>
              <TableHead className="w-1/2 text-neutral-400">Description</TableHead>
              {domain !== "basics" && (
                <TableHead className="w-1/2 text-neutral-400">Tags</TableHead>
              )}
              <TableHead className="w-1/6 text-neutral-400 text-right pr-3">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {resources.map((resource, index) => (
              <TableRow
                key={`${resource.name}-${index}`}
                className="border-neutral-800/50 hover:bg-neutral-800/50 transition-colors"
              >
                <TableCell className="w-1/3 font-medium text-neutral-200">
                  {resource.name}
                </TableCell>
                <TableCell className="w-1/2 text-neutral-400">
                  {resource.description}
                </TableCell>
                {domain !== "basics" && (
                  <TableCell className="w-1/2">
                    <div className="flex flex-wrap gap-2">
                      {resource.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 text-xs rounded-md bg-neutral-800/50 text-neutral-300 ring-1 ring-neutral-700/50"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </TableCell>
                )}
                <TableCell className="w-1/6 text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-blue-400 hover:bg-emerald-500/10 hover:text-emerald-400"
                    onClick={() => window.open(resource.link, "_blank")}
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span className="sr-only">Open link</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile card view */}
      <div className="sm:hidden space-y-3">
        {resources.map((resource, index) => (
          <Card key={`${resource.name}-${index}`} className="p-3 bg-neutral-900/50 border-neutral-800/50">
            <div className="flex items-start gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-neutral-200 truncate">
                    {resource.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-neutral-300"
                      onClick={() => { setModalContent({ name: resource.name, description: resource.description }); setModalOpen(true); }}
                    >
                      <Info className="w-3 h-3" />
                      <span className="sr-only">Show description</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-blue-400"
                      onClick={() => window.open(resource.link, "_blank")}
                    >
                      <ExternalLink className="w-3 h-3" />
                    </Button>
                  </div>
                </div>

                {domain !== "basics" && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {resource.tags.map((tag) => (
                      <span key={tag} className="px-1 py-0.5 text-xs rounded-md bg-neutral-800/50 text-neutral-300 ring-1 ring-neutral-700/50">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Description modal for mobile */}
      {modalOpen && modalContent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <Card className="w-full max-w-sm p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-base font-semibold text-neutral-200 mb-2">{modalContent.name}</h3>
                <p className="text-sm text-neutral-400">{modalContent.description}</p>
              </div>
              <Button variant="ghost" onClick={() => setModalOpen(false)} className="text-neutral-400">
                <X className="w-3 h-3" />
              </Button>
            </div>
          </Card>
        </div>
      )}
    </>
  );
}
