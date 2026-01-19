// lib/crypto.ts
import CryptoJS from 'crypto-js';

const SECRET_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || 'a7f3b8c2e5d9f1a4b6c8e0f2d4a6b8c0e2f4a6b8c0e2f4a6b8c0e2f4a6b8c0e2';



export function encryptUid(uid: string) {
  return CryptoJS.AES.encrypt(uid, SECRET_KEY).toString();
}

export function decryptUid(encryptedUid: string) {

  const bytes = CryptoJS.AES.decrypt(encryptedUid, SECRET_KEY);

  return bytes.toString(CryptoJS.enc.Utf8);
}