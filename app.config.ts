import type { ConfigContext, ExpoConfig } from '@expo/config';
import { ClientEnv } from './env';
import pkg from './package.json';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: pkg.name,
  slug: 'haze',
  version: pkg.version,
  scheme: `com.${pkg.name.toLowerCase()}`,
  userInterfaceStyle: 'light',
  orientation: 'portrait',
  icon: './assets/icon.png',
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: false,
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#ffffff',
    },
    package: 'com.disgruntleddevs.haze',
  },
  extra: {
    ...ClientEnv,
    eas: {
      projectId: '5a0beb88-5f85-4ad5-8556-8908d8f2d0fe',
    },
  },
  experiments: {
    typedRoutes: true,
  },
  plugins: ['expo-font', 'expo-router', 'expo-image'],
});
