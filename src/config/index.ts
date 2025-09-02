import Constants from 'expo-constants';
import * as Updates from 'expo-updates';

export interface AppConfig {
  API_BASE_URL: string;
  ENVIRONMENT: 'development' | 'staging' | 'production';
  ENABLE_LOGGING: boolean;
  ENABLE_REMOTE_LOGGING: boolean;
}

const developmentConfig: AppConfig = {
  API_BASE_URL: 'https://api-dev.example.com',
  ENVIRONMENT: 'development',
  ENABLE_LOGGING: true,
  ENABLE_REMOTE_LOGGING: false,
};

const stagingConfig: AppConfig = {
  API_BASE_URL: 'https://api-staging.example.com',
  ENVIRONMENT: 'staging',
  ENABLE_LOGGING: true,
  ENABLE_REMOTE_LOGGING: true,
};

const productionConfig: AppConfig = {
  API_BASE_URL: 'https://api.example.com',
  ENVIRONMENT: 'production',
  ENABLE_LOGGING: false,
  ENABLE_REMOTE_LOGGING: true,
};

const getConfig = (): AppConfig => {
  // 1️⃣ 本地开发
  if (__DEV__) {
    return developmentConfig;
  }

  // 2️⃣ 先检查 .env 或 app.config.js extra
  const envFromExtra = (Constants.expoConfig?.extra as any)?.ENV as
    | 'development'
    | 'staging'
    | 'production'
    | undefined;

  if (envFromExtra === 'staging') return stagingConfig;
  if (envFromExtra === 'production') return productionConfig;

  // 3️⃣ 再检查 EAS 的 Updates.channel
  if (Updates.channel === 'staging') return stagingConfig;
  if (Updates.channel === 'production') return productionConfig;

  // 默认回退到生产
  return productionConfig;
};

export default getConfig;
