import { PublicKey, Connection, LAMPORTS_PER_SOL } from "@solana/web3.js";

// 10**9 = 1 sol

export const airdrop = async (address: string, amount: number) => {
  const publicKey = new PublicKey(address);

  const conn = new Connection("http://localhost:8899", "confirmed");

  const latestBlockHash = await conn.getLatestBlockhash();

  const signature = await conn.requestAirdrop(
    publicKey,
    amount * LAMPORTS_PER_SOL
  );
  //wait for transaction of signature to be confirmed before exiting
  await conn.confirmTransaction({
    blockhash: latestBlockHash.blockhash,
    lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
    signature,
  });
};

airdrop("CV6JPu7JutiAqWnBASht3uzSqSpYLv3iHhWuHpLrMXE9", 6);
