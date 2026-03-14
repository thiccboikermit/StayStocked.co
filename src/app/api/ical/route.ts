import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid iCal URL" },
        { status: 400 }
      );
    }

    // Basic URL validation
    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        { error: "Invalid URL format" },
        { status: 400 }
      );
    }

    const response = await fetch(url, {
      headers: {
        "User-Agent": "StayStocked/1.0",
        Accept: "text/calendar, text/plain, */*",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch iCal feed: ${response.status} ${response.statusText}` },
        { status: 502 }
      );
    }

    const content = await response.text();

    return NextResponse.json({ content });
  } catch (err: unknown) {
    console.error("iCal proxy error:", err);

    let message = "Failed to fetch iCal feed";
    if (err instanceof Error) {
      message = err.message;
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
