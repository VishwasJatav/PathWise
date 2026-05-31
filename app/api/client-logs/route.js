import { NextResponse } from "next/server";
import { logger } from "@/lib/logger";

export async function POST(req) {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ success: false, error: "Only available in development" }, { status: 403 });
  }

  try {
    const { level, args, url } = await req.json();
    let pathname = "/";
    
    try {
      pathname = new URL(url).pathname;
    } catch (e) {
      // fallback if URL is malformed
    }

    const formattedMessage = args
      .map((arg) => (typeof arg === "object" ? JSON.stringify(arg, null, 2) : String(arg)))
      .join(" ");

    // Format console output to match server log levels
    switch (level) {
      case "WARN":
        logger.warn(`[Client] ${formattedMessage}`, { path: pathname });
        break;
      case "ERROR":
        logger.error(`[Client] ${formattedMessage}`, { path: pathname });
        break;
      case "INFO":
      default:
        logger.info(`[Client] ${formattedMessage}`, { path: pathname });
        break;
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
