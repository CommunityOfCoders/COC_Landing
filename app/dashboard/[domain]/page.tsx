"use client";
import React from "react";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { domains } from "@/config/navigation";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Info, X } from "lucide-react";
import ResourceTable from "@/components/ResourceTable";

interface Domain {
  name: string;
  resources: string;
  icon: React.ComponentType;
  gradient: string;
  description: string;
  categories: string[];
}

export default function DomainPage() {
  const { data: session } = useSession();
  const params = useParams();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  
  const currentDomain = domains.find(
    (d: Domain) => d.resources === params.domain
  );
  if (!currentDomain) return <div>{params.domain}</div>;
  
  const [activeTab, setActiveTab] = React.useState(currentDomain.categories[0]);
  
  React.useEffect(() => {
    const metaViewport = document.querySelector('meta[name="viewport"]');
    if (metaViewport) {
      metaViewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes');
    }
  }, []);

  return (
    <div className="min-h-screen bg-black px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      <style jsx global>{`
        .resource-table-desktop table th:first-child,
        .resource-table-desktop table td:first-child {
          width: 180px;
          max-width: 180px;
        }
        
        .resource-table-mobile table th:first-child,
        .resource-table-mobile table td:first-child {
          width: 80px;
          max-width: 80px;
        }
      `}</style>
      
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80"
          onClick={() => setIsModalOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-0 left-1/2 transform -translate-x-1/2 mt-4 bg-neutral-900 border border-neutral-800 rounded-lg p-6 max-w-lg w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg sm:text-xl font-semibold text-neutral-100">
                About {currentDomain.name}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-200 transition-colors ml-4"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm sm:text-base text-neutral-400">
              {currentDomain.description}
            </p>
          </motion.div>
        </div>
      )}

      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6 sm:space-y-8"
      >
        <div className="space-y-2 sm:space-y-3">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-500 bg-clip-text text-transparent">
            {currentDomain.name}
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-neutral-400">
            Browse through {currentDomain.name.toLowerCase()} resources curated for VJTI students.
          </p>
        </div>
        
        <Card className="bg-neutral-900/50 backdrop-blur-sm border-neutral-800">
          <div className="p-4 sm:p-6 lg:p-8 border-b border-neutral-800">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className={`p-2 sm:p-3 rounded-lg bg-gradient-to-br ${currentDomain.gradient} bg-opacity-10 flex-shrink-0`}>
                <currentDomain.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-xl sm:text-2xl font-semibold text-neutral-100">
                  Resources
                </h2>
                <p className="text-xs sm:text-sm text-neutral-400 mt-1 hidden md:block">
                  {currentDomain.description}
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="md:hidden text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 p-2 rounded-lg transition-colors flex-shrink-0"
              >
                <Info className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="flex mb-6 sm:mb-8 gap-4 sm:gap-6 lg:gap-8 bg-transparent rounded-lg px-2 py-3 justify-start items-center border-b border-neutral-800 overflow-x-auto scrollbar-hide">
              {currentDomain.categories.map((category: string) => (
                <button
                  key={category}
                  onClick={() => setActiveTab(category)}
                  className={`relative text-sm sm:text-base lg:text-lg font-medium capitalize transition-colors duration-200 px-2 py-1 whitespace-nowrap flex-shrink-0 ${
                    activeTab === category
                      ? 'text-emerald-400 border-b-2 border-emerald-400'
                      : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
            
            <Card className="border-neutral-800/50 bg-neutral-900/30 resource-table-desktop hidden md:block overflow-x-auto">
              <ResourceTable category={activeTab} domain={currentDomain.resources} />
            </Card>
            
            <Card className="border-neutral-800/50 bg-neutral-900/30 resource-table-mobile md:hidden overflow-x-auto">
              <ResourceTable category={activeTab} domain={currentDomain.resources} />
            </Card>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
