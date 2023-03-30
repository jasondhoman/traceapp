import { Container, Grid, Paper } from '@mui/material';
import { useSnackbar } from 'notistack';

import React from 'react';
import FormButtons from '../../../components/ui/FormButtons';
import GridField from '../../../components/ui/GridField';
import TitleFragment from '../../../components/ui/TitleFragment';
import { getProductionInformation } from '../api/reporting';

const ProductionRunReport: React.FC = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [tracking, setTracking] = React.useState(0);
  const clearForm = () => {
    setTracking(0);
  };
  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    const res = await getProductionInformation(tracking);
    if (!res) {
      enqueueSnackbar(`No Production Information Found for ${tracking}`, {
        variant: 'error',
      });
    }
  };
  const handleChange = (e: React.SyntheticEvent) => {
    const target = e.target as HTMLInputElement;
    setTracking(parseInt(target.value));
  };

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
              <TitleFragment
                size="h3"
                firstDivider={false}
                title="Production Run Report"
              />
              <GridField
                size={16}
                fullWidth
                margin="normal"
                id="tracking"
                label="Tracking"
                name="tracking"
                value={tracking}
                onChange={handleChange}
                inputProps={{ max: 1000000000, min: 0, type: 'number' }}
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

export default ProductionRunReport;
