import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { client } from "@/sanity/lib/client";
import BlogList from "./components/BlogList";
import { Meteors } from "@/components/ui/meteors";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";

async function getPosts() {
  const query = `*[_type == "post"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    publishedAt,
    excerpt,
    mainImage,
    "author": author->name,
    "categories": categories[]->title
  }`;
  
  return client.fetch(query);
}

export default async function BlogPage() {
  const session = await getServerSession();

  if (!session) {
    redirect("/auth/signin?callbackUrl=/blog");
  }

  const posts = await getPosts();

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
      <Navbar />
      <div className="absolute inset-0 overflow-hidden">
        <Meteors number={20} />
      </div>

      <div className="relative pt-36 bg-gradient-to-b from-black to-gray-900  pb-20">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-8 relative z-10">
            <div className="flex justify-center gap-2 mb-6">
              <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/20">
                Student Resources
              </Badge>
              <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20">
                Tech Events
              </Badge>
              <Badge variant="outline" className="bg-purple-500/10 text-purple-400 border-purple-500/20">
                Community
              </Badge>
            </div>
            
            <h1 className="text-9xl font-bold relative group">
              <span className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-green-500 to-emerald-600 bg-clip-text text-transparent blur-2xl opacity-20 animate-pulse">
                Knowledge Hub
              </span>
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-emerald-300 via-green-500 to-teal-400 bg-clip-text text-transparent [background-size:200%_auto] animate-shine">
                  Knowledge Hub
                </span>
                <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-300 via-green-500 to-teal-400 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></span>
                <span className="absolute bottom-0 left-0 w-2 h-1 bg-gradient-to-r from-emerald-300 to-green-500 animate-underline"></span>
              </span>
            </h1>
            
            <p className="text-2xl bg-gradient-to-r from-emerald-400/80 via-green-300/80 to-emerald-400/80 bg-clip-text text-transparent max-w-2xl mx-auto font-light">
              Discover events, resources, and insights to fuel your tech journey
            </p>

            <div className="flex justify-center gap-4 mt-8">
              <div className="flex items-center gap-2 bg-green-500/10 rounded-full px-4 py-2">
                <span className="size-2 bg-green-400 rounded-full animate-pulse"></span>
                <span className="text-green-400">Latest Events</span>
              </div>
              <div className="flex items-center gap-2 bg-blue-500/10 rounded-full px-4 py-2">
                <span className="size-2 bg-blue-400 rounded-full animate-pulse"></span>
                <span className="text-blue-400">Student Resources</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center px-8">
          <div className="w-full border-t border-gray-700"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="bg-gray-900 px-4 text-sm text-gray-400">Featured Content</span>
        </div>
      </div>

      <div className="relative">
        <div className="container mx-auto px-4 py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div>
              <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-400 mb-4">
                Latest Articles
              </h2>
              <p className="text-gray-400">
                Stay updated with the latest tech trends, events, and student resources
              </p>
            </div>
            <div className="flex items-center justify-end gap-4">
              <div className="flex -space-x-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="size-10 rounded-full bg-gradient-to-r from-green-400 to-emerald-400 p-0.5"
                  >
                    <div className="size-full rounded-full bg-gray-900"></div>
                  </div>
                ))}
              </div>
              <span className="text-gray-400">Join 1000+ readers</span>
            </div>
          </div>
          
          <BlogList posts={posts} />
        </div>
      </div>
    </main>
  );
}
