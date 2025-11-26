"use client";

import { getEventProgram, getEventProgramId } from '@project/anchor'
import { Cluster, PublicKey, ComputeBudgetProgram} from '@solana/web3.js'
import { TOKEN_PROGRAM_ID } from '@coral-xyz/anchor/dist/cjs/utils/token'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { useCluster } from '@/components/cluster/cluster-data-access'
import { useTransactionToast } from '@/components/use-transaction-toast'
import { toast } from 'sonner'
import * as anchor from "@coral-xyz/anchor"
import { useAnchorProvider } from '../solana/solana-provider'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'



interface InitializeEventArgs {
  event: PublicKey;
  name: string;
  description: string;
  url: string;
  attendanceCodeHash: Uint8Array;
  startTime: anchor.BN;
  endTime: anchor.BN;
  totalAttentees: number;
  collection_mint: PublicKey;
}

interface RegistrationAccountArgs {
  event: PublicKey;
  registration: PublicKey;
}

interface CloseEventArgs {
  event: PublicKey;
}

interface CloseRegistrationArgs {
  event: PublicKey;
  registration: PublicKey;
}

interface MintNftArgs {
  event: PublicKey;
  registration: PublicKey;
  attentance_code: Uint8Array;
  collection_mint: PublicKey,
  nftMintPda: PublicKey,
  child_nft_metadata: PublicKey,
  child_nft_master_edition: PublicKey,
  metadata: PublicKey,
  master_edition: PublicKey,
  destination: PublicKey
}

export function useCounterProgram() {
  const { connection } = useConnection()
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const provider = useAnchorProvider()
  const programId = useMemo(() => getEventProgramId(cluster.network as Cluster), [cluster])
  const program = useMemo(() => getEventProgram(provider, programId), [provider, programId])
  const { publicKey } = useWallet();

  const accounts = useQuery({
    queryKey: ['event', 'all', { cluster }],
    queryFn: () => program.account.event.all(),
  })

  const registrationAccounts = useQuery({
    queryKey: ['registration', 'user', { cluster, publicKey }],
    queryFn: () => program.account.eventRegistration.all()
  })

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  })

  // const getUsersRegistraionAccount = useQuery({
  //   queryKey:['get-only-registration-account',{cluster,publicKey}],
  //   queryFn:()=> program.account.eventRegistration.fetchNullable()
  // })

  const getUsersRegistraionAccount = (eventAccount: PublicKey) => {
  return useQuery({
    enabled: !!publicKey && !!eventAccount && !!program,
    queryKey: [
      "get-only-registration-account",
      { cluster, publicKey: publicKey?.toBase58(), event: eventAccount.toBase58() },
    ],
    queryFn: async () => {
      if (!publicKey) return toast("wallet not connected");

      const [registrationAccountPda] = anchor.web3.PublicKey.findProgramAddressSync(
        [
          Buffer.from("attentee"),
          eventAccount.toBuffer(),
          publicKey.toBuffer(),
        ],
        programId
      );

      const registration = await program.account.eventRegistration.fetchNullable(
        registrationAccountPda
      );

      // ✅ Only return real registration data or `null`
      if (registration) {
        return registration;
      } else {
        return null;
      }
    },
  });
};




  const createEventAccount = useMutation<string, Error, InitializeEventArgs>({
    mutationKey: ['event', 'initialize', { cluster }],
    mutationFn: ({ event, name, description, url, attendanceCodeHash, startTime, endTime, totalAttentees, collection_mint }) =>
      program.methods.initializeEvent(
        name,
        description,
        url,
        Array.from(attendanceCodeHash),
        startTime,
        endTime,
        totalAttentees,
        collection_mint
      )
        .accounts({ eventAccount: event, tokenProgram: TOKEN_PROGRAM_ID }).rpc(),
    onSuccess: async (signature) => {
      transactionToast(signature)
      await accounts.refetch()
    },
    onError: () => {
      toast.error('Failed to initialize event account')
    },
  })

  const closeEventAccount = useMutation<string, Error, CloseEventArgs>({
    mutationKey: ['event', 'initialize', { cluster }],
    mutationFn: ({ event }) =>
      program.methods.closeEvent()
        .accounts({ eventAccount: event }).rpc(),
    onSuccess: async (signature) => {
      transactionToast(signature)
      await accounts.refetch()
    },
    onError: () => {
      toast.error('Failed to initialize event account')
    },
  })

  const CloseRegistrationAccount = useMutation<string, Error, CloseRegistrationArgs>({
    mutationKey: ['RegistrationAccount', 'initialize', { cluster }],
    mutationFn: async ({ event, registration }) => {
      try {
        return await program.methods
          .cancelRegistration()
          .accounts({
            eventAccount: event,
            registrationAccount: registration,
          })
          .rpc();
      } catch (err: any) {
        console.error("Raw error:", err);

        // Anchor-specific error decoding
        if (err.logs) {
          console.error("Transaction logs:", err.logs);
        }

        // Some Anchor errors have a `error.errorMessage`
        if (err?.error?.errorMessage) {
          throw new Error(err.error.errorMessage);
        }

        // Fallback to err.message
        throw new Error(err.message || "Unknown error");
      }
    },
    onSuccess: async (signature) => {
      transactionToast(signature);
      await accounts.refetch();
    },
    onError: (err: any) => {
      console.error("Decoded error:", err);
      toast.error(`Failed: ${err.message}`);
    },
  });

  const mintNft = useMutation<string, Error, MintNftArgs>({
    mutationKey: ['RegistrationAccount', 'initialize', { cluster }],
    mutationFn: async ({ event, registration, attentance_code }) => {
      try {
        // Build the transaction instead of sending it immediately
        const tx = await program.methods
          .mintNft(Array.from(attentance_code))
          .accounts({
            eventAccount: event,
            registrationAccount: registration,
            tokenProgram: TOKEN_PROGRAM_ID,
          })
          .transaction();

        // ✅ Step 2 — Add compute budget instructions
        const modifyComputeUnits = ComputeBudgetProgram.setComputeUnitLimit({
          units: 600_000, // you can tune this between 400_000–800_000
        });

        const addPriorityFee = ComputeBudgetProgram.setComputeUnitPrice({
          microLamports: 1, // optional: small priority fee
        });

        tx.instructions.unshift(modifyComputeUnits, addPriorityFee);

        // ✅ Step 3 — Send the transaction manually
        const { connection } = program.provider;
        const { publicKey, signTransaction } = program.provider.wallet;

        if (!publicKey) throw new Error("Wallet not connected");

        tx.feePayer = publicKey;
        tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

        const signedTx = await signTransaction(tx);
        const sig = await connection.sendRawTransaction(signedTx.serialize(), {
          skipPreflight: false,
        });

        // Wait for confirmation
        await connection.confirmTransaction(sig, "confirmed");

        return sig;
      } catch (err: any) {
        console.error("Raw error:", err);
        if (err.logs) console.error("Transaction logs:", err.logs);
        throw new Error(err.message || "Unknown error");
      }
    },
    onSuccess: async (signature) => {
      transactionToast(signature);
    },
    onError: (err: any) => {
      console.error("Decoded error:", err);
      toast.error(`Failed: ${err.message}`);
    },
  });



  return {
    program,
    programId,
    accounts,
    registrationAccounts,
    getProgramAccount,
    createEventAccount,
    closeEventAccount,
    CloseRegistrationAccount,
    mintNft,
    getUsersRegistraionAccount
  }
}

