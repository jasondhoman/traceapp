import { Container, Grid } from '@mui/material';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import React from 'react';

interface ILandingPage {
  tab_id: number;
  handleChange: (
    event: React.SyntheticEvent<Element, Event>,
    value: any
  ) => void;
  disabled: boolean;
  tablabel: string;
  children: JSX.Element;
  name: string;
  formSize: false | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | undefined;
}

const LandingPage: React.FC<ILandingPage> = ({
  tab_id,
  handleChange,
  disabled,
  tablabel,
  children,
  name,
  formSize,
}) => {
  return (
    <Container className="mt-2 mx-0 px-0" maxWidth={false}>
      <Tabs
        value={tab_id}
        onChange={handleChange}
        textColor="primary"
        indicatorColor="primary"
        aria-label="primary tabs example"
      >
        <Tab value={1} label={`Display ${name}`} disabled={disabled} />
        <Tab value={2} label={`${tablabel} ${name}`} disabled={disabled} />
      </Tabs>

      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
      >
        <Container
          className="mt-2 mx-0 px-0"
          maxWidth={tab_id === 1 ? false : formSize}
        >
          {children}
        </Container>
      </Grid>
    </Container>
  );
};
export default LandingPage;
