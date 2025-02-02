import * as borsh from "borsh";
import { ENDPOINT } from "../utils/constants";
import {
  Connection,
  Keypair,
  PublicKey,
  sendAndConfirmTransaction,
  SystemProgram,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";
import { airdrop } from "../airdrop";

const CONTRACT_PROGRAM_ID = "AB7KRs9jNw7yREUuiUpEnaAqbmuLCM6itoWAVmWsP8Xc";

class GreetingAccount {
  counter = 0;
  constructor(fields: { counter: number } | undefined = undefined) {
    if (fields) {
      this.counter = fields.counter;
    }
  }
}

const GreetingSchema = new Map([
  [GreetingAccount, { kind: "struct", fields: [["counter", "u32"]] }],
]);

const createDataAccount = async (
  connection,
  parentAccount
): Promise<Keypair> => {
  const dataAccount = Keypair.generate();

  const createAccountInstruction = await SystemProgram.createAccount({
    fromPubkey: parentAccount.publicKey,
    newAccountPubkey: dataAccount.publicKey,
    lamports: 1000000000,
    space: 4,
    programId: new PublicKey(CONTRACT_PROGRAM_ID),
  });

  const transaction = new Transaction();
  transaction.add(createAccountInstruction);
  await sendAndConfirmTransaction(connection, transaction, [
    parentAccount,
    dataAccount,
  ]);

  return dataAccount;
};

export const callCounter = async (parentAccount: Keypair) => {
  const conn = new Connection(ENDPOINT, "confirmed");
  await airdrop(parentAccount.publicKey, 101);

  //   const dataAccount = await createDataAccount(conn, parentAccount);
  const dataAccount = new PublicKey(
    "GwwuXW354d1mnR3qyreYa9ht44237yr8gUjVha47ahNW"
  );

  //   console.log(dataAccount.publicKey.toString());
  //   console.log(parentAccount.publicKey.toString());

  const instruction = new TransactionInstruction({
    keys: [{ pubkey: dataAccount, isSigner: false, isWritable: true }],
    programId: new PublicKey(CONTRACT_PROGRAM_ID),
    data: Buffer.alloc(0),
  });

  await sendAndConfirmTransaction(conn, new Transaction().add(instruction), [
    parentAccount,
  ]);

  // read data account
  const accountInfo = await conn.getAccountInfo(dataAccount);

  const greeting = borsh.deserialize(
    GreetingSchema,
    GreetingAccount,
    accountInfo.data
  );

  console.log(dataAccount, "has been greeted", greeting.counter, "time(s)");
};

callCounter(Keypair.generate());
