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
exports.transferSol = void 0;
const web3_js_1 = require("@solana/web3.js");
const airdrop_1 = require("../airdrop");
const show_balance_1 = require("../show-balance");
const transferSol = (from, to, amount) => __awaiter(void 0, void 0, void 0, function* () {
    const conn = new web3_js_1.Connection("http://localhost:8899", "confirmed");
    const transaction = new web3_js_1.Transaction();
    const instruction = web3_js_1.SystemProgram.transfer({
        fromPubkey: from.publicKey,
        toPubkey: to,
        lamports: amount * web3_js_1.LAMPORTS_PER_SOL,
    });
    transaction.add(instruction);
    console.log("sending and confirming transaction...");
    yield (0, web3_js_1.sendAndConfirmTransaction)(conn, transaction, [from]);
    console.log("done");
});
exports.transferSol = transferSol;
const secret = Uint8Array.from([
    215, 37, 212, 245, 149, 101, 144, 50, 75, 74, 135, 14, 198, 96, 220, 241, 14,
    112, 168, 19, 210, 198, 134, 101, 152, 239, 249, 9, 254, 131, 207, 166, 134,
    141, 137, 83, 236, 193, 171, 116, 43, 2, 167, 200, 242, 45, 103, 146, 229, 15,
    180, 91, 200, 235, 17, 216, 167, 253, 11, 99, 47, 166, 9, 17,
]);
const fromKeyPair = web3_js_1.Keypair.fromSecretKey(secret);
const toPublicKey = new web3_js_1.PublicKey("CV6JPu7JutiAqWnBASht3uzSqSpYLv3iHhWuHpLrMXE9");
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, airdrop_1.airdrop)(fromKeyPair.publicKey, 10);
    const initialBalance = yield (0, show_balance_1.showBalance)(fromKeyPair.publicKey);
    console.log(`initial balance is ${initialBalance}`);
    const initialBalanceZwei = yield (0, show_balance_1.showBalance)(toPublicKey);
    console.log(`initial balance of to wallet is ${initialBalanceZwei}`);
    yield (0, exports.transferSol)(fromKeyPair, toPublicKey, 4);
    const newBalance = yield (0, show_balance_1.showBalance)(fromKeyPair.publicKey);
    console.log(`new balance is ${newBalance}`);
    const newBalanceZwei = yield (0, show_balance_1.showBalance)(toPublicKey);
    console.log(`new balance of to wallet is ${newBalanceZwei}`);
}))();
//# sourceMappingURL=index.js.map