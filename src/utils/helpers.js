import CryptoJS from "crypto-js";
export const SECRET_KEY = "n63expe6oc4dahmi";
export const aesDecrypt = (key, payload) => {
    try {
        let actualKey = key;
        let actualPayload = payload;

        // If called as aesDecrypt(payload)
        if (payload === undefined && typeof key === "string") {
            actualKey = SECRET_KEY;
            actualPayload = key;
        } else if (!actualKey) {
            actualKey = SECRET_KEY;
        }

        if (!actualPayload || typeof actualPayload !== "string") {
            return "";
        }
        const secretKey = CryptoJS.enc.Utf8.parse(actualKey);
        const iv = CryptoJS.enc.Utf8.parse("12d0c42781b02d8f");

        const decrypted = CryptoJS.AES.decrypt(actualPayload, secretKey, {
            iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7,
        });

        return decrypted.toString(CryptoJS.enc.Utf8);
    } catch (error) {
        // console.error("AES Decryption Error:", error);
        return "";
    }
};