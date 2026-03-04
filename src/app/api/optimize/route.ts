import { NextResponse } from "next/server";

type OptimizedItem = {
  item: string;
  quantity: number;
  unit?: string;
  note?: string;
};

type OptimizeResponse = {
  items: OptimizedItem[];
  optimization_notes?: string;
};

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "OpenAI API key not configured" },
        { status: 500 }
      );
    }

    const trip = body.trip as
      | {
          guests?: string;
          nights?: string;
          meals?: string;
          dietary?: string;
          special?: string;
        }
      | undefined;

    const freeformPrompt: string | undefined = body.prompt;

    let promptText: string;

    if (trip) {
      const guests = trip.guests || "unknown";
      const nights = trip.nights || "unknown";
      const meals = trip.meals || "unspecified meals";
      const dietary = trip.dietary || "none";
      const special = trip.special || "none";

      promptText = `
Plan an optimized grocery list for a trip with:
- Guests: ${guests}
- Nights: ${nights}
- Meals to cover: ${meals}
- Dietary restrictions: ${dietary}
- Special requests: ${special}

Return ONLY a JSON object with this exact shape and NOTHING else:

{
  "items": [
    { "item": "Eggs", "quantity": 12, "unit": "pcs", "note": "Enough for 4 guests for 3 breakfasts." }
  ],
  "optimization_notes": "Short explanation of how quantities reduce waste and save money."
}
`.trim();
    } else if (freeformPrompt) {
      promptText = `
Act as StayStocked's cart optimization engine.
User request:
${freeformPrompt}

Return ONLY JSON in this shape:

{
  "items": [
    { "item": "Eggs", "quantity": 12, "unit": "pcs", "note": "..." }
  ],
  "optimization_notes": "Short explanation..."
}
`.trim();
    } else {
      return NextResponse.json(
        { error: "Missing trip data or prompt" },
        { status: 400 }
      );
    }

    const model = "gpt-4.1-mini";

    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: "system",
            content:
              "You are StayStocked's cart optimization engine. Always return ONLY valid JSON, no extra text.",
          },
          { role: "user", content: promptText },
        ],
        temperature: 0.25,
        max_tokens: 450,
      }),
    });

    const data = await openaiRes.json();
    const content = data?.choices?.[0]?.message?.content as string | undefined;

    if (!content) {
      return NextResponse.json(
        {
          items: [],
          optimization_notes: "No AI response returned.",
        },
        { status: 200 }
      );
    }

    let parsed: OptimizeResponse | null = null;

    // Try to parse the returned JSON
    try {
      parsed = JSON.parse(content);
    } catch {
      const match = content.match(/\{[\s\S]*\}/);
      if (match) {
        try {
          parsed = JSON.parse(match[0]);
        } catch {
          parsed = null;
        }
      }
    }

    if (!parsed || !Array.isArray(parsed.items)) {
      // Fallback: treat the content as a note only
      return NextResponse.json(
        {
          items: [],
          optimization_notes: content,
        },
        { status: 200 }
      );
    }

    return NextResponse.json(parsed);
  } catch (err: unknown) {
    console.error("Optimize API Error:", err);

    let message = "Server error";
    if (err instanceof Error) {
      message = err.message;
    } else if (typeof err === "string") {
      message = err;
    }

    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
