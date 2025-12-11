"use client";

import { Keypair, PublicKey } from '@solana/web3.js'
import { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react'
import { ExplorerLink } from '@/components/cluster/cluster-ui'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ellipsify } from '@/lib/utils'
import { useCounterProgram, useCounterProgramAccount } from './counter-data-access'
import * as anchor from "@coral-xyz/anchor"
import { sha256 } from "@noble/hashes/sha256"
import { useWallet } from '@solana/wallet-adapter-react'

import {
  getAssociatedTokenAddressSync,
  createAssociatedTokenAccountInstruction,
  ASSOCIATED_TOKEN_PROGRAM_ID as SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { log } from 'console'
import MintModal from './MintModal'
import Image from 'next/image';


export function CounterCreate() {
  const { publicKey, connected } = useWallet();
  const { createEventAccount, closeEventAccount, program } = useCounterProgram();

  interface EventFormData {
    event_name: string;
    description: string;
    total_no_attendees: string;
    metadata_url: string;
    attendance_code: string;
    start_time: string;
    end_time: string;
  }

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

  const handleSubmit = () => {
    if (publicKey) {

      const [eventAccountPda] = PublicKey.findProgramAddressSync(
        [
          Buffer.from("event"),
          publicKey.toBuffer(), // Use publicKey from useWallet()
          Buffer.from(formData.event_name.trim()) // Trim whitespace
        ],
        program.programId
      );

      const attendanceCodeHash = Buffer.from(
        sha256(Buffer.from(formData.attendance_code, "utf-8"))
      );
      const startTimestamp = Math.floor(
        new Date(formData.start_time).getTime() / 1000
      );
      const endTimestamp = Math.floor(
        new Date(formData.end_time).getTime() / 1000
      );
      const startTime = new anchor.BN(startTimestamp);
      const endTime = new anchor.BN(endTimestamp);

      const [collectionMintPda] = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("collection_mint"), Buffer.from(formData.event_name.trim())],
        program.programId
      );

      createEventAccount.mutateAsync({
        event: eventAccountPda,
        name: formData.event_name,
        description: formData.description,
        url: formData.metadata_url,
        attendanceCodeHash: attendanceCodeHash,
        startTime: startTime,
        endTime: endTime,
        totalAttentees: parseInt(formData.total_no_attendees, 10),
        collection_mint: collectionMintPda
      })

      if (!publicKey) {
        return <p>Connect Your Wallet</p>
      }
    }
  }


  return (
    // <Button onClick={() => initialize.mutateAsync(Keypair.generate())} disabled={initialize.isPending}>
    //   Create {initialize.isPending && '...'}
    // </Button>
    <div>
      <div
        className="flex items-center justify-center p-4"
        style={{ fontFamily: "Comic Sans MS, cursive" }}
      >
        <div className="relative">
          {/* Background shape */}
          <div
            className="absolute inset-0 bg-gradient-to-br from-blue-300 to-blue-400 opacity-90"
            style={{
              borderRadius: "60px 40px 55px 45px",
              transform: "rotate(-0.5deg)",
            }}
          />

          {/* Form */}
          <div
            className="relative bg-gradient-to-r from-black-900 to-black-800 bg-opacity-90 p-8 shadow-2xl"
            style={{
              borderRadius: "55px 35px 50px 40px",
              minWidth: "800px",
              maxWidth: "600px",
            }}
          >
            <div className="space-y-6">
              {/* Event Name */}
              <input
                type="text"
                name="event_name"
                value={formData.event_name}
                onChange={handleInputChange}
                placeholder="event_name"
                className="w-full px-6 py-4 text-lg text-blue-700 placeholder-blue-300 bg-blue-50 border-2 border-blue-300 focus:border-blue-500 focus:outline-none transition-colors"
                style={{
                  borderRadius: "25px 20px 25px 20px",
                  fontFamily: "Comic Sans MS, cursive",
                }}
              />

              {/* Description */}
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="description"
                rows={3}
                className="w-full px-6 py-4 text-lg text-blue-700 placeholder-blue-300 bg-blue-50 border-2 border-blue-300 focus:border-blue-500 focus:outline-none transition-colors resize-none"
                style={{
                  borderRadius: "25px 20px 25px 20px",
                  fontFamily: "Comic Sans MS, cursive",
                }}
              />

              {/* Total Attendees */}
              <input
                type="number"
                name="total_no_attendees"
                value={formData.total_no_attendees}
                onChange={handleInputChange}
                placeholder="total_no_attendees"
                className="w-full px-6 py-4 text-lg text-blue-700 placeholder-blue-300 bg-blue-50 border-2 border-blue-300 focus:border-blue-500 focus:outline-none transition-colors"
                style={{
                  borderRadius: "25px 20px 25px 20px",
                  fontFamily: "Comic Sans MS, cursive",
                }}
              />

              {/* Metadata URL */}
              <input
                type="url"
                name="metadata_url"
                value={formData.metadata_url}
                onChange={handleInputChange}
                placeholder="metadata_url"
                className="w-full px-6 py-4 text-lg text-blue-700 placeholder-blue-300 bg-blue-50 border-2 border-blue-300 focus:border-blue-500 focus:outline-none transition-colors"
                style={{
                  borderRadius: "25px 20px 25px 20px",
                  fontFamily: "Comic Sans MS, cursive",
                }}
              />

              {/* Attendance Code */}
              <input
                type="text"
                name="attendance_code"
                value={formData.attendance_code}
                onChange={handleInputChange}
                placeholder="attendance_code"
                className="w-full px-6 py-4 text-lg text-blue-700 placeholder-blue-300 bg-blue-50 border-2 border-blue-300 focus:border-blue-500 focus:outline-none transition-colors"
                style={{
                  borderRadius: "25px 20px 25px 20px",
                  fontFamily: "Comic Sans MS, cursive",
                }}
              />

              {/* Start + End Time */}
              <div className="flex gap-4">
                <input
                  type="datetime-local"
                  name="start_time"
                  value={formData.start_time}
                  onChange={handleInputChange}
                  className="flex-1 w-full px-6 py-4 text-lg text-blue-700 bg-blue-50 border-2 border-blue-300 focus:border-blue-500 focus:outline-none transition-colors"
                  style={{
                    borderRadius: "25px 20px 25px 20px",
                    fontFamily: "Comic Sans MS, cursive",
                  }}
                />
                <input
                  type="datetime-local"
                  name="end_time"
                  value={formData.end_time}
                  onChange={handleInputChange}
                  className="flex-1 w-full px-6 py-4 text-lg text-blue-700 bg-blue-50 border-2 border-blue-300 focus:border-blue-500 focus:outline-none transition-colors"
                  style={{
                    borderRadius: "25px 20px 25px 20px",
                    fontFamily: "Comic Sans MS, cursive",
                  }}
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-center gap-6 pt-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-8 py-3 text-lg text-blue-600 bg-white border-2 border-blue-300 hover:bg-blue-50 transition-colors"
                  style={{
                    borderRadius: "20px 15px 20px 15px",
                    fontFamily: "Comic Sans MS, cursive",
                  }}
                >
                  cancel
                </button>
                <Button onClick={handleSubmit} disabled={createEventAccount.isPending}
                  type="button"
                  style={{
                    borderRadius: "20px 15px 20px 15px",
                    fontFamily: "Comic Sans MS, cursive",
                  }}
                  className="px-8 py-8 text-lg text-white-600 bg-blue-700 hover:bg-white border-2 border-white-300 hover:bg-white-50 transition-colors">
                  Create {createEventAccount.isPending && '...'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <Ticket /> */}
    </div>
  )
}

