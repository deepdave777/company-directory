'use client';

import { useState } from 'react';
import { YoutubeLogo, ChatText, ArrowSquareOut, CaretDown } from '@phosphor-icons/react';
import { YoutubeVideo, RedditPost } from '@/lib/types';
import { formatDate, buildYoutubeSearchUrl, buildRedditUrl } from '@/lib/utils';

interface Props {
  youtube: YoutubeVideo[];
  reddit: RedditPost[];
  youtubeSummary?: string | null;
  redditSummary?: string | null;
}

function formatViews(views: number | string | undefined): string {
  if (views == null) return '';
  const n = typeof views === 'string' ? parseInt(views.replace(/,/g, '')) : views;
  if (isNaN(n)) return String(views);
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M views`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K views`;
  return `${n} views`;
}

export default function SocialMediaSection({ youtube, reddit, youtubeSummary, redditSummary }: Props) {
  const [youtubeOpen, setYoutubeOpen] = useState(false);
  const [redditOpen, setRedditOpen] = useState(false);
  const hasYoutube = youtube && youtube.length > 0;
  const hasReddit = reddit && reddit.length > 0;
  if (!hasYoutube && !hasReddit) return null;

  return (
    <div className="space-y-5">
      {/* YouTube */}
      {hasYoutube && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <YoutubeLogo className="w-5 h-5 text-[#ff4f12]" />
            <h2 className="text-lg font-semibold text-gray-900">YouTube Mentions</h2>
          </div>
          {youtubeSummary && (
            <div className="mb-5">
              <button
                onClick={() => setYoutubeOpen(!youtubeOpen)}
                className="flex items-center gap-2 w-full bg-[#fff8f6] border border-[#ffd5c2] px-4 py-3 hover:bg-[#fff1ec] transition-colors"
              >
                <div className="w-5 h-5 bg-[#ff4f12] flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-bold leading-none">AI</span>
                </div>
                <span className="text-sm font-medium text-gray-700">AI Summary</span>
                <CaretDown className={`w-4 h-4 text-gray-400 ml-auto transition-transform ${youtubeOpen ? 'rotate-180' : ''}`} />
              </button>
              {youtubeOpen && (
                <div className="border border-t-0 border-[#ffd5c2] p-4 bg-white">
                  <p className="text-sm text-gray-700 leading-relaxed">{youtubeSummary}</p>
                </div>
              )}
            </div>
          )}
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
            {youtube.map((video, i) => {
              const r = video as Record<string, unknown>;
              const title = String(r.title ?? 'Untitled');
              const channel = r.channel ? String(r.channel) : undefined;
              const thumb = (r.thumbnail || r.thumbnailUrl) ? String(r.thumbnail || r.thumbnailUrl) : null;
              const views = r.views !== undefined && r.views !== '' ? r.views : null;
              const date = r.date_posted || r.date || r.publishedAt ? String(r.date_posted || r.date || r.publishedAt) : null;
              // Construct YouTube search URL since no direct URL is stored
              const url = r.url ? String(r.url) : buildYoutubeSearchUrl(title, channel);

              return (
                <a
                  key={i}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 w-56 border border-gray-200 overflow-hidden hover:border-[#ff4f12] hover:shadow-sm transition-all group bg-white"
                >
                  {/* Thumbnail */}
                  <div className="w-full h-32 bg-gray-100 relative overflow-hidden">
                    {thumb ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={thumb} alt={title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[#fff1ec]">
                        <YoutubeLogo className="w-10 h-10 text-[#ff4f12] opacity-60" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                  </div>
                  <div className="p-3">
                    <p className="text-xs font-medium text-gray-900 line-clamp-2 leading-snug mb-1">{title}</p>
                    {channel && <p className="text-xs text-gray-400 mb-1">{channel}</p>}
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      {views != null && String(views) !== '' && <span>{formatViews(views as number | string)}</span>}
                      {date && String(date) !== '' && <span>{date}</span>}
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      )}

      {/* Reddit */}
      {hasReddit && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <ChatText className="w-5 h-5 text-[#ff4f12]" />
            <h2 className="text-lg font-semibold text-gray-900">Reddit Mentions</h2>
          </div>
          {redditSummary && (
            <div className="mb-5">
              <button
                onClick={() => setRedditOpen(!redditOpen)}
                className="flex items-center gap-2 w-full bg-[#fff8f6] border border-[#ffd5c2] px-4 py-3 hover:bg-[#fff1ec] transition-colors"
              >
                <div className="w-5 h-5 bg-[#ff4f12] flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-bold leading-none">AI</span>
                </div>
                <span className="text-sm font-medium text-gray-700">AI Summary</span>
                <CaretDown className={`w-4 h-4 text-gray-400 ml-auto transition-transform ${redditOpen ? 'rotate-180' : ''}`} />
              </button>
              {redditOpen && (
                <div className="border border-t-0 border-[#ffd5c2] p-4 bg-white">
                  <p className="text-sm text-gray-700 leading-relaxed">{redditSummary}</p>
                </div>
              )}
            </div>
          )}
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
            {reddit.map((post, i) => {
              const r = post as Record<string, unknown>;
              const subreddit = String(r.subreddit || r.community || 'reddit');
              const title = String(r.title || 'Untitled');
              // Construct subreddit search URL since no direct post URL is stored
              const url = r.url ? String(r.url) : buildRedditUrl(subreddit, title);
              const score = r.score != null ? Number(r.score) : null;

              return (
                <a
                  key={i}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 w-56 border border-gray-200 p-4 hover:border-[#ff4f12] hover:shadow-sm transition-all group bg-white"
                >
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className="text-xs font-semibold text-[#ff4f12]">{subreddit.startsWith('r/') ? subreddit : `r/${subreddit}`}</span>
                    <ArrowSquareOut className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <p className="text-xs font-medium text-gray-900 line-clamp-3 leading-snug">{title}</p>
                  {score != null && !isNaN(score) && (
                    <p className="text-xs text-gray-400 mt-2">{score.toLocaleString()} points</p>
                  )}
                </a>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
