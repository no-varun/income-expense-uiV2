
import CryptoJS from "crypto-js";

export const aesDecrypt = (key, payload) => {
    try {
        if (!payload || typeof payload !== "string") {
            return "";
        }
        const secretKey = CryptoJS.enc.Utf8.parse(key);
        const iv = CryptoJS.enc.Utf8.parse("12d0c42781b02d8f");

        const decrypted = CryptoJS.AES.decrypt(payload, secretKey, {
            iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7,
        });

        return decrypted.toString(CryptoJS.enc.Utf8);
    } catch (error) {
        console.error("AES Decryption Error:", error);
        return "";
    }
};