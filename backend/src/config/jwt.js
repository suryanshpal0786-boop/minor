import dotenv from 'dotenv';
dotenv.config();

export const JWT_SECRET =
  process.env.JWT_SECRET || 'truthlens_super_secret_jwt_key_2026_apple_bca';
