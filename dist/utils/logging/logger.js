"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = __importDefault(require("winston"));
const logger = winston_1.default.createLogger({
    level: "debug",
    format: winston_1.default.format.combine(winston_1.default.format.timestamp({
        format: "YYYYMMDD HH:mm:ss"
    }), winston_1.default.format.json(), winston_1.default.format.printf((info) => {
        const { timestamp, level, message, module } = info;
        return JSON.stringify({
            date: timestamp.split(' ')[0],
            time: timestamp.split(' ')[1],
            level,
            module,
            message
        });
    })),
    transports: [
        new winston_1.default.transports.File({ filename: "error.log", level: "error" }),
        new winston_1.default.transports.File({ filename: "combined.log" }),
        new winston_1.default.transports.Console(),
    ],
});
exports.default = logger;
