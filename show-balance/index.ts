import { Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";

export const showBalance = async (publicKey: PublicKey) => {
  const conn = new Connection("http://localhost:8899", "confirmed");

  console.log("getting account info...");
  const response = await conn.getAccountInfo(publicKey);

  return response.lamports / LAMPORTS_PER_SOL;
};

(async () => {
  const publicKey = "CV6JPu7JutiAqWnBASht3uzSqSpYLv3iHhWuHpLrMXE9";
  const balance = await showBalance(new PublicKey(publicKey));

  console.log(`balance for ${publicKey} is ${balance}`);
})();
