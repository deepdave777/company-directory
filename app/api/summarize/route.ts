import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { type, titles } = await req.json();

    if (!titles || !Array.isArray(titles) || titles.length === 0) {
      return NextResponse.json({ error: 'No titles provided' }, { status: 400 });
    }

    // Prepare prompt
    let input = '';
    let max_length = 60;
    
    if (type === 'news') {
      input = "Summarize the following news headlines into a short summary: " + titles.join('. ');
      max_length = 100; // allow a bit more for news
    } else if (type === 'video') {
      input = "Summarize what this video title is about in one sentence: " + titles[0];
      max_length = 40; // 2 lines max
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

    // Using a reliable summarization model
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
      // Fallback if model is loading or API limit hit
      if (response.status === 503) {
        return NextResponse.json({ summary: "AI model is currently warming up. Please try again in a few seconds." });
      }
      return NextResponse.json({ error: 'Failed to generate summary' }, { status: response.status });
    }

    const result = await response.json();
    let summaryText = result[0]?.summary_text || 'No summary generated.';
    
    // Clean up if it just repeated the prompt
    if (summaryText.startsWith('Summarize the following')) {
      summaryText = summaryText.replace(/Summarize the following.*?:\s*/i, '');
    }

    return NextResponse.json({ summary: summaryText });
  } catch (error) {
    console.error('Summarize error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