export function useCounterProgramAccount({ account }: { account: PublicKey }) {
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const { program, accounts } = useCounterProgram()

  const accountQuery = useQuery({
    queryKey: ['event', 'fetch', { cluster, account }],
    queryFn: () => program.account.event.fetch(account),
    enabled: !!program && !!account,
  })

  const registrationAccountQuery = useQuery({
    queryKey: ['registration', 'user', { cluster, account }],
    queryFn: () => program.account.eventRegistration.fetch(account),
  })



  const createRegistrationAccount = useMutation<string, Error, RegistrationAccountArgs>({
    mutationKey: ['RegistrationAccount', 'initialize', { cluster }],
    mutationFn: async ({ event, registration }) => {
      try {
        return await program.methods
          .registerEvent()
          .accounts({
            eventAccount: event,
            registrationAccount: registration,
          })
          .rpc();
      } catch (err: any) {
        console.error("Raw error:", err);

        // Anchor-specific error decoding
        if (err.logs) {
          console.error("Transaction logs:", err.logs);
        }

        // Some Anchor errors have a `error.errorMessage`
        if (err?.error?.errorMessage) {
          throw new Error(err.error.errorMessage);
        }

        // Fallback to err.message
        throw new Error(err.message || "Unknown error");
      }
    },
    onSuccess: async (signature) => {
      transactionToast(signature);
      await accounts.refetch();
    },
    onError: (err: any) => {
      console.error("Decoded error:", err);
      toast.error(`Failed: ${err.message}`);
    },
  });

  const CloseRegistrationAccount = useMutation<string, Error, CloseRegistrationArgs>({
    mutationKey: ['RegistrationAccount', 'initialize', { cluster }],
    mutationFn: async ({ event, registration }) => {
      try {
        return await program.methods
          .cancelRegistration()
          .accounts({
            eventAccount: event,
            registrationAccount: registration,
          })
          .rpc();
      } catch (err: any) {
        console.error("Raw error:", err);

        // Anchor-specific error decoding
        if (err.logs) {
          console.error("Transaction logs:", err.logs);
        }

        // Some Anchor errors have a `error.errorMessage`
        if (err?.error?.errorMessage) {
          throw new Error(err.error.errorMessage);
        }

        // Fallback to err.message
        throw new Error(err.message || "Unknown error");
      }
    },
    onSuccess: async (signature) => {
      transactionToast(signature);
      await accounts.refetch();
    },
    onError: (err: any) => {
      console.error("Decoded error:", err);
      toast.error(`Failed: ${err.message}`);
    },
  });

  return {
    accountQuery,
    registrationAccountQuery,
    createRegistrationAccount,
    CloseRegistrationAccount
  }
}
