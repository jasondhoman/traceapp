import { Container, Grid, Paper } from '@mui/material';
import React, { useState } from 'react';

import { AxiosError } from 'axios';
import { useSnackbar } from 'notistack';
import FormButtons from '../../../components/ui/FormButtons';
import GridField from '../../../components/ui/GridField';
import TitleFragment from '../../../components/ui/TitleFragment';
import { getSalesOrderDocument } from '../api/reporting';

const SalesOrderDocument: React.FC = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [tracking, setTracking] = useState({
    begtracking: 0,
    endtracking: 0,
  });

  const clearForm = () => {
    setTracking({
      begtracking: 0,
      endtracking: 0,
    });
  };
  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    getSalesOrderDocument(tracking.begtracking, tracking.endtracking).catch(
      (error) => {
        const err = error as AxiosError;
        enqueueSnackbar(err.response?.statusText, {
          variant: 'error',
        });
      }
    );
  };
  const handleChange = (e: React.SyntheticEvent) => {
    const target = e.target as HTMLInputElement;
    const value = target.value;
    setTracking((prev) => {
      return {
        ...prev,
        [target.name]: Number.isNaN(Number(value)) ? 0 : Number(value),
      };
    });
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
                title="Sales Order Document"
              />
              <GridField
                size={16}
                fullWidth
                margin="normal"
                id="tracking"
                label="Beginning Tracking Number"
                name="begtracking"
                value={tracking.begtracking}
                onChange={handleChange}
                inputProps={{ maxLength: 10, type: 'number' }}
              />
              <GridField
                size={16}
                fullWidth
                margin="normal"
                id="tracking"
                label="End Tracking Number"
                name="endtracking"
                value={tracking.endtracking}
                onChange={handleChange}
                inputProps={{ maxLength: 10, type: 'number' }}
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

export default SalesOrderDocument;
