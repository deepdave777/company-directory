import { NextResponse } from 'next/server';
import { YoutubeTranscript } from 'youtube-transcript';

// Helper to extract YouTube video ID from URL
function extractVideoId(url: string) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url?.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

export async function POST(req: Request) {
  try {
    const { type, titles, url } = await req.json();

    if (!titles || !Array.isArray(titles) || titles.length === 0) {
      return NextResponse.json({ error: 'No titles provided' }, { status: 400 });
    }

    let input = '';
    let max_length = 60;
    
    if (type === 'news') {
      input = "Summarize the following news headlines into a short summary: " + titles.join('. ');
      max_length = 100;
    } else if (type === 'video') {
      let transcriptText = null;
      
      if (url) {
        const videoId = extractVideoId(url);
        if (videoId) {
          try {
            const transcript = await YoutubeTranscript.fetchTranscript(videoId);
            // Limit transcript words to avoid token limits for BART
            transcriptText = transcript.map(t => t.text).join(' ').split(' ').slice(0, 800).join(' ');
          } catch (err) {
            console.warn("Transcript disabled or not found, falling back to title:", err);
          }
        }
      }

      if (transcriptText) {
        input = `Summarize the following YouTube video transcript in a short 2-line sentence. Be extremely concise. Transcript: ${transcriptText}`;
        max_length = 60; // Slightly longer for actual transcript summaries
      } else {
        input = "Summarize what this video title is about in one sentence: " + titles[0];
        max_length = 40;
      }
    } else {
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }

    // Call HuggingFace Inference API
    const hfToken = process.env.HF_TOKEN;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (hfToken) {
      headers['Authorization'] = `Bearer ${hfToken}`;
    }

    const response = await fetch(
      "https://router.huggingface.co/hf-inference/models/facebook/bart-large-cnn",
      {
        headers,
        method: "POST",
        body: JSON.stringify({
          inputs: input,
          parameters: {
            max_length,
            min_length: 15,
            do_sample: false
          }
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error('HF API Error:', errText);
      if (response.status === 503) {
        return NextResponse.json({ summary: "AI model is currently warming up. Please try again in a few seconds." });
      }
      return NextResponse.json({ error: 'Failed to generate summary' }, { status: response.status });
    }

    const result = await response.json();
    let summaryText = result[0]?.summary_text || 'No summary generated.';
    
    if (summaryText.startsWith('Summarize the following')) {
      summaryText = summaryText.replace(/Summarize the following.*?:\s*/i, '');
    }

    return NextResponse.json({ summary: summaryText });
  } catch (error) {
    console.error('Summarize error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
