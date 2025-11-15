"use client";

import React, { useState } from "react";

export default function UploadComponent() {
    const [success, setSuccess] = useState(false);
    const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const form = new FormData();
        form.append("file", file);

        const res = await fetch("/api/upload", {
            method: "POST",
            body: form,
        });

        const data: { url?: string; error?: string } = await res.json();

        if (data.error) {
            setSuccess(false);
            console.error("Upload error:", data.error);
        } else {
            console.log("Catbox URL:", data.url);
        }

    };

    return success ? <div>someoerroroccured</div> : <div className="bg-gray-300 border-2 border-black rounded h-12 flex items-center justify-center text-sm font-medium cursor-pointer hover:bg-gray-400 transition-colors" onChange={handleUpload}>
        <input type="file" onChange={handleUpload} placeholder="upload the image" />
    </div>;
}