"use client";

import React, { useState } from "react";

interface UploadProps{
    event_name:string;
    description:string;
    onUploadComplete:(url:string)=>void;
}



export default function UploadComponent({event_name,description,onUploadComplete}:UploadProps) {
    const [success, setSuccess] = useState(false);
    const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const form = new FormData();
        form.append("file", file);
        form.append("event_name",event_name);
        form.append("description",description);

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
            if(data.url){
                console.log("Catbox URL:", data.url);
                onUploadComplete(data.url);
            }
        }
    };

    return success ? <div>someoerroroccured</div> : <div className="bg-gray-300 border-2 border-black rounded h-12 flex items-center justify-center text-sm font-medium cursor-pointer hover:bg-gray-400 transition-colors" onChange={handleUpload}>
        <input type="file" onChange={handleUpload} placeholder="upload the image" />
    </div>;
}