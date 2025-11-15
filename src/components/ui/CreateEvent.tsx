'use client';

import React, { useState } from 'react';
import UploadComponent from './upload';

const CreateEvent: React.FC = () => {
  const [currentView] = useState<'create'>('create');

  return (
    <div className="h-150 bg-[#6315bbbc] py-4 px-2 md:px-0  font-['IBM_Plex_Mono',monospace]">
      {/* ---- Main Container (same as portfolio) ---- */}
        {/* ---- Form Content ---- */}
        <div className="py-2 mt-3 mb-3">
          <form className="max-w-2xl mx-auto space-y-5">

            {/* event_name */}
            <div>
              <input
                type="text"
          
                placeholder="event_name"
                className="w-full px-4 py-3 border-2 border-black rounded bg-white focus:outline-none focus:shadow-[4px_4px_0_#000] transition-shadow"
              />
            </div>

            {/* description */}
            <div>
              <textarea
                rows={3}
                placeholder="description"
                className="w-full px-4 py-3 border-2 border-black rounded bg-white resize-none focus:outline-none focus:shadow-[4px_4px_0_#000] transition-shadow"
              />
            </div>

            {/* total_no_attentees */}
            <div>
              <input
                type="number"
                placeholder="total_no_attentees"
                className="w-full px-4 py-3 border-2 border-black rounded bg-white focus:outline-none focus:shadow-[4px_4px_0_#000] transition-shadow"
              />
            </div>

            {/* upload_image (gray bar) */}
            <UploadComponent/>

            {/* attendance_code */}
            <div>
              <input
                type="text"
                placeholder="attendance_code"
                className="w-full px-4 py-3 border-2 border-black rounded bg-white focus:outline-none focus:shadow-[4px_4px_0_#000] transition-shadow"
              />
            </div>

            {/* start_time & end_time (side-by-side) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="datetime-local"
                placeholder="start_time"
                className="w-full px-4 py-3 border-2 border-black rounded bg-white focus:outline-none focus:shadow-[4px_4px_0_#000] transition-shadow"
              />
              <input
                type="datetime-local"
                placeholder="end_time"
                className="w-full px-4 py-3 border-2 border-black rounded bg-white focus:outline-none focus:shadow-[4px_4px_0_#000] transition-shadow"
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-center gap-4 pt-2">
              <button
                type="button"
                className="px-6 py-2 border-2 border-black rounded bg-white font-bold hover:bg-black hover:text-white transition-colors"
              >
                cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-black text-white rounded font-bold border-2 border-black hover:bg-[#6315bbbc] hover:text-black transition-colors shadow-[4px_4px_0_#000] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
              >
                create
              </button>
            </div>
          </form>
        </div>
      </div>
  );
};

export default CreateEvent;