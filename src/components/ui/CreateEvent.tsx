'use client';

import React, { ChangeEvent, useState } from 'react';
import UploadComponent from './upload';
import { useWallet } from '@solana/wallet-adapter-react';
import { useCounterProgram } from '../counter/counter-data-access';

interface EventFormData {
  event_name: string;
  description: string;
  total_no_attendees: string;
  metadata_url: string;
  attendance_code: string;
  start_time: string;
  end_time: string;
}

const CreateEvent: React.FC = () => {
  const { publicKey, connected } = useWallet();
  const { createEventAccount, closeEventAccount, program } = useCounterProgram();
  const [currentView] = useState<'create'>('create');
  const [url, setUrl] = useState("");

  const [formData, setFormData] = useState<EventFormData>({
    event_name: "",
    description: "",
    total_no_attendees: "",
    metadata_url: "",
    attendance_code: "",
    start_time: "",
    end_time: "",
  });

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCancel = () => {
    setFormData({
      event_name: "",
      description: "",
      total_no_attendees: "",
      metadata_url: "",
      attendance_code: "",
      start_time: "",
      end_time: "",
    });
  };

  const handlesubmit = () => {
    if (publickey) {

    }
  }

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
              name='event_name'
              value={formData.event_name}
              onChange={handleInputChange}
              placeholder="event_name"
              className="w-full px-4 py-3 border-2 border-black rounded bg-white focus:outline-none focus:shadow-[4px_4px_0_#000] transition-shadow"
            />
          </div>

          {/* description */}
          <div>
            <textarea
              rows={3}
              name='description'
              value={formData.description}
              onChange={handleInputChange}
              placeholder="description"
              className="w-full px-4 py-3 border-2 border-black rounded bg-white resize-none focus:outline-none focus:shadow-[4px_4px_0_#000] transition-shadow"
            />
          </div>

          {/* total_no_attentees */}
          <div>
            <input
              type="number"
              name='total_no_attendees'
              value={formData.total_no_attendees}
              onChange={handleInputChange}
              placeholder="total_no_attentees"
              className="w-full px-4 py-3 border-2 border-black rounded bg-white focus:outline-none focus:shadow-[4px_4px_0_#000] transition-shadow"
            />
          </div>

          {/* upload_image (gray bar) */}
          <UploadComponent event_name={formData.event_name} description={formData.description} onUploadComplete={(uploadedurl) => setUrl(uploadedurl)} />

          {/* attendance_code */}
          <div>
            <input
              name='attendance_code'
              value={formData.attendance_code}
              onChange={handleInputChange}
              type="text"
              placeholder="attendance_code"
              className="w-full px-4 py-3 border-2 border-black rounded bg-white focus:outline-none focus:shadow-[4px_4px_0_#000] transition-shadow"
            />
          </div>

          {/* start_time & end_time (side-by-side) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name='start_time'
              type="datetime-local"
              placeholder="start_time"
              value={formData.start_time}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border-2 border-black rounded bg-white focus:outline-none focus:shadow-[4px_4px_0_#000] transition-shadow"
            />
            <input
              name='end_time'
              type="datetime-local"
              value={formData.end_time}
              onChange={handleInputChange}
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