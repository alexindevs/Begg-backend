"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const app = (0, express_1.default)();
const port = process.env.PORT || 7000;
app.use(body_parser_1.default.json());
app.use((0, cors_1.default)());
app.use("/auth", require("./modules/auth/auth.routes"));
app.use("/waitlist", require("./modules/waitlist/waitlist.routes"));
app.get("/", (req, res) => {
    res.send("Hello, World!");
});
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
