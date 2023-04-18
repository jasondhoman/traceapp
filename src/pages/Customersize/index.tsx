import React from 'react';
import CustomerSizeProvider from './CustomerSizeContext';
import CustomerSizePage from './components/CustomerSizePage';

const CustomerSizeIndex = () => {
  return (
    <CustomerSizeProvider>
      <CustomerSizePage name="Customer Size" />
    </CustomerSizeProvider>
  );
};

export default CustomerSizeIndex;
