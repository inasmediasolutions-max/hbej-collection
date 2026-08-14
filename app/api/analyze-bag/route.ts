import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { imageUrl, videoUrl } = await req.json();

    const targetUrl = imageUrl || videoUrl;
    if (!targetUrl) {
      return NextResponse.json({ error: 'Image or video URL is required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY is not configured in Vercel Environment Variables' },
        { status: 500 }
      );
    }

    // Fetch media and convert to base64 for Gemini Vision analysis
    const mediaRes = await fetch(targetUrl);
    const mediaBuffer = await mediaRes.arrayBuffer();
    const base64Data = Buffer.from(mediaBuffer).toString('base64');
    let mimeType = mediaRes.headers.get('content-type') || 'image/jpeg';
    if (mimeType.includes('octet-stream')) mimeType = 'image/jpeg';

    const prompt = `You are an expert luxury fashion curator for "HBEJ Collection", a premium bag retailer in Ghana.
Analyze this bag photo/video and output ONLY a raw JSON object (no markdown formatting, no code blocks) with the following fields:
{
  "name": "A short, elegant, high-converting product name for this bag (e.g. 'Executive Leather Tote Bag - Black')",
  "category_slug": "Select the best matching category slug from this exact list: ['handbags', 'tote-bags', 'crossbody-bags', 'shoulder-bags', 'backpacks', 'clutches', 'travel-bags', 'new-arrivals']",
  "short_description": "A concise, engaging 1-2 sentence description highlighting style and usability.",
  "full_description": "A detailed 3-4 sentence luxury description highlighting material, craftsmanship, elegance, and fashion versatility.",
  "material": "Estimated material (e.g. 'Textured Genuine Leather', 'Durable Canvas', 'Patent Leather', 'Quilted Vegan Leather')",
  "color": "Primary color or main color combination"
}`;

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  inline_data: {
                    mime_type: mimeType,
                    data: base64Data,
                  },
                },
                {
                  text: prompt,
                },
              ],
            },
          ],
        }),
      }
    );

    const geminiData = await geminiRes.json();
    const candidateText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    // Clean JSON string
    const jsonString = candidateText.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(jsonString);

    return NextResponse.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error('AI Analysis Error:', error);
    return NextResponse.json({ error: error.message || 'AI analysis failed' }, { status: 500 });
  }
}
