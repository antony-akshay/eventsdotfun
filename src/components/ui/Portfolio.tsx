'use client';

import React, { useState } from 'react';
import CreateEvent from './CreateEvent';
import { WalletButton } from '../solana/solana-provider';
import { CounterList } from '../counter/counter-ui';

type ViewType = 'projects' | 'profile' | 'createnewevent' | 'events';

const Portfolio: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('projects');

  const renderContent = () => {
    if (currentView === 'profile') {
      return (
        <div className="flex flex-col items-center text-center space-y-4 p-6 sm:mt-15">
          <img
            className="w-53 h-50"
            src="https://files.catbox.moe/4dmspx.png"
            alt="eventsdotfun logo"
          />
          <p className="text-sm md:text-base max-w-xl">
            eventsdotfun is a Proof of Attendance Protocol (POAP) application that allows event organizers to issue digital badges for attendees. It leverages blockchain to ensure authenticity, enabling participants to collect verifiable proof of their presence at events.
          </p>
        </div>
      );
    }

    if (currentView === 'createnewevent') {
      return <CreateEvent />;
    }

    if (currentView === 'events') {
      return (
        <div className="grid  gap-4">
          <CounterList />
        </div>
      );
    }
    return (
      <div className="grid  gap-4">
        <CounterList />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#6315bbbc] py-8 md:py-20 px-4 md:px-0 overflow-x-hidden font-['IBM_Plex_Mono',monospace] text-black">

      {/* Fixed 400px Container */}
      <div className="h-[700px] w-full sm:h-[800px] md:w-4/5 max-w-6xl mx-auto flex flex-col lg:mt-5">

        {/* Main Shadowed Container */}
        <div className="flex-1 bg-[#f9f6ef] border-[3px] border-black rounded-lg shadow-[6px_6px_0_#000] overflow-hidden flex flex-col">

          {/* Header - Fixed */}
          <div className="border-b-2 border-black p-4 bg-[#f4f1e9] flex-shrink-0">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
              <div className="flex items-center space-x-2">
                <img
                  className="w-13 h-12"
                  src="https://files.catbox.moe/4dmspx.png"
                  alt="logo"
                />
                <h2
                  onClick={() => setCurrentView('profile')}
                  className="m-0 cursor-pointer text-xl md:text-2xl font-bold hover:underline"
                >
                  eventsdotfun
                </h2>
              </div>

              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setCurrentView('createnewevent')}
                  className="text-2xl font-bold hover:scale-110 transition-transform"
                  title="Create New Event"
                >
                  <img className='h-9 w-10' src="https://files.catbox.moe/7m9p5z.png" alt="" />
                </button>
                <button
                  onClick={() => setCurrentView('events')}
                  className="text-2xl font-bold hover:scale-110 transition-transform"
                  title="Home"
                >
                  <img className='h-11 w-12' src="https://files.catbox.moe/5l1xv4.png" alt="" />
                </button>

                <button
                  className="text-2xl font-bold hover:scale-110 transition-transform"
                  title="twitter"
                >
                  <a href="https://x.com/eventsdotfun"><img className='h-12 w-12' src="https://files.catbox.moe/9irnnl.png" alt="" /></a>
                </button>
                <WalletButton />
              </div>
            </div>
          </div>

          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;