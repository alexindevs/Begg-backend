import nodemailer from "nodemailer";
import logger from '../logging/logger';
import fs from "fs";
import path from "path"

export const sendEmail = async (email: string, subject: string, html: string) => {
    const transporter = nodemailer.createTransport({
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
}

export const processEmail = async function (emailType: string, templateData: object) {
    try {
      const filePath = path.join(__dirname, `${emailType}.html`);
      const content = readFileContent(filePath);
      if (!content) {
        logger.error("Error processing email: File content empty;");
        throw new Error("Error processing email");
      }
      const html = replacePlaceholders(content, templateData);
      return html;
    } catch (error) {
      throw new Error("Error processing email");
    }
  }
  
function readFileContent(filePath: string) {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      return content;
    } catch (error: any) {
      logger.error(`Error reading file at path ${filePath}: ${error.message}`);
      throw new Error(`Error reading file at path ${filePath}: ${error.message}`);
    }
  }
  
 function replacePlaceholders(html: string, templateData: any) {
    return html.replace(/\{\{(\w+)\}\}/g, (match, p1) => {
      return templateData[p1] || match;
    });
  }