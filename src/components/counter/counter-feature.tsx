// "use client";

// import { WalletButton } from '@/components/solana/solana-provider'
// import { ExplorerLink } from '@/components/cluster/cluster-ui'
// import { AppHero } from '@/components/app-hero'
// import { ellipsify } from '@/lib/utils'
// import { useCounterProgram } from './counter-data-access'
// import { CounterCreate, CounterList} from './counter-ui'
// import { useWallet } from '@solana/wallet-adapter-react'

// export default function CounterFeature() {
//   const { publicKey } = useWallet()
//   const { programId } = useCounterProgram()

//   return publicKey ? (
//     <div>
//       <AppHero
//         title={
//           <span className="text-5xl  bg-gradient-to-r from-blue-500 to-white bg-clip-text text-transparent">
//             events.fun → CreateEvent
//           </span>
//         }
//         subtitle={
//           'You can create a new Event Account by clicking the Create button. Each event’s state is stored on-chain, ensuring transparency and security.'
//         }
//       >
//         <p className="mb-6">
//           <ExplorerLink
//             path={`account/${programId}`}
//             label={ellipsify(programId.toString())}
//           />
//         </p>
//         <CounterCreate />
//       </AppHero>

//       <CounterList />
//       <RegistrationList />
//     </div>
//   ) : (
//     <div className="max-w-4xl mx-auto">
//       <div className="hero py-[64px]">
//         <div className="hero-content text-center">
//           <WalletButton />
//         </div>
//       </div>
//     </div>
//   )
// }
