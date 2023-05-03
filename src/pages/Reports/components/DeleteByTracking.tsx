import { Container, Grid, Paper } from '@mui/material';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';

import FormButtons from '../../../components/ui/FormButtons';
import GridField from '../../../components/ui/GridField';
import TitleFragment from '../../../components/ui/TitleFragment';
import { useStateContext } from '../../../context/StateContext';
import { deleteOrderByTracking } from '../../Orders/api/order';

const DeleteByTracking: React.FC = () => {
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
  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    const res = await deleteOrderByTracking(
      tracking.begtracking,
      tracking.endtracking
    );
    if (res.status === 200) {
      enqueueSnackbar('Order Deleted', { variant: 'success' });
      clearForm();
    } else {
      enqueueSnackbar('Error Deleting Order', { variant: 'error' });
    }
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
              <TitleFragment
                size="h3"
                firstDivider={false}
                title="Delete Orders By Tracking Number"
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

export default DeleteByTracking;
