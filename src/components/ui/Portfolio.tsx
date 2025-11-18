'use client';

import React, { useState } from 'react';
import Ticket from './Ticket';
import CreateEvent from './CreateEvent';
import logo from '../../assets/events_logo.png';
import { WalletButton } from '../solana/solana-provider';
import { CounterList } from '../counter/counter-ui';

// Type definitions
interface Project {
  name: string;
  description: string;
  repo: string;
  tech: string[];
  stack: string;
}

// Project data
const allProjects: Project[] = [
  {
    name: "zarka-app",
    description: "Zarka App is like Zomato for tailoring — a platform connecting users with tailors for stitching orders and home delivery.",
    repo: "https://github.com/antony-akshay/zarka-app",
    tech: ["Flutter", "Node.js"],
    stack: "Flutter"
  },
  {
    name: "wei",
    description: "Wei is an event management app like Luma and River for ticketing, RSVP tracking, and community event organization.",
    repo: "https://github.com/antony-akshay/wei",
    tech: ["Flutter"],
    stack: "Flutter"
  },
  {
    name: "eventsdotfun",
    description: "Proof of Attendance Protocol (POAP) app that lets organizers issue verifiable blockchain badges to attendees.",
    repo: "https://github.com/antony-akshay/zyra",
    tech: ["Solana", "React", "Vite", "Anchor"],
    stack: "Solana"
  },
  {
    name: "depin-uptime",
    description: "Solana-based uptime tracker that logs website health on-chain for transparent monitoring.",
    repo: "https://github.com/antony-akshay/depin-uptime",
    tech: ["Clerk", "React", "Prisma", "Solana", "Anchor"],
    stack: "Solana"
  },
  {
    name: "portfolio-site",
    description: "A personal portfolio website showcasing my projects and skills, built with React.",
    repo: "https://github.com/antony-akshay/portfolio",
    tech: ["React"],
    stack: "React"
  },
  {
    name: "dashboard-ui",
    description: "A clean and responsive dashboard UI built with React and TailwindCSS.",
    repo: "https://github.com/antony-akshay/sqaris",
    tech: ["React"],
    stack: "React"
  },
  {
    name: "smart-glass-controller",
    description: "Java app connecting to Arduino smart spectacles via Bluetooth for real-time time sync and notifications.",
    repo: "https://github.com/antony-akshay/smart-glass-controller",
    tech: ["Java", "Bluetooth APIs"],
    stack: "Java"
  },
  {
    name: "rotato",
    description: "Rotato — a decentralized ROSCA (chitty) platform built on Ethereum using Pyth Network for entropy, ENS for identity, and Kadena Scaffold for development.",
    repo: "https://github.com/antony-akshay/rotato/",
    tech: ["ENS", "PYTH_ENTROPY", "KADENA"],
    stack: "Ethereum"
  }
];

type ViewType = 'projects' | 'profile' | 'createnewevent' | 'events';

const Portfolio: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('projects');

  const renderContent = () => {
    if (currentView === 'profile') {
      return (
        <div className="flex flex-col items-center text-center space-y-4 p-6">
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {allProjects.map((project, idx) => (
            <Ticket key={idx} />
          ))}
        </div>
      );
    }
    // Projects / Tickets View (Scrollable Grid)
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {allProjects.map((project, idx) => (
          <Ticket key={idx} />
        ))}
        <CounterList/>
      </div>
    );
  };
  // 74c04bbc
  return (
    <div className="min-h-screen bg-[#6315bbbc] py-8 md:py-20 px-4 md:px-0 overflow-x-hidden font-['IBM_Plex_Mono',monospace] text-black">

      {/* Fixed 400px Container */}
      <div className="h-[700px] w-full md:w-4/5 max-w-6xl mx-auto flex flex-col">

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
                  title="Home"
                >
                  <img className='h-12 w-12' src="https://files.catbox.moe/9irnnl.png" alt="" />
                </button>

                {/* <a
                  href="https://github.com/eventsdotfun"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm md:text-base font-bold border-b border-dashed border-black hover:bg-black hover:text-white px-2 py-1 transition-colors"
                >
                  Connect
                </a> */}
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