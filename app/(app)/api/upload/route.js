import { cld } from "@/lib/cloudinary";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    if (
      !process.env.CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      return new Response(
        JSON.stringify({
          error:
            "Cloudinary credentials not configured. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file");
    const folder = formData.get("folder") || "misc";

    if (!file) {
      return new Response(JSON.stringify({ error: "No file provided" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Convert the incoming Blob to a Buffer and stream to Cloudinary
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const res = await new Promise((resolve, reject) => {
      const upload = cld.v2.uploader.upload_stream(
        {
          folder: `socialhop/${folder}`,
          resource_type: "auto",
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
      upload.end(buffer);
    });

    return new Response(
      JSON.stringify({
        public_id: res.public_id,
        secure_url: res.secure_url,
        width: res.width,
        height: res.height,
        format: res.format,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (e) {
    console.error("Upload API error:", e);
    return new Response(
      JSON.stringify({ error: e?.message || "Upload failed" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
