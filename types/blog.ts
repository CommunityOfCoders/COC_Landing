import { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { PortableTextBlock } from "@portabletext/types";

export interface Post {
  _id: string;
  title: string;
  slug: { current: string };
  publishedAt: string;
  excerpt: string;
  mainImage: SanityImageSource;
  author: string;
  categories: string[];
  body?: PortableTextBlock[];
}

export interface PortableTextImageType {
  value: {
    asset: {
      _ref: string;
    };
    alt?: string;
    caption?: string;
  };
}

export interface PortableTextProps {
  children: React.ReactNode;
  value?: {
    href?: string;
  };
}
