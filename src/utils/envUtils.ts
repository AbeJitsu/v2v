import dotenv from 'dotenv';
import { EnvironmentVariableError } from './dbUtils';
import { configService } from '../services/configService';

dotenv.config();

type EnvVar = string | undefined;

export const getEnvVar = (key: string): EnvVar => process.env[key];

export const requireEnvVar = (key: string): string => {
  const value = getEnvVar(key);
  if (!value) {
    throw new EnvironmentVariableError(
      `Environment variable ${key} is not set`
    );
  }
  return value;
};

const toNumber = (value: EnvVar, defaultValue = 3001): number => {
  const num = Number(value ?? defaultValue);
  if (isNaN(num)) {
    throw new EnvironmentVariableError(`"${value}" is not a valid number`);
  }
  return num;
};

export const NODE_ENV = getEnvVar('NODE_ENV');
export const PORT = toNumber(getEnvVar('PORT'), 3001);
export const isProduction = (): boolean => NODE_ENV === 'production';

let configServiceInitialized = false;

const initializeConfigService = async (): Promise<void> => {
  if (!configServiceInitialized) {
    await configService.connect();
    configServiceInitialized = true;
  }
};

export const isCloudEnvironment = async (): Promise<boolean> => {
  await initializeConfigService();
  return (await configService.getConfig()).useCloudBackend;
};

export const isCloudDatabase = async (): Promise<boolean> => {
  await initializeConfigService();
  return (await configService.getConfig()).useCloudDatabase;
};

const getUrl = async (cloudKey: string, localKey: string): Promise<string> => {
  return (await isCloudEnvironment())
    ? requireEnvVar(cloudKey)
    : requireEnvVar(localKey);
};

export const getBackendUrl = () =>
  getUrl('CLOUD_BACKEND_URL', 'LOCAL_BACKEND_URL');
export const getDatabaseUrl = () => getUrl('MONGODB_URI', 'LOCAL_DATABASE_URL');
export const getFrontendUrl = () =>
  getUrl('CLOUD_FRONTEND_URL', 'LOCAL_FRONTEND_URL');

export const getSessionSecret = (): string => requireEnvVar('SESSION_SECRET');
export const getJwtSecret = (): string => requireEnvVar('JWT_SECRET');
export const getSquareAccessToken = (): string =>
  requireEnvVar('SQUARE_ACCESS_TOKEN');
export const getPort = (): number => PORT;

export const validateEnvVariables = (): void => {
  [
    'NODE_ENV',
    'PORT',
    'MONGODB_URI',
    'LOCAL_DATABASE_URL',
    'CLOUD_BACKEND_URL',
    'LOCAL_BACKEND_URL',
    'CLOUD_FRONTEND_URL',
    'LOCAL_FRONTEND_URL',
    'SESSION_SECRET',
    'JWT_SECRET',
    'SQUARE_ACCESS_TOKEN',
  ].forEach(requireEnvVar);
};
