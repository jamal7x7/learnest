// Demo: scrypt-kdf usage for ESM
import { kdf } from "scrypt-kdf";

const hash = (await kdf("password123", { logN: 15 })).toString("base64");
console.log(hash);
