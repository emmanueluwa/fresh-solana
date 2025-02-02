import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import {
  createMint,
  getOrCreateAssociatedTokenAccount,
  mintTo,
  TOKEN_PROGRAM_ID,
  transfer,
} from "@solana/spl-token";
import { airdrop } from "../airdrop";
import { ENDPOINT } from "../utils/constants";

const createMint_ = async (mintWallet: Keypair) => {
  const conn = new Connection(ENDPOINT, "confirmed");
  const creatorToken = await createMint(
    conn,
    mintWallet,
    mintWallet.publicKey,
    null,
    8
    // null,
    // null,
    // TOKEN_PROGRAM_ID
  );

  return creatorToken.toString();
};

const transferTokens = async (
  tokenAddress: PublicKey,
  mintWallet: Keypair,
  receiver: PublicKey
) => {
  const conn = new Connection(ENDPOINT, "confirmed");
  const mintTokenAccount = await getOrCreateAssociatedTokenAccount(
    conn,
    mintWallet,
    tokenAddress,
    mintWallet.publicKey
  );

  await mintTo(
    conn,
    mintWallet,
    tokenAddress,
    mintTokenAccount.address,
    mintWallet.publicKey,
    100000000
  );

  const recipientTokenAccount = await getOrCreateAssociatedTokenAccount(
    conn,
    mintWallet,
    tokenAddress,
    receiver
  );

  console.log(`recipient token account: `, recipientTokenAccount.address);

  const tx_signature = await transfer(
    conn,
    mintWallet,
    mintTokenAccount.address,
    recipientTokenAccount.address,
    mintWallet,
    100000000
  );
};

(async () => {
  const mintWallet = await Keypair.generate();
  await airdrop(mintWallet.publicKey, 10);

  //creating mint, getting public access of mint
  const creatorTokenAddressString = await createMint_(mintWallet);
  const creatorTokenAddress = new PublicKey(creatorTokenAddressString);
  console.log(creatorTokenAddress);

  await transferTokens(
    creatorTokenAddress,
    mintWallet,
    new PublicKey("5bkKocVFPAvxHnvPiuJHyCLw2SwFuiosAxpvFw28hw5a")
  );

  console.log(`factory token(creator) address: ${creatorTokenAddress}`);
  console.log(`mint wallet address: ${mintWallet.publicKey}`);
})();
