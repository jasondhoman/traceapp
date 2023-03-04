import React, { useEffect, useState } from 'react';

import { Paper } from '@mui/material';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { ICustomerFormData } from '../../../@types/tracetypes';
import { SetPageState } from '../../../utils/reducers';
import CustomerAdditional from './CustomerAdditional';
import CustomerAddresses from './CustomerAddresses';
import CustomerContact from './CustomerContact';
import CustomerGeneral from './CustomerGeneral';

interface ICustomerPage {
  id?: number | null;
  reducer: React.Dispatch<SetPageState>;
  customer?: ICustomerFormData | null;
}

const Customer: React.FC<ICustomerPage> = ({ id, reducer, customer }) => {
  const [value, setValue] = useState(1);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [tabOneState, setTabOneState] = useState(false);
  const [tabTwoState, setTabTwoState] = useState(true);
  const [tabThreeState, setTabThreeState] = useState(true);
  const [tabFourState, setTabFourState] = useState(true);
  // const [direction, setDirection] = useState("right");

  const handleChange = (event: React.SyntheticEvent | null, index: number) => {
    setValue(index);
    if (index === 1)
      setComponent(
        <CustomerGeneral
          setTabState={setTabTwoState}
          setValue={handleChange}
          id={id}
          reducer={reducer}
          prop_customer={customer}
        />
      );
    if (index === 2)
      setComponent(
        <CustomerAddresses
          setTabState={setTabThreeState}
          setValue={handleChange}
          id={id}
          reducer={reducer}
          prop_customer={customer}
        />
      );
    if (index === 3)
      setComponent(
        <CustomerContact
          setTabState={setTabFourState}
          setValue={handleChange}
          id={id}
          reducer={reducer}
          prop_customer={customer}
        />
      );
    if (index === 4)
      setComponent(
        <CustomerAdditional reducer={reducer} prop_customer={customer} />
      );
  };
  const [component, setComponent] = useState(
    <CustomerGeneral
      setTabState={setTabTwoState}
      setValue={handleChange}
      id={id}
      reducer={reducer}
      prop_customer={customer}
    />
  );
  useEffect(() => {
    const disable = !(id != null);
    setTabTwoState(disable);
    setTabThreeState(disable);
    setTabFourState(disable);
  }, [id]);
  return (
    <Paper
      elevation={0}
      variant="outlined"
      component="div"
      className="p-3 w-100"
    >
      <Tabs
        value={value}
        onChange={handleChange}
        textColor="primary"
        indicatorColor="primary"
      >
        <Tab value={1} label="General Information" disabled={tabOneState} />
        <Tab
          value={2}
          label="Shipping / Billing Addresses"
          disabled={tabTwoState}
        />
        <Tab value={3} label="Contact Addresses" disabled={tabThreeState} />
        <Tab value={4} label="Additional Contacts" disabled={tabFourState} />
      </Tabs>

      {component}
    </Paper>
  );
};

export default Customer;
