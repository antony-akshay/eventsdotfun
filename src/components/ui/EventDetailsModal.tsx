"use client";

import { PublicKey } from "@solana/web3.js";

export default function EventDetailsModal({ open, onClose, event }: any) {
  if (!open || !event) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white w-[500px] p-6 rounded-xl shadow-xl relative">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-black text-xl"
        >
          ✕
        </button>

        {/* Image */}
        {event.imageUrl && (
          <div className="w-full h-[200px] bg-gray-200 rounded-lg overflow-hidden">
            <img
              src={event.imageUrl}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <h2 className="text-2xl font-bold mt-4">{event.name}</h2>

        <p className="text-gray-600 mt-2">{event.description}</p>

        <div className="mt-4 space-y-2 text-gray-700">
          <p><b>Start:</b> {event.start_time}</p>
          <p><b>End:</b> {event.end_time}</p>
          <p><b>Total Attendees:</b> {event.total}</p>
          <p><b>Creator:</b> {event.creator}</p>
        </div>

      </div>
    </div>
  );
}
