"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processEmail = exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const logger_1 = __importDefault(require("../logging/logger"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const sendEmail = async (email, subject, html) => {
    const transporter = nodemailer_1.default.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
        },
    });
    const mailOptions = {
        from: process.env.EMAIL_USERNAME,
        to: email,
        subject: subject,
        html: html
    };
    return await transporter.sendMail(mailOptions);
};
exports.sendEmail = sendEmail;
const processEmail = async function (emailType, templateData) {
    try {
        const filePath = path_1.default.join(__dirname, `${emailType}.html`);
        const content = readFileContent(filePath);
        if (!content) {
            logger_1.default.error("Error processing email: File content empty;");
            throw new Error("Error processing email");
        }
        const html = replacePlaceholders(content, templateData);
        return html;
    }
    catch (error) {
        throw new Error("Error processing email");
    }
};
exports.processEmail = processEmail;
function readFileContent(filePath) {
    try {
        const content = fs_1.default.readFileSync(filePath, 'utf-8');
        return content;
    }
    catch (error) {
        logger_1.default.error(`Error reading file at path ${filePath}: ${error.message}`);
        throw new Error(`Error reading file at path ${filePath}: ${error.message}`);
    }
}
function replacePlaceholders(html, templateData) {
    return html.replace(/\{\{(\w+)\}\}/g, (match, p1) => {
        return templateData[p1] || match;
    });
}
