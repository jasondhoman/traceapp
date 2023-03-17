import React from 'react';
import CustomerSize from './components/CustomerSizePage';
import CustomerSizeProvider from './CustomerSizeContext';

const CustomerSizeIndex = () => {
  return (
    <CustomerSizeProvider>
      <CustomerSize />
    </CustomerSizeProvider>
  );
};
export default CustomerSizeIndex;