export function CounterList() {
  const { accounts, getProgramAccount, getUsersRegistraionAccount } = useCounterProgram();


  if (getProgramAccount.isLoading) {
    return <span className="loading loading-spinner loading-lg"></span>
  }
  if (!getProgramAccount.data?.value) {
    return (
      <div className="alert alert-info flex justify-center">
        <span>Program account not found. Make sure you have deployed the program and are on the correct cluster.</span>
      </div>
    )
  }
  return (
    <div className={'space-y-6'}>
      {accounts.isLoading ? (
        <span className="loading loading-spinner loading-lg"></span>
      ) : accounts.data?.length ? (
        <div className="grid md:grid-cols-2 gap-4">
          {accounts.data?.map((account) => (
            <AccountItem key={account.publicKey.toString()} account={account.publicKey} />
          ))}

        </div>
      ) : (
        <div className="text-center">
          <h2 className={'text-2xl'}>No accounts</h2>
          No accounts found. Create one above to get started.
        </div>
      )}
    </div>
  )
}

function CounterCard({ account }: { account: PublicKey }) {
  const { publicKey } = useWallet();
  const { program, closeEventAccount } = useCounterProgram();

  const { accountQuery, createRegistrationAccount } = useCounterProgramAccount({
    account,
  });

  async function handleRegistration() {
    if (publicKey) {
      const [registrationAccountPda] = PublicKey.findProgramAddressSync(
        [
          Buffer.from("attentee"),
          account.toBuffer(),
          publicKey.toBuffer(),
        ],
        program.programId
      );

      await createRegistrationAccount.mutateAsync({
        event: account,
        registration: registrationAccountPda,
      });
    }
  }

  async function handleCloseEvent() {
    if (publicKey) {
      await closeEventAccount.mutateAsync({
        event: account,
      });
    }
  }

  const eventName = useMemo(
    () => accountQuery.data?.name ?? "Loading...",
    [accountQuery.data?.name]
  );

  const start_time = accountQuery.data?.startTime.toString() ?? "";
  const end_time = accountQuery.data?.endTime.toString() ?? "";

  const eventDescription = accountQuery.data?.description ?? "";
  const eventMetadataUrl = accountQuery.data?.url ?? "";

  const [imageUrl, setImageUrl] = useState<string>("");

  const lastFetchedUrl = useRef<string | null>(null);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        if (!eventMetadataUrl) return;
        if (lastFetchedUrl.current === eventMetadataUrl) return; // avoid repeat

        lastFetchedUrl.current = eventMetadataUrl;

        const response = await fetch(eventMetadataUrl);
        const metadata = await response.json();
        setImageUrl(metadata.image);
      } catch (error) {
        console.error("Failed to fetch metadata:", error);
      }
    };

    fetchMetadata();
  }, [eventMetadataUrl]);

  function formatShortDate(unix: number | string) {
    const date = new Date(Number(unix) * 1000);

    const day = date.getDate();
    const month = date.toLocaleString("en-US", { month: "short" });
    const year = date.getFullYear().toString().slice(-2);

    return `${day} ${month} ${year}`;
  }

  return accountQuery.isLoading ? (
    <span className="loading loading-spinner loading-lg"></span>
  ) : (
    <div className="relative bg-white w-[500px] h-[250px] overflow-hidden rounded-xl border border-black 
    // {shadow-[6px_6px_0_#000]}
    ">

      {/* MAIN CONTENT */}
      <div className="flex h-full">

        {/* LEFT SIDE - IMAGE */}
        <div className="w-2/5 flex items-center justify-center p-6">
          <div className="w-[180px] h-[160px] bg-gradient-to-br from-gray-700 to-gray-900 rounded-lg overflow-hidden flex items-center justify-center">
            {imageUrl && (
              <img
                src={imageUrl}
                alt="Event"
                className="w-full h-full object-cover rounded-xl border"
              />
            )}
          </div>
        </div>

        {/* RIGHT SIDE CONTENT */}
        <div className="w-3/5 p-6 flex flex-col justify-between">

          {/* Title + Description */}
          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-800 mt-6">
              {eventName}
            </h2>

            <p className="text-sm text-gray-500">
              {eventDescription}
            </p>
            <div className='flex'>
              <img className='w-5 h-5' src="https://files.catbox.moe/qatofg.png" alt="clock" />
              <p className='text-sm ml-3'> {formatShortDate(Number(start_time))} - {formatShortDate(Number(end_time))}
              </p>
            </div>
          </div>

          {/* BUTTONS */}
          <div className="flex justify-center gap-4 mt-4">
            {/* Register */}
            <button
              onClick={handleRegistration}
              disabled={createRegistrationAccount.isPending}
              className={`
      px-6 py-2 rounded font-bold border-2 border-black rounded
      transition-all shadow-[4px_4px_0_#000]
      active:shadow-none active:translate-x-[2px] active:translate-y-[2px]
      ${!createRegistrationAccount.isPending
                  ? "bg-black text-white hover:bg-[#6315bbbc] hover:text-black"
                  : "bg-gray-300 text-gray-600 cursor-not-allowed border-gray-400 shadow-none"
                }
    `}
            >
              Register
            </button>

            {/* Close */}
            {
              accountQuery.data?.creator.toBase58() === publicKey?.toBase58() ?
              <button
              onClick={handleCloseEvent}
              disabled={createRegistrationAccount.isPending}
              className={`
                px-6 py-2 bg-white border-2 border-black rounded font-bold
                transition-all shadow-[4px_4px_0_#000]
                active:shadow-none active:translate-x-[2px] active:translate-y-[2px]
                ${createRegistrationAccount.isPending
                  ? "cursor-not-allowed bg-gray-200 text-gray-500 border-gray-400 shadow-none"
                  : "text-red-600 hover:bg-red-500 hover:text-white"
                }
              `}
            >
              Close
            </button>: null
            }
            
          </div>

        </div>

      </div>
    </div>
  );
}

