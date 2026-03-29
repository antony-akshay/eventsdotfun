"use client";

import React, { useState } from "react";
import { toast } from "sonner";

interface UploadProps {
  event_name: string;
  description: string;
  onUploadComplete: (url: string) => void;
}

type UploadStatus = "idle" | "uploading" | "success" | "error";

export default function UploadComponent({
  event_name,
  description,
  onUploadComplete,
}: UploadProps) {

  const [status, setStatus] = useState<UploadStatus>("idle");

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setStatus("uploading");

    if (!event_name || !description) {
      setStatus("error")
      toast.error("please provide event name and description");
      return;
    }


    const form = new FormData();
    form.append("file", file);
    form.append("event_name", event_name);
    form.append("description", description);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: form,
      });

      const data: { url?: string; error?: string } = await res.json();

      if (data.error || !data.url) {
        setStatus("error");
        return;
      }

      onUploadComplete(data.url);
      setStatus("success");
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  return (
    <div>
      <label
        className={`border-2 border-black rounded h-12 flex items-center justify-center
          text-sm font-medium cursor-pointer transition-colors w-full
          ${status === "success"
            ? "bg-purple-300 cursor-default"
            : status === "error"
              ? "bg-red-300 hover:bg-red-400"
              : status === "uploading"
                ? "bg-yellow-300 cursor-wait"
                : "bg-gray-300 hover:bg-gray-400"
          }`}
      >
        {status === "idle" && "Upload the image"}
        {status === "uploading" && "Uploading..."}
        {status === "success" && "✅ Upload successful"}
        {status === "error" && "❌ Upload failed"}

        {status !== "success" && (
          <input
            type="file"
            className="hidden"
            onChange={handleUpload}
          />
        )}
      </label>
    </div>
  );
}
