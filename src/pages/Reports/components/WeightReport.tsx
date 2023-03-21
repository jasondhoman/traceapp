import { Container, Grid, Paper } from '@mui/material';

import { AxiosError } from 'axios';
import { useSnackbar } from 'notistack';
import React from 'react';
import FormButtons from '../../../components/ui/FormButtons';
import GridField from '../../../components/ui/GridField';
import TitleFragment from '../../../components/ui/TitleFragment';
import { getWeightReport } from '../api/reporting';

const WeightReport: React.FC = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [tracking, setTracking] = React.useState(0);
  const clearForm = () => {
    setTracking(0);
  };
  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();

    getWeightReport(tracking).catch((error) => {
      const err = error as AxiosError;
      enqueueSnackbar(err.response?.statusText, {
        variant: 'error',
      });
    });
  };
  const handleChange = (e: React.SyntheticEvent) => {
    const target = e.target as HTMLInputElement;
    // const prev_value = tracking;
    try {
      const value = parseInt(target.value);
      if (Number.isNaN(value)) {
        throw new Error('Not a number');
      }
      setTracking(parseInt(target.value));
    } catch (err) {
      console.error(err);
    }
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
                title="Weight Sheet"
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
                inputProps={{ max: 10000000, type: 'number', min: 0 }}
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

export default WeightReport;
