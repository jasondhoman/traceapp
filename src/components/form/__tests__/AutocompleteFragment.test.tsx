/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { render } from '@testing-library/react';
import AutocompleteFragment from '../AutocompleteFragment';
import StateProvider from '../../../context/StateContext';

test('Autocomplete will render', async () => {
  const mockCustomers = [
    {
      id: 1,
      desc: 'Test Customer',
    },
  ];
  const testState = '';
  const setTestState = () => {
    console.log('Function not implemented.');
  };
  render(
    <StateProvider key={null} type={''} props={undefined}>
      <AutocompleteFragment
        selectOptions={mockCustomers}
        state={testState}
        label="test"
        id="test-id"
        changeState={setTestState}
      />
    </StateProvider>
  );
});
