"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.callCounter = void 0;
const borsh = __importStar(require("borsh"));
const constants_1 = require("../utils/constants");
const web3_js_1 = require("@solana/web3.js");
const airdrop_1 = require("../airdrop");
const CONTRACT_PROGRAM_ID = "AB7KRs9jNw7yREUuiUpEnaAqbmuLCM6itoWAVmWsP8Xc";
class GreetingAccount {
    constructor(fields = undefined) {
        this.counter = 0;
        if (fields) {
            this.counter = fields.counter;
        }
    }
}
const GreetingSchema = new Map([
    [GreetingAccount, { kind: "struct", fields: [["counter", "u32"]] }],
]);
const createDataAccount = (connection, parentAccount) => __awaiter(void 0, void 0, void 0, function* () {
    const dataAccount = web3_js_1.Keypair.generate();
    const createAccountInstruction = yield web3_js_1.SystemProgram.createAccount({
        fromPubkey: parentAccount.publicKey,
        newAccountPubkey: dataAccount.publicKey,
        lamports: 1000000000,
        space: 4,
        programId: new web3_js_1.PublicKey(CONTRACT_PROGRAM_ID),
    });
    const transaction = new web3_js_1.Transaction();
    transaction.add(createAccountInstruction);
    yield (0, web3_js_1.sendAndConfirmTransaction)(connection, transaction, [
        parentAccount,
        dataAccount,
    ]);
    return dataAccount;
});
const callCounter = (parentAccount) => __awaiter(void 0, void 0, void 0, function* () {
    const conn = new web3_js_1.Connection(constants_1.ENDPOINT, "confirmed");
    yield (0, airdrop_1.airdrop)(parentAccount.publicKey, 101);
    //   const dataAccount = await createDataAccount(conn, parentAccount);
    const dataAccount = new web3_js_1.PublicKey("GwwuXW354d1mnR3qyreYa9ht44237yr8gUjVha47ahNW");
    //   console.log(dataAccount.publicKey.toString());
    //   console.log(parentAccount.publicKey.toString());
    const instruction = new web3_js_1.TransactionInstruction({
        keys: [{ pubkey: dataAccount, isSigner: false, isWritable: true }],
        programId: new web3_js_1.PublicKey(CONTRACT_PROGRAM_ID),
        data: Buffer.alloc(0),
    });
    yield (0, web3_js_1.sendAndConfirmTransaction)(conn, new web3_js_1.Transaction().add(instruction), [
        parentAccount,
    ]);
    // read data account
    const accountInfo = yield conn.getAccountInfo(dataAccount);
    const greeting = borsh.deserialize(GreetingSchema, GreetingAccount, accountInfo.data);
    console.log(dataAccount, "has been greeted", greeting.counter, "time(s)");
});
exports.callCounter = callCounter;
(0, exports.callCounter)(web3_js_1.Keypair.generate());
//# sourceMappingURL=index.js.map