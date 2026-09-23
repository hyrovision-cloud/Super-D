import dotenv from 'dotenv';
import path from 'path';

dotenv.config();
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '5001', 10),
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
  BACKEND_API_URL: process.env.BACKEND_API_URL || 'http://localhost:5000/api/v1',
  isProduction: process.env.NODE_ENV === 'production',
};
