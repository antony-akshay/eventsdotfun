"use client";

import { Keypair, PublicKey } from '@solana/web3.js'
import { ChangeEvent, useMemo, useState } from 'react'
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
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { log } from 'console'
import Ticket from '../ui/Ticket'
import MintModal from './MintModal'


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
      <Ticket />
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


  async function handleRegistration() {
    console.log(publicKey);
    if (publicKey) {
      const [registrationAccountPda] = PublicKey.findProgramAddressSync(
        [
          Buffer.from("attentee"),
          account.toBuffer(),
          publicKey.toBuffer(), // Use publicKey from useWallet()
          // Buffer.from(formData.event_name.trim()) // Trim whitespace
        ],
        program.programId
      );

      await createRegistrationAccount.mutateAsync(
        {
          event: account,
          registration: registrationAccountPda
        }
      )
    }
  }

  async function handleCloseEvent() {
    if (publicKey) {
      await closeEventAccount.mutateAsync(
        {
          event: account
        }
      )
    }
  }

  const { accountQuery, createRegistrationAccount } = useCounterProgramAccount({
    account,
  })

  const eventName = useMemo(() => accountQuery.data?.name ?? 0, [accountQuery.data?.name])

  return accountQuery.isLoading ? (
    <span className="loading loading-spinner loading-lg"></span>
  ) : (
    <Card>
      <CardHeader>
        <CardTitle>Event: {eventName}</CardTitle>
        <CardDescription>
          Account: <ExplorerLink path={`account/${account}`} label={ellipsify(account.toString())} />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={handleRegistration}
            disabled={createRegistrationAccount.isPending}
          >
            Register
          </Button>
          <Button
            variant="outline"
            onClick={handleCloseEvent}
            disabled={createRegistrationAccount.isPending}
          >
            Close
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export function RegistrationList() {
  const { registrationAccounts, getProgramAccount } = useCounterProgram()

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
      {registrationAccounts.isLoading ? (
        <span className="loading loading-spinner loading-lg"></span>
      ) : registrationAccounts.data?.length ? (
        <div className="grid md:grid-cols-2 gap-4">
          {registrationAccounts.data?.map((account) => (
            <RegistrationCard key={account.publicKey.toString()} account={account.publicKey} />
          ))}
        </div>
      ) : (
        <div className="text-center mt-10">
          <h2 className={'text-2xl'}>No accounts</h2>
          No Registration accounts found.
        </div>
      )}
    </div>
  )
}

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

  // Add the handleMint function
  const handleMint = async (code: string): Promise<void> => {
    const TOKEN_METADATA_PROGRAM_ID = new PublicKey(
      "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
    );
    console.log("Mint code entered:", code); // This will print the 4-digit code

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

    const [nftMintPda] = await PublicKey.findProgramAddress(
      [Buffer.from(Uint8Array.of(...new anchor.BN(EventAccount.totalAttentees.toString()).toArray("le", 8)))],
      program.programId
    );

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

    const destinationAta = getAssociatedTokenAddressSync(
      nftMint,               // mint
      publicKey,              // owner
      false,                 // allowOwnerOffCurve (false for wallet)
      TOKEN_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID
    );

    console.log("we are here");
    console.log("Event pubkey:", registrationAccountQuery.data?.event?.toString());
    console.log("Event account:", EventAccount);

    try {
      await mintNft.mutateAsync({
        event: registrationAccountQuery.data?.event,
        registration: account,
        attentance_code: attendanceCodeHash,
        nftMintPda: nftMintPda,
        child_nft_metadata: ChildNftmetadataPda,
        child_nft_master_edition: ChildNftmasterEditionPda,
        metadata: metadataPda,
        master_edition: masterEditionPda,
        destination: destinationAta,
        collection_mint: EventAccount.collectionMint,
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

  const eventName = useMemo(() => registrationAccountQuery.data?.event.toString() ?? 0, [registrationAccountQuery.data?.event.toString()])

  return registrationAccountQuery.isLoading ? (
    <span className="loading loading-spinner loading-lg"></span>
  ) : (
    <>
      <Card className=''>
        <CardHeader>
          <CardTitle>RegistrationTicket: {eventName}</CardTitle>
          <CardDescription>
            Account: <ExplorerLink path={`account/${account}`} label={ellipsify(account.toString())} />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={() => setShowMintModal(true)} // Fixed: wrap in arrow function
              disabled={createRegistrationAccount.isPending}
            >
              Mint
            </Button>
            <Button
              variant="outline"
              onClick={handleCloseRegistration}
              disabled={createRegistrationAccount.isPending}
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>

      <MintModal
        isOpen={showMintModal}
        onClose={() => setShowMintModal(false)}
        onMint={handleMint}
      />
    </>
  )
}

function AccountItem({ account }: { account: PublicKey }) {
  const { publicKey, connected } = useWallet();
  const { getUsersRegistraionAccount, programId } = useCounterProgram();
  const { data: registration, isLoading } = getUsersRegistraionAccount(account);


  if (!publicKey) return;

  const [registrationAccountPda] = anchor.web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from("attentee"),
      account.toBuffer(),
      publicKey.toBuffer(),
    ],
    programId
  );
  console.log(registration);
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-4">
        <span className="loading loading-spinner loading-md"></span>
      </div>
    );
  }

  if (!registration) {
    return <CounterCard account={account} />;
  }

  return <RegistrationCard account={registrationAccountPda} />;
}
