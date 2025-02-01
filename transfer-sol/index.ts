import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  sendAndConfirmTransaction,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { airdrop } from "../airdrop";
import { showBalance } from "../show-balance";

export const transferSol = async (
  from: Keypair,
  to: PublicKey,
  amount: number
) => {
  const conn = new Connection("http://localhost:8899", "confirmed");

  const transaction = new Transaction();

  const instruction = SystemProgram.transfer({
    fromPubkey: from.publicKey,
    toPubkey: to,
    lamports: amount * LAMPORTS_PER_SOL,
  });

  transaction.add(instruction);
  console.log("sending and confirming transaction...");
  await sendAndConfirmTransaction(conn, transaction, [from]);

  console.log("done");
};

const secret = Uint8Array.from([
  215, 37, 212, 245, 149, 101, 144, 50, 75, 74, 135, 14, 198, 96, 220, 241, 14,
  112, 168, 19, 210, 198, 134, 101, 152, 239, 249, 9, 254, 131, 207, 166, 134,
  141, 137, 83, 236, 193, 171, 116, 43, 2, 167, 200, 242, 45, 103, 146, 229, 15,
  180, 91, 200, 235, 17, 216, 167, 253, 11, 99, 47, 166, 9, 17,
]);
const fromKeyPair = Keypair.fromSecretKey(secret);
const toPublicKey = new PublicKey(
  "CV6JPu7JutiAqWnBASht3uzSqSpYLv3iHhWuHpLrMXE9"
);
