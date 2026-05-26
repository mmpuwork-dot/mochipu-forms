import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const { texts, sourceLang } = await req.json();

    if (!texts?.length) return NextResponse.json({ translations: [] });

    // ZH submissions are already in Chinese — skip
    if (sourceLang === 'zh') {
      return NextResponse.json({ translations: texts, skipped: true });
    }

    const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;
    if (!apiKey) {
      // No key configured — fall back to original
      return NextResponse.json({ translations: texts, skipped: true });
    }

    const source = sourceLang === 'ja' ? 'ja' : 'en';

    const response = await fetch(
      `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          q:      texts,
          source: source,
          target: 'zh-TW',   // Traditional Chinese
          format: 'text',
        }),
      },
    );

    if (!response.ok) {
      const err = await response.text();
      console.error('[translate] Google API error:', err);
      return NextResponse.json({ error: 'Translation failed' }, { status: 500 });
    }

    const data = await response.json();
    const translations = (data.data.translations as { translatedText: string }[]).map(
      (t) => t.translatedText,
    );

    return NextResponse.json({ translations });

  } catch (error) {
    console.error('[translate] error:', error);
    return NextResponse.json({ error: 'Translation failed' }, { status: 500 });
  }
}
