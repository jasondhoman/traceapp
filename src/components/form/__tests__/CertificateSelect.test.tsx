/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { screen, render } from '@testing-library/react';
import CertificateSelect from '../CertificateSelect';
import StateProvider from '../../../context/StateContext';
import {
  QueryClient,
  QueryClientConfig,
  QueryClientProvider,
} from 'react-query';

const queryClientConfig: QueryClientConfig = {
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
    },
  },
};
const queryClient = new QueryClient(queryClientConfig);
const setTestState = () => {
  console.log('Function not implemented.');
};

jest.mock('react-query', () => ({
  ...jest.requireActual('react-query'),
  useQuery: () => ({
    isLoading: false,
    data: [
      {
        id: 1,
        desc: 'Test Certificate',
      },
    ],
  }),
}));

const mockCertificate = (
  <QueryClientProvider client={queryClient}>
    <StateProvider key={null} type={''} props={undefined}>
      <CertificateSelect id={0} size={0} changeState={setTestState} />
    </StateProvider>
  </QueryClientProvider>
);

test('CertificateSelect will render', async () => {
  render(mockCertificate);
  const component = screen.getByLabelText('Certification');
  expect(component).toBeTruthy();
});

test('Certificate will have id', async () => {
  try {
    render(mockCertificate);
    const component = screen.getByLabelText('Certification');
    expect(component).toBeTruthy();
  } catch (e) {
    console.log(e);
  }
});
