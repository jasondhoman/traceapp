import 'vite/client';

/// <reference types="vite/client" />

interface ImportMetaEnv
  extends Readonly<Record<string, string | boolean | number>> {
  readonly VITE_API_ROOT: string;
  readonly VITE_API_DEV_ROOT: string;
  readonly VITE_DATA_TOKEN: string;
  readonly VITE_STAGING: boolean;
  readonly VITE_PORT: number;
  readonly VITE_PREVIEW: number;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
