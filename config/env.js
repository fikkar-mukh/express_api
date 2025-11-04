import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "../.env") });

export const JWT_SECRET = process.env.JWT_SECRET;
// export const JWT_EXPIRES = process.env.JWT_EXPIRES || "12h";
export const PORT = process.env.PORT || 3000;