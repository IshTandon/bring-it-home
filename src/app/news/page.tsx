'use client';

import useSWR from 'swr';
import Link from 'next/link';

interface NewsArticle {
  title: string;
  url: string;
  source: string;
  publishedAt: string;
}

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function NewsPage() {
  const { data, isLoading } = useSWR<{ articles: NewsArticle[] }>(
    '/api/news',
    fetcher,
    { revalidateOnFocus: false, refreshInterval: 900000 }
  );

  const articles = data?.articles ?? [];

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/"
          className="text-dark-text-muted text-sm hover:text-dark-text-primary transition-colors inline-flex items-center gap-1 mb-4"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
          Back
        </Link>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-dark-text-primary">
            World Cup <span className="text-dark-accent">News</span>
          </h1>
          <span className="text-gray-500 text-xs">From Google News</span>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <div className="w-20 h-5 rounded-full bg-gray-800 animate-shimmer mb-3" style={{ backgroundSize: '200% 100%', backgroundImage: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.04) 50%, transparent 100%)' }} />
              <div className="space-y-2">
                <div className="w-full h-5 rounded bg-gray-800 animate-shimmer" style={{ backgroundSize: '200% 100%', backgroundImage: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.04) 50%, transparent 100%)' }} />
                <div className="w-3/4 h-5 rounded bg-gray-800 animate-shimmer" style={{ backgroundSize: '200% 100%', backgroundImage: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.04) 50%, transparent 100%)' }} />
              </div>
            </div>
          ))}
        </div>
      ) : articles.length === 0 ? (
        <p className="text-gray-500 text-center text-sm py-16">
          No news right now — check back soon
        </p>
      ) : (
        <div className="space-y-3">
          {articles.map((article, i) => (
            <article
              key={i}
              className="bg-gray-900 border border-gray-800 rounded-xl p-5 transition-colors hover:border-gray-600 hover:bg-gray-800 group"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <span className="shrink-0 bg-gray-800 text-amber-400 text-xs px-2.5 py-0.5 rounded-full group-hover:bg-gray-700">
                  {article.source}
                </span>
                <span className="shrink-0 text-gray-500 text-xs whitespace-nowrap pt-0.5">
                  {article.publishedAt}
                </span>
              </div>
              <h2 className="text-base font-medium text-gray-100 mb-1.5 line-clamp-3">
                {article.title}
              </h2>
              <p className="text-gray-500 text-sm mb-3">
                {article.source}
              </p>
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-400 text-sm font-medium hover:text-amber-300 transition-colors inline-flex items-center gap-1"
              >
                Read full article
                <span aria-hidden="true">→</span>
              </a>
            </article>
          ))}
        </div>
      )}

      <p className="text-gray-600 text-xs mt-6 text-center">
        Headlines via Google News. Content belongs to respective publishers.
      </p>
    </div>
  );
}
