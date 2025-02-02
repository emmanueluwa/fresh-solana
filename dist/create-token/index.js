"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const web3_js_1 = require("@solana/web3.js");
const spl_token_1 = require("@solana/spl-token");
const airdrop_1 = require("../airdrop");
const constants_1 = require("../utils/constants");
const createMint_ = (mintWallet) => __awaiter(void 0, void 0, void 0, function* () {
    const conn = new web3_js_1.Connection(constants_1.ENDPOINT, "confirmed");
    const creatorToken = yield (0, spl_token_1.createMint)(conn, mintWallet, mintWallet.publicKey, null, 8
    // null,
    // null,
    // TOKEN_PROGRAM_ID
    );
    return creatorToken.toString();
});
const transferTokens = (tokenAddress, mintWallet, receiver) => __awaiter(void 0, void 0, void 0, function* () {
    const conn = new web3_js_1.Connection(constants_1.ENDPOINT, "confirmed");
    const mintTokenAccount = yield (0, spl_token_1.getOrCreateAssociatedTokenAccount)(conn, mintWallet, tokenAddress, mintWallet.publicKey);
    yield (0, spl_token_1.mintTo)(conn, mintWallet, tokenAddress, mintTokenAccount.address, mintWallet.publicKey, 100000000);
    const recipientTokenAccount = yield (0, spl_token_1.getOrCreateAssociatedTokenAccount)(conn, mintWallet, tokenAddress, receiver);
    console.log(`recipient token account: `, recipientTokenAccount.address);
    const tx_signature = yield (0, spl_token_1.transfer)(conn, mintWallet, mintTokenAccount.address, recipientTokenAccount.address, mintWallet, 100000000);
});
(() => __awaiter(void 0, void 0, void 0, function* () {
    const mintWallet = yield web3_js_1.Keypair.generate();
    yield (0, airdrop_1.airdrop)(mintWallet.publicKey, 10);
    //creating mint, getting public access of mint
    const creatorTokenAddressString = yield createMint_(mintWallet);
    const creatorTokenAddress = new web3_js_1.PublicKey(creatorTokenAddressString);
    console.log(creatorTokenAddress);
    yield transferTokens(creatorTokenAddress, mintWallet, new web3_js_1.PublicKey("5bkKocVFPAvxHnvPiuJHyCLw2SwFuiosAxpvFw28hw5a"));
    console.log(`factory token(creator) address: ${creatorTokenAddress}`);
    console.log(`mint wallet address: ${mintWallet.publicKey}`);
}))();
//# sourceMappingURL=index.js.map