// export function RegistrationList() {
//   const { registrationAccounts, getProgramAccount } = useCounterProgram()

//   if (getProgramAccount.isLoading) {
//     return <span className="loading loading-spinner loading-lg"></span>
//   }
//   if (!getProgramAccount.data?.value) {
//     return (
//       <div className="alert alert-info flex justify-center">
//         <span>Program account not found. Make sure you have deployed the program and are on the correct cluster.</span>
//       </div>
//     )
//   }
//   return (
//     <div className={'space-y-6'}>
//       {registrationAccounts.isLoading ? (
//         <span className="loading loading-spinner loading-lg"></span>
//       ) : registrationAccounts.data?.length ? (
//         <div className="grid md:grid-cols-2 gap-4">
//           {registrationAccounts.data?.map((account) => (
//             <RegistrationCard key={account.publicKey.toString()} account={account.publicKey} />
//           ))}
//         </div>
//       ) : (
//         <div className="text-center mt-10">
//           <h2 className={'text-2xl'}>No accounts</h2>
//           No Registration accounts found.
//         </div>
//       )}
//     </div>
//   )
// }

function RegistrationCard({ account }: { account: PublicKey }) {
  const { publicKey, connected } = useWallet();
  const { CloseRegistrationAccount, program, mintNft, accounts } = useCounterProgram();
  const { accountQuery, registrationAccountQuery, createRegistrationAccount } = useCounterProgramAccount({
    account,
  })

  // Move useState to the top level of the component
  const [showMintModal, setShowMintModal] = useState<boolean>(false);

  async function handleCloseRegistration() {
    if (!registrationAccountQuery.data?.event) return;
    await CloseRegistrationAccount.mutateAsync({
      event: registrationAccountQuery.data?.event,
      registration: account
    })
  }

  const TOKEN_METADATA_PROGRAM_ID = new PublicKey(
    "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
  );

  function getMetadataPDA(mint: PublicKey): PublicKey {
    return PublicKey.findProgramAddressSync(
      [
        Buffer.from("metadata"),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        mint.toBuffer(),
      ],
      TOKEN_METADATA_PROGRAM_ID
    )[0];
  }
  function getMasterEditionPDA(mint: PublicKey): PublicKey {
    return PublicKey.findProgramAddressSync(
      [
        Buffer.from("metadata"),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        mint.toBuffer(),
        Buffer.from("edition"),
      ],
      TOKEN_METADATA_PROGRAM_ID
    )[0];
  }
  function getCollectionMintPDA(name: string, programId: PublicKey) {
    return PublicKey.findProgramAddressSync(
      [Buffer.from("collection_mint"), Buffer.from(name)],
      programId
    )[0];
  }
  function getCollectionTokenAccountPDA(name: string, programId: PublicKey) {
    return PublicKey.findProgramAddressSync(
      [Buffer.from("collection_associated_token"), Buffer.from(name)],
      programId
    )[0];
  }

  function getNftMintPDA(registrationPda: PublicKey, programId: PublicKey) {
    return PublicKey.findProgramAddressSync(
      [
        Buffer.from("nft_mint"),
        registrationPda.toBuffer()       // MUST match on-chain seeds
      ],
      programId
    )[0];
  }

  // Associated token account PDA helper (owner, token program, mint) -> associated token program
  function getAssociatedTokenAddressSync(mint: PublicKey, owner: PublicKey) {
    return PublicKey.findProgramAddressSync(
      [owner.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), mint.toBuffer()],
      SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID
    )[0];
  }

  function getEventPDA(payer: PublicKey, name: string, programId: PublicKey) {
    return PublicKey.findProgramAddressSync(
      [Buffer.from("event"), payer.toBuffer(), Buffer.from(name)],
      programId
    )[0];
  }

  const handleMint = async (code: string): Promise<void> => {
    if (!publicKey) return;
    const eventAcc = await program.account.event.fetch(registrationAccountQuery.data?.event!);
    const eventName = accountQuery.data?.name ?? "Loading...";
    const eventPdanew = getEventPDA(publicKey, eventName, program.programId);
    const collectionMintPdanew = getCollectionMintPDA(eventName, program.programId);
    const collectionTokenAccountPdanew = getCollectionTokenAccountPDA(eventName, program.programId);
    const nftMintPdanew = getNftMintPDA(account, program.programId);
    const childMetadataPdanew = getMetadataPDA(nftMintPdanew);
    const childMasterEditionPdanew = getMasterEditionPDA(nftMintPdanew);
    const destinationAtanew = getAssociatedTokenAddressSync(nftMintPdanew, publicKey);

    const collectionMetadataPda = getMetadataPDA(collectionMintPdanew);
    const collectionMasterEditionPda = getMasterEditionPDA(collectionMintPdanew);

    console.log("eventPda:", eventPdanew.toString());
    console.log("collectionMintPda:", collectionMintPdanew.toBase58());
    console.log("collectionTokenAccountPda:", collectionTokenAccountPdanew.toBase58());
    console.log("collectionMetadataPda:", collectionMetadataPda.toBase58());

    console.log("Mint code entered:", code);

    if (!account) return;
    console.log("we are here 1 here");

    if (!registrationAccountQuery.data?.event) return;
    console.log("we are here 1.1");
    // console.log(accountQuery);
    // if(!accountQuery.data?.collectionMint) return;
    console.log("we are here 2");
    if (!publicKey) return;
    console.log("we are here 3");
    const attendanceCodeHash = Buffer.from(
      sha256(Buffer.from(code, "utf-8"))
    );

    const EventAccount = await program.account.event.fetch(
      registrationAccountQuery.data?.event
    );
    console.log("eventAccount for this account:", EventAccount.name);
    console.log("registrationAccontQuery for event: ", registrationAccountQuery.data?.event.toString());

    const [nftMintPda] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("nftmint"),
        account.toBuffer()
      ],
      program.programId,
    );

    console.log("inside counter-ui nftmintpda:", nftMintPda);

    const nftMint = new PublicKey(nftMintPda);

    const [ChildNftmetadataPda, childbump] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("metadata"),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        nftMint.toBuffer(),
      ],
      TOKEN_METADATA_PROGRAM_ID
    );

    const [ChildNftmasterEditionPda, mastereditionbump] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("metadata"),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        nftMint.toBuffer(),
        Buffer.from("edition"),
      ],
      TOKEN_METADATA_PROGRAM_ID
    );

    const [metadataPda] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("metadata"),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        EventAccount.collectionMint.toBuffer(),
      ],
      TOKEN_METADATA_PROGRAM_ID
    );

    const [masterEditionPda] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("metadata"),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        EventAccount.collectionMint.toBuffer(),
        Buffer.from("edition"),
      ],
      TOKEN_METADATA_PROGRAM_ID
    );

    const destinationAta = getAssociatedTokenAddressSync(nftMint, publicKey);

    console.log("we are here");
    console.log("Event pubkey:", registrationAccountQuery.data?.event?.toString());
    console.log("Event account:", EventAccount);

    console.log("Program Id:", program.programId.toBase58());

    console.log("User wallet publicKey:", publicKey?.toBase58());

    console.log("Event Account PDA:", registrationAccountQuery.data?.event?.toBase58());

    console.log("Derived nft_mint PDA:", nftMintPda.toBase58());

    console.log("Registration Account PDA:", account.toBase58());

    console.log("Collection Mint:", EventAccount.collectionMint.toBase58());

    console.log("Mint accounts to pass:", {
      eventAccount: registrationAccountQuery.data?.event.toBase58(),
      registrationAccount: account.toBase58(),
      collectionMint: EventAccount.collectionMint.toBase58(),
      nftMint: nftMintPda.toBase58(),
      // other metadata accounts...
    });


    try {
      await mintNft.mutateAsync({
        event: registrationAccountQuery.data?.event!,
        registration: account,
        attentance_code: attendanceCodeHash,
        collection_mint: collectionMintPdanew,
        nftMintPda: nftMintPdanew,
        child_nft_metadata: childMetadataPdanew,
        child_nft_master_edition: childMasterEditionPdanew,
        metadata: metadataPda,
        master_edition: masterEditionPda,
        destination: destinationAtanew
      })
      // // Your mint logic here - adjust according to your mintNft function
      // await mintNft.mutateAsync({ 
      //   account, 
      //   code // Pass the code if your mint function needs it
      // });
      // console.log("Mint successful!");
    } catch (error) {
      console.error("Mint failed:", error);
      throw error;
    }
  };

  // AFTER
  const eventKeyStr = registrationAccountQuery.data?.event?.toString() ?? null;

  const eventPubkey = useMemo(() => {
    if (!eventKeyStr) return null;
    return new PublicKey(eventKeyStr);
  }, [eventKeyStr]);

  const [eventAccount, setEventAccount] = useState<any>(null);
  const lastFetchedEvent = useRef<string | null>(null);

  useEffect(() => {
    async function fetchEvent() {
      if (!eventPubkey) return;

      const keyStr = eventPubkey.toString();
      if (lastFetchedEvent.current === keyStr) return; // prevent refetch loop
      lastFetchedEvent.current = keyStr;

      const acc = await program.account.event.fetch(eventPubkey);
      setEventAccount(acc);
    }
    fetchEvent();
  }, [eventPubkey, program]);


  const eventName = eventAccount?.name ?? "Loading...";

  const eventMetadataUrl = eventAccount?.url ?? "";

  const eventDescription = eventAccount?.description ?? "";

  const [imageUrl, setImageUrl] = useState<string>("");

  const lastFetchedUrl = useRef<string | null>(null);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        if (!eventMetadataUrl) return;
        if (lastFetchedUrl.current === eventMetadataUrl) return; // avoid repeat

        lastFetchedUrl.current = eventMetadataUrl;

        const response = await fetch(eventMetadataUrl);
        const metadata = await response.json();
        setImageUrl(metadata.image);
      } catch (error) {
        console.error("Failed to fetch metadata:", error);
      }
    };

    fetchMetadata();
  }, [eventMetadataUrl]);




  return registrationAccountQuery.isLoading ? (
    <span className="loading loading-spinner loading-lg"></span>
  ) : (
    <>
      <>
        <div className="relative bg-white w-[500px] h-[250px] overflow-hidden rounded-xl ">
          {/* Top Scalloped Edge */}
          <div className="absolute top-0 left-0 right-0 h-2 flex -translate-y-1/2 z-10">
            {Array.from({ length: 15 }).map((_, i) => (
              <div
                key={`top-${i}`}
                className="w-4 h-4 bg-[#f9f6ef] rounded-full flex-shrink-0"
                style={{ marginLeft: i === 0 ? 0 : '16px' }}
              />
            ))}
          </div>

          {/* Bottom Scalloped Edge */}
          <div className="absolute bottom-0 left-0 right-0 h-2 flex translate-y-6/2 z-10">
            {Array.from({ length: 15 }).map((_, i) => (
              <div
                key={`bottom-${i}`}
                className="w-4 h-4 bg-[#f9f6ef] rounded-full flex-shrink-0"
                style={{ marginLeft: i === 0 ? 0 : '16px' }}
              />
            ))}
          </div>

          {/* Left Corner Semicircles */}
          <div className="absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-[#f9f6ef] rounded-full z-20" />
          <div className="absolute left-0 bottom-0 -translate-x-1/2 translate-y-1/2 w-8 h-8 bg-[#f9f6ef] rounded-full z-20" />

          {/* Right Large Semicircle Cutout */}
          <div className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-[#f9f6ef] rounded-full z-20" />

          {/* Ticket Content */}
          <div className="flex h-full relative z-5">
            {/* Left Side – Icon */}
            <div className="w-2/5 flex items-center justify-center p-6">
              <div className="w-[180px] h-[160px] bg-gradient-to-br from-gray-700 to-gray-900 rounded-lg flex items-center justify-center overflow-hidden">
                {imageUrl && (
                  <img
                    src={imageUrl}
                    alt="Event NFT"
                    className="w-full h-full object-cover rounded-xl border"
                  />
                )}
              </div>

            </div>

            {/* Right Side – Actual Registration Details */}
            <div className="w-3/5 p-6 flex flex-col justify-between">
              {/* Title + account info */}
              <div className="space-y-3">
                <h2 className="text-xl font-semibold text-gray-800 mt-6">
                  {eventName}
                </h2>

                <p className="text-sm text-gray-500 break-all">
                  {/* Account:{" "} */}
                  {eventDescription}
                  {/* <ExplorerLink
                    path={`account/${account}`}
                    label={ellipsify(account.toString())}
                  /> */}
                </p>
              </div>

              {/* Buttons */}
              {/* Buttons */}
              <div className="flex justify-center gap-4 mt-4">
                {/* Cancel Button */}
                <button
                  onClick={handleCloseRegistration}
                  disabled={CloseRegistrationAccount.isPending}
                  className="
      px-6 py-2 bg-white border-2 border-black rounded 
      font-bold hover:bg-black hover:text-white 
      transition-all shadow-[4px_4px_0_#000]
      active:shadow-none active:translate-x-[2px] active:translate-y-[2px]
    "
                >
                  Cancel
                </button>

                {/* Mint Button */}
                <button
                  onClick={() => setShowMintModal(true)}
                  disabled={mintNft.isPending}
                  className={`
      px-6 py-2 rounded font-bold border-2 border-black rounded
      transition-all shadow-[4px_4px_0_#000]
      active:shadow-none active:translate-x-[2px] active:translate-y-[2px]
      ${!mintNft.isPending
                      ? "bg-black text-white hover:bg-[#6315bbbc] hover:text-black"
                      : "bg-gray-300 text-gray-600 cursor-not-allowed border-gray-400 shadow-none"
                    }
    `}
                >
                  Mint
                </button>
              </div>

            </div>
          </div>
        </div>

        <MintModal
          isOpen={showMintModal}
          onClose={() => setShowMintModal(false)}
          onMint={handleMint}
        />
      </>


      <MintModal
        isOpen={showMintModal}
        onClose={() => setShowMintModal(false)}
        onMint={handleMint}
      />
    </>
  )
}

function AccountItem({ account }: { account: PublicKey }) {
  const { publicKey } = useWallet();
  const { registrationAccounts } = useCounterProgram();

  if (!publicKey) return null;

  const regList = registrationAccounts.data ?? [];

  // Find the registration for this user + event
  const registration = regList.find((reg) =>
    reg.account.attentee.equals(publicKey) &&
    reg.account.event.equals(account)
  );

  // 🔥 If user already registered → return the actual on-chain registration account
  if (registration) {
    return <RegistrationCard account={registration.publicKey} />;
  }

  // Otherwise → show the "register" card
  return <CounterCard account={account} />;
}
