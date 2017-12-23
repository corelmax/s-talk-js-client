"use strict";
/**
 * Stalk-JavaScript, Node.js client. Supported react, react-native.
 * Support by @ Ahoo Studio.co.th
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var serverImplemented_1 = require("./lib/node/serverImplemented");
var stalk = serverImplemented_1.default.getInstance();
function initStalk() {
    return new Promise(function (resolve, reject) {
        stalk.init(function (err, result) {
            if (err) {
                console.error("init stalk fail: ", err.message);
                stalk._isConnected = false;
                reject(err.message);
                return;
            }
            console.log("Stalk init success.");
            stalk._isConnected = true;
            stalk.pomelo.on("disconnect", function data(reason) {
                stalk._isConnected = false;
            });
            resolve(stalk);
        });
    });
}
function pushMessage(msg) {
    return new Promise(function (resolve, reject) {
        if (stalk._isConnected) {
            stalk.getClient().request("push.pushHandler.push", msg, function (result) {
                console.log("request result", result);
            });
            resolve(stalk);
        }
        else {
            reject(stalk);
        }
    });
}
function init() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            initStalk().then(function (stalk) {
                if (!stalk._isConnected) {
                    return false;
                }
                return true;
            }).catch(function (err) {
                return false;
            });
            return [2 /*return*/];
        });
    });
}
exports.init = init;
/**
 * For test call api omly...
 */
function testCall() {
    var msg = {};
    msg["event"] = "Test api.";
    msg["message"] = "test api from express.js client.";
    msg["timestamp"] = new Date();
    msg["members"] = "*";
    pushMessage(msg).catch(function (stalk) {
        init().then(function (boo) {
            if (boo) {
                testCall();
            }
        });
    });
}
exports.testCall = testCall;
function push(msg) {
    pushMessage(msg).catch(function (stalk) {
        init().then(function (boo) {
            if (boo) {
                push(msg);
            }
        });
    });
}
exports.push = push;
