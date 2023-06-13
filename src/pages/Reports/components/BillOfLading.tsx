import { Container, Grid, Paper } from '@mui/material';
import React, { useEffect, useState } from 'react';

import FormButtons from '../../../components/ui/FormButtons';
import GridField from '../../../components/ui/GridField';
import TitleFragment from '../../../components/ui/TitleFragment';
import { useStateContext } from '../../../context/StateContext';
import { generateBOL } from '../api/reporting';

const BillOfLading: React.FC = () => {
  const { setViewing } = useStateContext();
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
    generateBOL(tracking.begtracking, tracking.endtracking);
  };
  const handleChange = (e: React.SyntheticEvent) => {
    const target = e.target as HTMLInputElement;
    setTracking((prev) => {
      return {
        ...prev,
        [target.name]: Number.isNaN(Number(target.value))
          ? 0
          : Number(target.value),
      };
    });
  };

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
            <input
              type="date"
              onChange={(e) =>
                console.log(typeof e.target.value, e.target.value)
              }
            />
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
                title="Bill of Lading"
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
                inputProps={{ maxLength: 10, type: 'Number' }}
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
                inputProps={{ maxLength: 10, type: 'Number' }}
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

export default BillOfLading;
