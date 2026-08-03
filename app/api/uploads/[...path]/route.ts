import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

// Sirve archivos desde <project_root>/uploads/ — fuera de /public para que sobrevivan los deploys
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path: pathSegments } = await params;
    const safePath = pathSegments.map((segment) =>
      // Previene path traversal
      segment.replace(/\.\./g, "").replace(/\//g, "")
    );

    const filePath = path.join(process.cwd(), "uploads", ...safePath);
    const fileBuffer = await readFile(filePath);

    const ext = safePath[safePath.length - 1].split(".").pop()?.toLowerCase() ?? "";
    const mimeTypes: Record<string, string> = {
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      webp: "image/webp",
      gif: "image/gif",
      avif: "image/avif",
    };
    const contentType = mimeTypes[ext] ?? "application/octet-stream";

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        // Cache 1 día en browser, 7 días en CDN
        "Cache-Control": "public, max-age=86400, s-maxage=604800",
      },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
