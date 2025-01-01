import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { PortableText } from "@portabletext/react";
import { PortableTextComponentProps } from "@portabletext/react";
import { PortableTextBlock } from "@portabletext/types";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Post, PortableTextImageType, PortableTextProps } from "@/types/blog";

async function getPost(slug: string) {
  const query = `*[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    publishedAt,
    mainImage,
    content,
    body,
    "author": author->name,
    "categories": categories[]->title
  }`;

  return client.fetch(query, { slug }) as Promise<Post>;
}

const PortableTextComponents = {
  types: {
    image: ({ value }: PortableTextImageType) => {
      if (!value?.asset?._ref) {
        return null;
      }
      return (
        <figure className="my-8">
          <div className="relative w-full h-[500px] rounded-lg overflow-hidden">
            <Image
              src={urlFor(value).url()}
              alt={value.alt || "Blog post image"}
              fill
              className="object-contain bg-gray-50"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          {value.caption && (
            <figcaption className="mt-2 text-center text-sm text-gray-500 italic">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
  },
  block: {
    h1: ({ children }: PortableTextComponentProps<PortableTextBlock>) => (
      <h1 className="text-4xl font-bold my-8 bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
        {children}
      </h1>
    ),
    h2: ({ children }: PortableTextComponentProps<PortableTextBlock>) => (
      <h2 className="text-3xl font-semibold my-6 bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
        {children}
      </h2>
    ),
    normal: ({ children }: PortableTextComponentProps<PortableTextBlock>) => (
      <p className="text-gray-700 leading-relaxed mb-6">{children}</p>
    ),
    blockquote: ({ children }: PortableTextComponentProps<PortableTextBlock>) => (
      <blockquote className="border-l-4 border-green-500 pl-4 my-6 italic text-gray-700">
        {children}
      </blockquote>
    ),
  },
  marks: {
    highlight: ({ children }: PortableTextProps) => (
      <span className="bg-gradient-to-r from-green-200 to-green-300 px-1 rounded">
        {children}
      </span>
    ),
    link: ({ children, value }: PortableTextProps) => {
      const rel = value?.href?.startsWith('/') ? undefined : 'noreferrer noopener';
      return (
        <a 
          href={value?.href}
          rel={rel}
          className="text-green-500 hover:text-green-600 underline transition-colors"
        >
          {children}
        </a>
      );
    },
  },
};

export default async function BlogPost({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getPost(params.slug);

  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="h-16 flex items-center justify-between">
            <div className="flex items-center gap-8">
              <Link 
                href="/blog"
                className="flex items-center gap-2 text-gray-600 hover:text-green-500 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Blog</span>
              </Link>
              <div className="h-6 w-px bg-gray-200"></div>
              <Link
                href="/"
                className="text-xl font-bold bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent"
              >
                <span className="flex items-center gap-2">
                <Image
                  src="/coc_vjti.jpeg"
                  alt="Logo"
                  width={32}
                  height={32}
                  className="w-8 h-8"
                />
                CoC
                </span>
              </Link>
            </div>
            <div className="flex items-center gap-4">
              {post.categories?.map((category: string) => (
                <span
                  key={category}
                  className="px-3 py-1 text-sm text-green-600 bg-green-50 rounded-full"
                >
                  {category}
                </span>
              ))}
            </div>
          </div>
        </div>
      </nav>

      <article className="max-w-4xl mx-auto px-4 py-12">
        <header className="mb-12">
          {post.mainImage && (
            <div className="relative w-full h-[60vh] mb-8 rounded-xl overflow-hidden">
              <Image
                src={urlFor(post.mainImage).url()}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">
            {post.title}
          </h1>
          <div className="flex items-center gap-4 text-gray-600 mb-6">
            <span className="font-medium">{post.author}</span>
            <span>•</span>
            <time dateTime={post.publishedAt}>
              {format(new Date(post.publishedAt), "MMMM d, yyyy")}
            </time>
          </div>
        </header>

        <div className="prose prose-lg max-w-none prose-headings:text-green-600 prose-a:text-green-500 prose-blockquote:border-green-500">
          {/* <PortableText value={post.content} components={PortableTextComponents} /> */}
          {post.body && (
            <PortableText value={post.body} components={PortableTextComponents} />
          )}
        </div>
      </article>
    </div>
  );
}
