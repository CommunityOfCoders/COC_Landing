import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/sanity/lib/image";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Post } from "@/types/blog";

export default function BlogList({ posts }: { posts: Post[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {posts.map((post) => (
        <Link
          href={`/blog/${post.slug.current}`}
          key={post._id}
          className="group relative h-[450px] block transform perspective-1000 hover:z-10"
        >
          <article className="relative h-full w-full transition-all duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(10deg)]">
            <div className="absolute inset-0">
              <div className="relative h-full w-full overflow-hidden rounded-2xl bg-gray-900/90 border border-gray-800">
                {post.mainImage && (
                  <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-110">
                    <Image
                      src={urlFor(post.mainImage).url()}
                      alt={post.title}
                      fill
                      className="object-cover opacity-50"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/60 to-gray-900/90" />
                <div className="relative h-full p-6 flex flex-col justify-end">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {post.categories.map((category) => (
                      <Badge
                        key={category}
                        variant="outline"
                        className="border-green-500 text-green-400"
                      >
                        {category}
                      </Badge>
                    ))}
                  </div>
                  <h2 className="text-2xl font-semibold text-white mb-2">
                    {post.title}
                  </h2>
                  <p className="text-gray-400 line-clamp-3 mb-4">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center text-gray-400 text-sm">
                    <span>{post.author}</span>
                    <span className="mx-2">•</span>
                    <time dateTime={post.publishedAt}>
                      {format(new Date(post.publishedAt), "MMMM d, yyyy")}
                    </time>
                  </div>
                </div>
              </div>
            </div>
          </article>
        </Link>
      ))}
    </div>
  );
}
