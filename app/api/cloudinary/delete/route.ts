import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) return NextResponse.json({ error: "Cloudinary is not configured." }, { status: 503 });
  cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret, secure: true });
  const { publicId, resourceType = "image" } = await request.json();
  if (!publicId) return NextResponse.json({ error: "publicId is required." }, { status: 400 });
  const result = await cloudinary.uploader.destroy(publicId, { resource_type: resourceType === "video" ? "video" : "image" });
  return NextResponse.json({ data: result });
}
