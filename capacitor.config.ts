import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'id.rupaai.app',
  appName: 'RUPAAI',
  webDir: 'dist',
  server: { androidScheme: 'https' },
  ios: { contentInset: 'automatic', allowsLinkPreview: false },
  android: { allowMixedContent: false }
};

export default config;