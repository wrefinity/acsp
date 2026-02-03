import dotenv from "dotenv";
dotenv.config({ path: ".env" });

export const PORT =  process.env.PORT!;
export const APP_SECRET = process.env.APP_SECRET!;
export const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME!;
export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY!;
export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET!;
export const CLOUDINARY_FOLDER = process.env.CLOUDINARY_FOLDER!;
export const MONGODB_URI = process.env.MONGODB_URI!;
export const CLIENT_URL = process.env.CLIENT_URL!;

export const MAIL_HOST = process.env.MAIL_HOST!;
export const EMAIL_USER = process.env.EMAIL_USER!;
export const EMAIL_PASS = process.env.EMAIL_PASS!;
export const MAIL_PORT = process.env.MAIL_PORT! || 587;


export const DB_NAME =  process.env.DB_NAME!;
export const JWT_SECRET =  process.env.JWT_SECRET!;
export const NODE_ENV =  process.env.NODE_ENV! || 'development';
