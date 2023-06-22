import { Container, Grid } from '@mui/material';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import React, { FC, ReactNode, SyntheticEvent } from 'react';

interface ILandingPage {
  tab_id: number;
  handleChange: (event: SyntheticEvent<Element, Event>, value: any) => void;
  disabled: boolean;
  tablabel: string;
  children: ReactNode;
  name: string;
  formSize: false | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | undefined;
  tabTwoDisabled?: boolean;
}

const LandingPage: FC<ILandingPage> = ({
  tab_id,
  handleChange,
  disabled,
  tablabel,
  children,
  name,
  formSize,
  tabTwoDisabled,
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
        <Tab
          value={2}
          label={`${tablabel} ${name}`}
          disabled={
            tabTwoDisabled ? tabTwoDisabled : disabled ? disabled : false
          }
        />
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
