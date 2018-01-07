// class SecureService {
//     key: string;
//     passiv: string;

//     constructor() {
//         this.key = "CHITCHAT!@#$%^&*()_+|===";
//         this.passiv = "ThisIsUrPassword";
//     }
//     hashCompute(content, callback) {
//         require(["../lib/crypto-js/crypto-js"], function (CryptoJS) {
//             var hash = CryptoJS.MD5(content);
//             var md = hash.toString(CryptoJS.enc.Hex);
//             callback(null, md);
//         });
//     }
//     encryption(content, callback) {
//         var self = this;
//         require(["../lib/crypto-js/crypto-js"], function (CryptoJS) {
//             var ciphertext = CryptoJS.AES.encrypt(content, self.key);
//             callback(null, ciphertext.toString());
//         });
//     }
//     decryption(content, callback) {
//         var self = this;
//         require(["../lib/crypto-js/crypto-js"], function (CryptoJS) {
//             //   var words = CryptoJS.enc.Base64.parse(content);
//             var bytes = CryptoJS.AES.decrypt(content, self.key);
//             var plaintext = bytes.toString(CryptoJS.enc.Utf8);
//             callback(null, plaintext);
//         });
//     }
//     encryptWithSecureRandom(content, callback) {
//         var self = this;
//         require(["../lib/crypto-js/crypto-js"], function (CryptoJS) {
//             var key = CryptoJS.enc.Utf8.parse(self.key);
//             var iv = CryptoJS.enc.Utf8.parse(self.passiv);
//             var ciphertext = CryptoJS.AES.encrypt(content, key, { iv: iv });
//             callback(null, ciphertext.toString());
//         });
//     }
//     decryptWithSecureRandom(content, callback) {
//         var self = this;
//         require(["../lib/crypto-js/crypto-js"], function (CryptoJS) {
//             var key = CryptoJS.enc.Utf8.parse(self.key);
//             var iv = CryptoJS.enc.Utf8.parse(self.passiv);
//             var bytes = CryptoJS.AES.decrypt(content, key, { iv: iv, padding: CryptoJS.pad.Pkcs7, mode: CryptoJS.mode.CBC });
//             var plaintext;
//             try {
//                 plaintext = bytes.toString(CryptoJS.enc.Utf8);
//             }
//             catch (e) {
//                 console.warn(e);
//             }
//             if (!!plaintext)
//                 callback(null, plaintext);
//             else
//                 callback(new Error("cannot decrypt content"), content);
//         });
//     }
// }
