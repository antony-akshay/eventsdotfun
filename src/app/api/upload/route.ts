export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get("file") as File;

    if (!file) {
      return new Response(JSON.stringify({ error: "No file provided" }), {
        status: 400,
      });
    }

    const uploadForm = new FormData();
    uploadForm.append("reqtype", "fileupload");
    uploadForm.append("fileToUpload", file);

    const res = await fetch("https://catbox.moe/user/api.php", {
      method: "POST",
      body: uploadForm,
    });

    const text = await res.text(); // Catbox returns plain text URL

    return new Response(JSON.stringify({ url: text }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Upload failed" }), {
      status: 500,
    });
  }
}
