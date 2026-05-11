import { Metadata } from "next";
import BlogDetailClient from "./BlogDetailClient";

// SERVER-ONLY: never use localhost here — must be the real backend URL on Vercel
const API_URL = process.env.API_URL
  ?? process.env.NEXT_PUBLIC_API_URL
  ?? "http://localhost:5000/api/v1";

// Vercel sets VERCEL_PROJECT_PRODUCTION_URL automatically, e.g. "yourapp.vercel.app"
function getAppUrl(): string {
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

const CATEGORY_IMAGES: Record<string, string> = {
  Prayer:    "https://images.unsplash.com/photo-1564769625905-50e93615e769?w=800&q=80",
  Ramadan:   "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?w=800&q=80",
  Charity:   "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&q=80",
  Quran:     "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=800&q=80",
  Hajj:      "https://images.unsplash.com/photo-1519058082700-08a515d26aa9?w=800&q=80",
  Etiquette: "https://images.unsplash.com/photo-1519817650390-64a93db51149?w=800&q=80",
  default:   "https://images.unsplash.com/photo-1585036156171-384164a8c675?w=800&q=80",
};

async function getPost(slug: string) {
  try {
    const res = await fetch(`${API_URL}/blog/${slug}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data ?? null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  const title = post?.title?.en ?? "Blog Article | Nayabari Panch Tara Jame Masjid";
  const description = (post?.description?.en ?? "Read this article on our masjid blog.").slice(0, 160);
  const image = post?.imageUrl || CATEGORY_IMAGES[post?.category?.en] || CATEGORY_IMAGES.default;
  const appUrl = getAppUrl();
  const url = `${appUrl}/blog/${slug}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      type: "article",
      siteName: "Nayabari Panch Tara Jame Masjid",
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default function BlogDetailPage() {
  return <BlogDetailClient />;
}
