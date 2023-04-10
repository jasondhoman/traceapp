import { Grid, Tab, Tabs } from '@mui/material';

import { Container } from '@mui/material';
import React, { FC, ReactNode, SyntheticEvent } from 'react';

interface ITabLayout {
  value: any;
  onChange: (event: SyntheticEvent<Element, Event>, value: any) => void;
  disabled: boolean;
  name: string;
  tablabel: string;
  component: ReactNode;
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
  disableNew?: boolean;
}
const TabsLayout: FC<ITabLayout> = ({
  value,
  onChange,
  disabled,
  tablabel,
  component,
  name,
  size,
  disableNew,
}) => {
  return (
    <Container className="mt-2 mx-0 " maxWidth={false}>
      <Tabs
        value={value}
        onChange={onChange}
        textColor="primary"
        indicatorColor="primary"
        aria-label="secondary tabs example"
      >
        <Tab
          value={1}
          label={`Display ${name}`}
          disabled={disabled}
          wrapped={true}
        />
        <Tab
          value={2}
          label={tablabel}
          disabled={disableNew ?? disabled}
          wrapped={true}
        />
      </Tabs>
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
      >
        <Container className="mt-2 mx-0 " maxWidth={value === 1 ? false : size}>
          {component}
        </Container>
      </Grid>
    </Container>
  );
};

export default TabsLayout;
