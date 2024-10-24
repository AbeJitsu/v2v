import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { isProduction } from '../utils/envUtils'; // Ensure this utility is correctly implemented in your project

const jwtSecret = process.env.JWT_SECRET || 'default_secret'; // Provide a default to prevent runtime errors

// Logs messages only if not in production
const logDebug = (message: string, ...args: any[]) => {
  if (!isProduction()) {
    console.log(message, ...args);
  }
};

// Generates a JWT token for a user
export const generateToken = (user: { _id: string; role: string }) => {
  logDebug('Generating token for user:', user);
  return jwt.sign({ id: user._id, role: user.role }, jwtSecret, {
    expiresIn: '30d',
  });
};

// Verifies a JWT token and resolves with the decoded token
export const verifyToken = (token: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, jwtSecret, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded);
      }
    });
  });
};

// Verifies a plaintext password against a hashed password
export const verifyPassword = async (
  plaintextPassword: string,
  hashedPassword: string
): Promise<boolean> => {
  logDebug('Verifying password');
  return bcrypt.compare(plaintextPassword, hashedPassword);
};

// Hashes a plaintext password
export const hashPassword = async (password: string): Promise<string> => {
  logDebug('Hashing password');
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};
