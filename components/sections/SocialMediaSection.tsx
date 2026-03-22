'use client';

import { useState } from 'react';
import { Youtube, MessageCircle, ExternalLink, ChevronDown } from 'lucide-react';
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
  const [loadingSummaries, setLoadingSummaries] = useState<Record<number, boolean>>({});
  const [videoSummaries, setVideoSummaries] = useState<Record<number, string>>({});

  const handleSummarizeVideo = async (e: React.MouseEvent, index: number, title: string, url: string) => {
    e.preventDefault(); // Prevent standard click behavior or link bubbling if any
    
    if (videoSummaries[index]) return; // Already summarized
    
    try {
      setLoadingSummaries(prev => ({ ...prev, [index]: true }));
      const res = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'video',
          titles: [title],
          url: url
        })
      });
      const data = await res.json();
      if (data.summary) {
        setVideoSummaries(prev => ({ ...prev, [index]: data.summary }));
      } else {
        setVideoSummaries(prev => ({ ...prev, [index]: 'Failed to generate summary.' }));
      }
    } catch (e) {
      console.error(e);
      setVideoSummaries(prev => ({ ...prev, [index]: 'Failed to generate summary.' }));
    } finally {
      setLoadingSummaries(prev => ({ ...prev, [index]: false }));
    }
  };

  const hasYoutube = youtube && youtube.length > 0;
  const hasReddit = reddit && reddit.length > 0;
  if (!hasYoutube && !hasReddit) return null;
  if (!hasYoutube && !hasReddit) return null;

  return (
    <div className="space-y-6">
      {/* YouTube */}
      {hasYoutube && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-1.5 h-1.5 bg-[#ff4f12]"></span>
            <h2 className="text-sm font-semibold tracking-widest uppercase text-gray-900">YouTube Mentions</h2>
          </div>
          <div className="bg-white border border-[#7d7373] p-5 sm:p-6">
            {youtubeSummary && (
              <div className="mb-5">
                <button
                  onClick={() => setYoutubeOpen(!youtubeOpen)}
                  className="flex items-center gap-2 w-full bg-[#fff8f6] border border-[#ffd5c2] px-4 py-3 hover:bg-[#fff1ec] transition-colors"
                >
                  <div className="w-5 h-5 bg-[#ff4f12] flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-[10px] font-bold leading-none">AI</span>
                  </div>
                  <span className="text-xs font-semibold tracking-widest uppercase text-gray-700">AI Summary</span>
                  <ChevronDown strokeWidth={2} className={`w-4 h-4 text-[#ff4f12] ml-auto transition-transform ${youtubeOpen ? 'rotate-180' : ''}`} />
                </button>
                {youtubeOpen && (
                  <div className="border border-t-0 border-[#ffd5c2] p-5 bg-white">
                    <p className="text-sm text-gray-600 leading-relaxed">{youtubeSummary}</p>
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
                const url = r.url ? String(r.url) : buildYoutubeSearchUrl(title, channel);

                return (
                  <div
                    key={i}
                    className="flex-shrink-0 w-60 border border-[#7d7373] overflow-hidden hover:border-[#ff4f12]/40 transition-colors group bg-white flex flex-col"
                  >
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col flex-1 block"
                    >
                      <div className="w-full h-32 bg-gray-50 border-b border-[#7d7373] relative overflow-hidden flex-shrink-0">
                        {thumb ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={thumb} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-[#fff8f6]">
                            <Youtube strokeWidth={1} className="w-10 h-10 text-[#ff4f12] opacity-40" />
                          </div>
                        )}
                      </div>
                      <div className="p-3.5 flex flex-col flex-1 justify-between">
                        <div>
                          <p className="text-xs font-medium text-gray-900 line-clamp-2 leading-relaxed mb-1 group-hover:text-[#ff4f12] transition-colors">{title}</p>
                          {channel && <p className="text-[10px] font-medium tracking-wide text-gray-400 mb-2">{channel}</p>}
                        </div>
                        <div className="flex items-center justify-between text-[10px] font-medium text-gray-400 pt-2.5 border-t border-[#7d7373]">
                          {views != null && String(views) !== '' && <span className="text-[#ff4f12]">{formatViews(views as number | string)}</span>}
                          {date && String(date) !== '' && <span>{date}</span>}
                        </div>
                      </div>
                    </a>
                    <div className="border-t border-[#7d7373] p-3 h-[60px] bg-gray-50 flex flex-col justify-center">
                      {videoSummaries[i] ? (
                        <p className="text-[11px] text-gray-600 leading-relaxed max-h-[34px] line-clamp-2" title={videoSummaries[i]}>
                          {videoSummaries[i]}
                        </p>
                      ) : (
                        <button
                          onClick={(e) => handleSummarizeVideo(e, i, title, url)}
                          disabled={loadingSummaries[i]}
                          className="flex items-center justify-center gap-1.5 w-full bg-white border border-[#7d7373] py-1.5 px-2 hover:bg-[#fff8f6] hover:border-[#ffd5c2] hover:text-[#ff4f12] transition-colors disabled:opacity-50 group/btn"
                        >
                          {loadingSummaries[i] ? (
                            <>
                              <div className="w-3 h-3 rounded-full border border-gray-400 border-t-transparent animate-spin"></div>
                              <span className="text-[10px] font-semibold tracking-widest uppercase text-gray-500">Wait...</span>
                            </>
                          ) : (
                            <>
                              <div className="w-3.5 h-3.5 bg-gray-100 group-hover/btn:bg-[#ff4f12] text-gray-500 group-hover/btn:text-white flex items-center justify-center flex-shrink-0 transition-colors">
                                <span className="text-[7px] font-bold leading-none">AI</span>
                              </div>
                              <span className="text-[10px] font-semibold tracking-widest uppercase text-gray-600 group-hover/btn:text-[#ff4f12] transition-colors">Summarize Video</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Reddit */}
      {hasReddit && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-1.5 h-1.5 bg-[#ff4f12]"></span>
            <h2 className="text-sm font-semibold tracking-widest uppercase text-gray-900">Reddit Mentions</h2>
          </div>
          <div className="bg-white border border-[#7d7373] p-5 sm:p-6">
            {redditSummary && (
              <div className="mb-5">
                <button
                  onClick={() => setRedditOpen(!redditOpen)}
                  className="flex items-center gap-2 w-full bg-[#fff8f6] border border-[#ffd5c2] px-4 py-3 hover:bg-[#fff1ec] transition-colors"
                >
                  <div className="w-5 h-5 bg-[#ff4f12] flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-[10px] font-bold leading-none">AI</span>
                  </div>
                  <span className="text-xs font-semibold tracking-widest uppercase text-gray-700">AI Summary</span>
                  <ChevronDown strokeWidth={2} className={`w-4 h-4 text-[#ff4f12] ml-auto transition-transform ${redditOpen ? 'rotate-180' : ''}`} />
                </button>
                {redditOpen && (
                  <div className="border border-t-0 border-[#ffd5c2] p-5 bg-white">
                    <p className="text-sm text-gray-600 leading-relaxed">{redditSummary}</p>
                  </div>
                )}
              </div>
            )}
            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
              {reddit.map((post, i) => {
                const r = post as Record<string, unknown>;
                const subreddit = String(r.subreddit || r.community || 'reddit');
                const title = String(r.title || 'Untitled');
                const url = r.url ? String(r.url) : buildRedditUrl(subreddit, title);
                const score = r.score != null ? Number(r.score) : null;

                return (
                  <a
                    key={i}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0 w-60 border border-[#7d7373] p-4 hover:border-[#ff4f12]/40 transition-colors group bg-gray-50 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-1.5 mb-2.5">
                        <span className="text-[10px] font-semibold tracking-wide uppercase text-[#ff4f12]">{subreddit.startsWith('r/') ? subreddit : `r/${subreddit}`}</span>
                        <ExternalLink strokeWidth={1.5} className="w-3 h-3 text-[#ff4f12] opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <p className="text-sm font-medium text-gray-900 line-clamp-3 leading-relaxed group-hover:text-[#ff4f12] transition-colors">{title}</p>
                    </div>
                    {score != null && !isNaN(score) && (
                      <div className="mt-3 pt-2.5 border-t border-[#7d7373]">
                        <p className="text-[10px] font-medium tracking-wide text-gray-500">{score.toLocaleString()} upvotes</p>
                      </div>
                    )}
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
