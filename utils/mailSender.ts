import nodemailer from 'nodemailer';
import { decrypt } from './passwordEncripter';
import { Problem, Rule } from '../types/types';
import { config } from '../config/config';

const rules: Rule[] = require('../config/rules.json');

const sendEmail = async (email: string, subject: string, text: string, htmlBody?: string): Promise<void> => {
  // Decrypt email and password from environment variables
  const decryptedEmail = process.env.EMAIL ? decrypt(process.env.EMAIL) : '';
  const decryptedPassword = process.env.PASSWORD ? decrypt(process.env.PASSWORD) : '';

  const transporter = nodemailer.createTransport({
    host: 'smtp-mail.outlook.com',
    port: 587,
    secure: false,
    auth: {
      user: decryptedEmail,
      pass: decryptedPassword,
    },
    tls: {
      ciphers: 'SSLv3'
    }
  });

  const mailOptions = {
    from: decryptedEmail,
    to: email,
    // cc: config.ccEmail, // Add CC recipient here
    subject,
    text,
    html: htmlBody, // Add the HTML body here
  };

  await transporter.sendMail(mailOptions);
}

const findRuleById = (ruleId: number): Rule | undefined => {
  return rules.find((rule) => rule["Nro Regla"] === ruleId);
};

export const createEmailBody = (text: string, errorList: Problem[]): string => {
  
  const tableRows = errorList
    .map(
      (error) =>
        `<tr>
          <td>${error.pageId}</td>
          <td>${error.pageName}</td>
          <td>${error.error} - ${findRuleById(error.error)?.["Nombre"] ?? "Unknown"}</td>
          <td><a href="${error.url}" target="_blank">${error.url}</a></td>
        </tr>`
    )
    .join("");

  const groupedErrors = errorList.reduce((acc, error) => {
    acc[error.pageId] = (acc[error.pageId] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const groupedErrorsText = Object.entries(groupedErrors)
    .map(([pageId, count]) => `Página ID: ${pageId} - Errores: ${count}`)
    .join("<br>");

  return `
    <p>${text}</p>
    <p>Se detectaron errores en las siguientes páginas:</p>
    <p>${groupedErrorsText}</p>
    <table border="1" style="border-collapse: collapse; width: 100%;">
      <thead>
        <tr>
          <th>ID Tarea</th>
          <th>Nombre Tarea</th>
          <th>Codigo y Descripción Error</th>
          <th>URL Página</th>
        </tr>
      </thead>
      <tbody>
        ${tableRows}
      </tbody>
    </table>
  `;
};

export default sendEmail;