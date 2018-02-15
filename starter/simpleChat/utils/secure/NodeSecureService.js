import * as CryptoJS from "crypto-js";
var NodeSecureService = /** @class */ (function () {
    function NodeSecureService(secret_key) {
        this.key = secret_key;
        this.passiv = "chitchat#1234";
    }
    NodeSecureService.prototype.hashCompute = function (content) {
        return new Promise(function (resolve, reject) {
            var hash = CryptoJS.MD5(content);
            resolve(hash.toString());
        });
    };
    NodeSecureService.prototype.encryption = function (content) {
        var self = this;
        return new Promise(function (resolve, reject) {
            var ciphertext = CryptoJS.AES.encrypt(content, self.key);
            if (!!ciphertext) {
                resolve(ciphertext.toString());
            }
            else
                reject();
        });
    };
    NodeSecureService.prototype.decryption = function (content) {
        var self = this;
        return new Promise(function (resolve, reject) {
            var bytes = CryptoJS.AES.decrypt(content, self.key);
            var plaintext = bytes.toString(CryptoJS.enc.Utf8);
            if (!!plaintext)
                resolve(plaintext);
            else
                reject();
        });
    };
    NodeSecureService.prototype.encryptWithSecureRandom = function (content, callback) {
        var self = this;
        var key = CryptoJS.enc.Utf8.parse(self.key);
        var iv = CryptoJS.enc.Utf8.parse(self.passiv);
        var ciphertext = CryptoJS.AES.encrypt(content, key, { iv: iv });
        callback(undefined, ciphertext.toString());
    };
    NodeSecureService.prototype.decryptWithSecureRandom = function (content) {
        var self = this;
        return new Promise(function (resolve, rejected) {
            var key = CryptoJS.enc.Utf8.parse(self.key);
            var iv = CryptoJS.enc.Utf8.parse(self.passiv);
            var bytes = CryptoJS.AES.decrypt(content, key, { iv: iv, padding: CryptoJS.pad.Pkcs7, mode: CryptoJS.mode.CBC });
            console.log(key, iv, bytes, content);
            try {
                var plaintext = bytes.toString(CryptoJS.enc.Utf8);
                resolve(plaintext);
            }
            catch (e) {
                console.error(e);
                rejected(e);
            }
        });
    };
    return NodeSecureService;
}());
export { NodeSecureService };
