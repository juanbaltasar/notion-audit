import dotenv from 'dotenv';
import path from 'path';
import rules from './rules.json';
import applicationsToCheck from './applications.json';

// Load environment variables from the config folder
dotenv.config({ path: path.resolve(__dirname, '.env') });

// Export configuration object
export const config = {
  // Notion settings
  databasesToCheck: ['Requerimientos', 'Publicación (release)', 'Sprints', 'Tareas'],

  // Any other configuration settings can be added here
  notionApiKey: process.env.NOTION_API_KEY,
  emailApiKey: process.env.EMAIL_API_KEY,

  ccEmail: 'fabricio@fktech.net',

  applicationsToCheck,
  rules,
};
