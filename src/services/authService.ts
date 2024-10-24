<<<<<<< ./packages/server/src/services/authService.ts
=======
// Content from jw1:
// server/src/api/services/authService.js

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { isProduction } = require('../../utils/envUtils');

const jwtSecret = process.env.SERVER_JWT_SECRET;

if (!jwtSecret) {
  console.error('SERVER_JWT_SECRET environment variable is not defined!');
}

// Utility function for logging in non-production environments
const logDebug = (message, ...args) => {
  if (!isProduction()) {
    console.log(message, ...args);
  }
};

// Function to generate a JWT token
const generateToken = (user) => {
  logDebug('Generating token with secret:', jwtSecret);
  return jwt.sign({ id: user._id, role: user.role }, jwtSecret, {
    expiresIn: '30d',
  });
};

// Function to verify a JWT token
const verifyToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, jwtSecret, (err, decoded) => {
      if (err) return reject(err);
      resolve(decoded);
    });
  });
};

// Function to verify a plaintext password against a hashed password
const verifyPassword = async (plaintextPassword, hashedPassword) => {
  logDebug('Plaintext password:', plaintextPassword);
  logDebug('Hashed password:', hashedPassword);
  return bcrypt.compare(plaintextPassword, hashedPassword);
};

// Function to hash a password
const hashPassword = async (password) => {
  logDebug('Password being hashed:', password);
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

module.exports = {
  generateToken,
  verifyToken,
  verifyPassword,
  hashPassword,
};


// Content from jw2:
// server/src/services/authService.js

const jwt = require('jsonwebtoken');
// const bcrypt = require("bcryptjs");

const { JWT_SECRET: jwtSecret } = process.env;

if (!jwtSecret) {
  console.error('JWT_SECRET environment variable is not defined!');
}

const logDebug = (message, ...args) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log(message, ...args);
  }
};

const generateToken = (user) => {
  logDebug('Generating token with secret:', jwtSecret);
  return jwt.sign({ id: user._id, role: user.role }, jwtSecret, {
    expiresIn: '30d',
  });
};

const verifyToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, jwtSecret, (err, decoded) => {
      if (err) return reject(err);
      resolve(decoded);
    });
  });
};

// Temporarily commenting out bcrypt logic
const verifyPassword = async (plaintextPassword, hashedPassword) => {
  logDebug('Plaintext password:', plaintextPassword);
  logDebug('Hashed password:', hashedPassword);
  // return bcrypt.compare(plaintextPassword, hashedPassword);
  return plaintextPassword === hashedPassword; // Simplified comparison
};

const hashPassword = async (password) => {
  logDebug('Password being hashed:', password);
  // const salt = await bcrypt.genSalt(10);
  // return bcrypt.hash(password, salt);
  return password; // Simplified hashing
};

module.exports = {
  generateToken,
  verifyToken,
  verifyPassword,
  hashPassword,
};


// Content from ec24:
>>>>>>> ./packages/server/src/services/modules/authService.js
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { isProduction } from '../utils/envUtils';
import { UserRole } from '../models/userModel'; // Add this import

const jwtSecret = process.env.SERVER_JWT_SECRET;

if (!jwtSecret) {
  console.error('SERVER_JWT_SECRET environment variable is not defined!');
}

// Utility function for logging in non-production environments
const logDebug = (message: string, ...args: any[]) => {
  if (!isProduction()) {
    console.log(message, ...args);
  }
};

// Function to generate a JWT token
export const generateToken = (user: { _id: string; role: UserRole }) => {
  logDebug('Generating token with secret:', jwtSecret);
  return jwt.sign({ id: user._id, role: user.role }, jwtSecret!, {
    expiresIn: '30d',
  });
};

// Function to verify a JWT token
export const verifyToken = (token: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, jwtSecret!, (err, decoded) => {
      if (err) return reject(err);
      resolve(decoded);
    });
  });
};

// Function to verify a plaintext password against a hashed password
export const verifyPassword = async (
  plaintextPassword: string,
  hashedPassword: string
): Promise<boolean> => {
  logDebug('Plaintext password:', plaintextPassword);
  logDebug('Hashed password:', hashedPassword);
  return bcrypt.compare(plaintextPassword, hashedPassword);
};

// Function to hash a password
export const hashPassword = async (password: string): Promise<string> => {
  logDebug('Password being hashed:', password);
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};
<<<<<<< ./packages/server/src/services/authService.ts
=======


// Content from ec3:


>>>>>>> ./packages/server/src/services/modules/authService.js
1,2d0
< <<<<<<< ./packages/server/src/services/authService.ts
< =======
121d118
< >>>>>>> ./packages/server/src/services/modules/authService.js
174,175d170
< <<<<<<< ./packages/server/src/services/authService.ts
< =======
181d175
< >>>>>>> ./packages/server/src/services/modules/authService.js
