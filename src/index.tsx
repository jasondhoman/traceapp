import {
  QueryClient,
  QueryClientConfig,
  QueryClientProvider,
} from 'react-query';

import React from 'react';
import { createRoot } from 'react-dom/client';
import { ReactQueryDevtools } from 'react-query/devtools';
import App from './App';

const queryClientConfig: QueryClientConfig = {
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
    },
  },
};
const queryClient = new QueryClient(queryClientConfig);

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

const root = createRoot(rootElement);
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <ReactQueryDevtools initialIsOpen />
    </QueryClientProvider>
  </React.StrictMode>
);
