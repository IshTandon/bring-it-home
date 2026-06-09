import { NextResponse } from 'next/server';
import { XMLParser } from 'fast-xml-parser';

export const revalidate = 900;

interface NewsArticle {
  title: string;
  url: string;
  source: string;
  publishedAt: string;
}

let cachedArticles: NewsArticle[] = [];

function relativeTime(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  if (isNaN(then)) return '';

  const diffMs = now - then;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffSec < 60) return 'just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay === 1) return 'yesterday';
  if (diffDay < 7) return `${diffDay}d ago`;
  return `${Math.floor(diffDay / 7)}w ago`;
}

function parseItem(item: Record<string, string>): NewsArticle | null {
  const rawTitle = item.title;
  if (!rawTitle) return null;

  const dashIdx = rawTitle.lastIndexOf(' - ');
  const source = dashIdx !== -1 ? rawTitle.slice(dashIdx + 3).trim() : 'Unknown';
  const title = dashIdx !== -1 ? rawTitle.slice(0, dashIdx).trim() : rawTitle.trim();

  return {
    title,
    url: item.link || '',
    source,
    publishedAt: relativeTime(item.pubDate || ''),
  };
}

export async function GET() {
  try {
    const res = await fetch(
      'https://news.google.com/rss/search?q=FIFA+World+Cup+2026&hl=en-US&gl=US&ceid=US:en',
      { next: { revalidate: 900 } }
    );

    if (!res.ok) throw new Error(`RSS fetch failed: ${res.status}`);

    const xml = await res.text();
    const parser = new XMLParser();
    const parsed = parser.parse(xml);

    const items: Record<string, string>[] =
      parsed?.rss?.channel?.item ?? [];

    const articles = items
      .map(parseItem)
      .filter((a): a is NewsArticle => a !== null)
      .slice(0, 8);

    cachedArticles = articles;

    return NextResponse.json({ articles });
  } catch {
    return NextResponse.json({ articles: cachedArticles });
  }
}
