"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CryptoJS = require("crypto-js");
class NodeSecureService {
    constructor(secret_key) {
        this.key = secret_key;
        this.passiv = "chitchat#1234";
    }
    hashCompute(content) {
        return new Promise((resolve, reject) => {
            let hash = CryptoJS.MD5(content);
            resolve(hash.toString());
        });
    }
    encryption(content) {
        let self = this;
        return new Promise((resolve, reject) => {
            let ciphertext = CryptoJS.AES.encrypt(content, self.key);
            if (!!ciphertext) {
                resolve(ciphertext.toString());
            }
            else
                reject();
        });
    }
    decryption(content) {
        let self = this;
        return new Promise((resolve, reject) => {
            let bytes = CryptoJS.AES.decrypt(content, self.key);
            let plaintext = bytes.toString(CryptoJS.enc.Utf8);
            if (!!plaintext)
                resolve(plaintext);
            else
                reject();
        });
    }
    encryptWithSecureRandom(content, callback) {
        let self = this;
        let key = CryptoJS.enc.Utf8.parse(self.key);
        let iv = CryptoJS.enc.Utf8.parse(self.passiv);
        let ciphertext = CryptoJS.AES.encrypt(content, key, { iv: iv });
        callback(undefined, ciphertext.toString());
    }
    decryptWithSecureRandom(content) {
        let self = this;
        return new Promise((resolve, rejected) => {
            let key = CryptoJS.enc.Utf8.parse(self.key);
            let iv = CryptoJS.enc.Utf8.parse(self.passiv);
            let bytes = CryptoJS.AES.decrypt(content, key, { iv: iv, padding: CryptoJS.pad.Pkcs7, mode: CryptoJS.mode.CBC });
            console.log(key, iv, bytes, content);
            try {
                let plaintext = bytes.toString(CryptoJS.enc.Utf8);
                resolve(plaintext);
            }
            catch (e) {
                console.error(e);
                rejected(e);
            }
        });
    }
}
exports.NodeSecureService = NodeSecureService;
