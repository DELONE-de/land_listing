import Link from 'next/link';
import { Calendar, ArrowRight } from 'lucide-react';

const posts = [
  {
    slug: 'how-to-verify-land-title-nigeria',
    title: 'How to Verify Land Title in Nigeria',
    excerpt: 'A step-by-step guide to verifying land ownership documents before making a purchase.',
    date: 'March 15, 2026',
    category: 'Guides',
  },
  {
    slug: 'best-states-to-buy-land-nigeria',
    title: 'Best States to Buy Land in Nigeria (2026)',
    excerpt: 'An overview of the most promising states for land investment across Nigeria this year.',
    date: 'February 28, 2026',
    category: 'Investment',
  },
  {
    slug: 'understanding-certificate-of-occupancy',
    title: 'Understanding Certificate of Occupancy (C of O)',
    excerpt: 'Everything you need to know about the Certificate of Occupancy and why it matters.',
    date: 'February 10, 2026',
    category: 'Legal',
  },
];

export default function BlogPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">Blog</h1>
        <p className="text-gray-500 text-lg">Tips, guides and insights on land ownership in Nigeria.</p>
      </div>

      <div className="space-y-6">
        {posts.map((post) => (
          <div key={post.slug} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
            <span className="text-xs font-medium text-green-700 bg-green-50 px-2 py-1 rounded-full">{post.category}</span>
            <h2 className="text-xl font-bold text-gray-900 mt-3 mb-2">{post.title}</h2>
            <p className="text-gray-500 text-sm mb-4">{post.excerpt}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-gray-400">
                <Calendar className="h-3.5 w-3.5" />
                {post.date}
              </div>
              <span className="inline-flex items-center gap-1 text-sm font-medium text-green-700">
                Read more <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
