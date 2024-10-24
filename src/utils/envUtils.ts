import dotenv from 'dotenv';
import { EnvironmentVariableError } from './dbUtils';
import { configService } from '../services/configService';

dotenv.config();

type EnvVar = string | undefined;

export const getEnvVar = (key: string): EnvVar => process.env[key];

export const requireEnvVar = (key: string): string => {
  const value = getEnvVar(key);
  if (value === undefined) {
    throw new EnvironmentVariableError(
      `Environment variable ${key} is not set`
    );
  }
  return value;
};

const toNumber = (value: EnvVar, defaultValue?: number): number => {
  if (value === undefined) {
    if (defaultValue !== undefined) return defaultValue;
    throw new EnvironmentVariableError(
      'Value is undefined and no default provided'
    );
  }

  const num = Number(value);
  if (isNaN(num)) {
    throw new EnvironmentVariableError(
      `Value "${value}" cannot be converted to a number`
    );
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

const isCloudEnvironment = async (): Promise<boolean> => {
  await initializeConfigService();
  const config = await configService.getConfig();
  return config.useCloudBackend;
};

const isCloudDatabase = async (): Promise<boolean> => {
  await initializeConfigService();
  const config = await configService.getConfig();
  return config.useCloudDatabase;
};

const getUrl = async (cloudKey: string, localKey: string): Promise<string> => {
  const isCloud = await isCloudEnvironment();
  return isCloud ? requireEnvVar(cloudKey) : requireEnvVar(localKey);
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
  const requiredVars = [
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
  ];

  requiredVars.forEach(requireEnvVar);
};
