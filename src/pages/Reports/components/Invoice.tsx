import { Container, Grid, Paper } from '@mui/material';

import React, { useEffect } from 'react';
import FormButtons from '../../../components/ui/FormButtons';
import GridField from '../../../components/ui/GridField';
import TitleFragment from '../../../components/ui/TitleFragment';
import { useStateContext } from '../../../context/StateContext';
import { generateInvoice } from '../api/reporting';

const Invoice: React.FC = () => {
  const [tracking, setTracking] = React.useState(0);
  const clearForm = () => {
    setTracking(0);
  };
  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    generateInvoice(tracking);
  };
  const handleChange = (e: React.SyntheticEvent) => {
    const target = e.target as HTMLInputElement;
    setTracking(parseInt(target.value));
  };
  const { setViewing } = useStateContext();
  useEffect(() => {
    setViewing(false);
  }, [setViewing]);

  return (
    <Container className="mt-2 mx-0 px-0" maxWidth={false}>
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
      >
        <Container className="mt-2 mx-0 px-0" maxWidth={'sm'}>
          <Paper
            component="form"
            style={{ padding: '1rem' }}
            onSubmit={handleSubmit}
            variant="outlined"
            elevation={0}
            className="p-3 w-100"
          >
            <Grid
              container
              direction="row"
              justifyContent="space-center"
              alignItems="center"
              columnSpacing={2}
              rowSpacing={1}
              columns={16}
            >
              <TitleFragment size="h3" firstDivider={false} title="Invoice" />
              <GridField
                size={16}
                fullWidth
                margin="normal"
                id="tracking"
                label="Bill of Lading Number"
                name="tracking"
                value={tracking}
                onChange={handleChange}
                inputProps={{ max: 9999999, min: 0, type: 'number' }}
              />
            </Grid>
            <FormButtons
              isUpdate={false}
              clear={clearForm}
              subButton="Submit"
            />
          </Paper>
        </Container>
      </Grid>
    </Container>
  );
};

export default Invoice;
