import { Grid } from '@mui/material';
import { Container } from '@mui/system';
import * as React from 'react';

const Loading: React.FC = () => {
  return (
    <Container className="mt-2 mx-0 px-0" maxWidth={false}>
      {/* <Tabs
        value={tab_id}
        onChange={handleChange}
        textColor="primary"
        indicatorColor="primary"
        aria-label="primary tabs example"
      >
        <Tab value={1} label={`Display ${name}`} />
        <Tab value={2} label={`${tablabel} ${name}`} />
      </Tabs> */}

      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
      >
        <Container className="mt-2 mx-0 px-0" maxWidth={false}>
          {/* <CircularProgress /> */}
        </Container>
      </Grid>
    </Container>
  );
};

export default Loading;
