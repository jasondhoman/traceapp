import 'vite/client';

/// <reference types="vite/client" />

interface ImportMetaEnv extends Readonly<Record<string, string>> {
  readonly VITE_API_ROOT: string;
  readonly VITE_API_DEV_ROOT: string;
  readonly VITE_DATA_TOKEN: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
