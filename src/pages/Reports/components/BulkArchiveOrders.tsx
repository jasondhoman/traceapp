import { Container, Grid, Paper } from '@mui/material';
import React, { useState } from 'react';
import { maskDate } from '../../../utils/helpers';

import { useSnackbar } from 'notistack';
import validator from 'validator';
import FormButtons from '../../../components/ui/FormButtons';
import GridField from '../../../components/ui/GridField';
import TitleFragment from '../../../components/ui/TitleFragment';
import { useStateContext } from '../../../context/StateContext';
import { bulkArchiveOrdersByDate } from '../../Orders/api/order';

const BulkArchiveOrders: React.FC = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { setViewing } = useStateContext();

  const [reportDates, setReportDates] = useState({
    end_date: { error: false, helperText: '', value: '' },
  });
  const clearForm = () => {
    setReportDates({
      end_date: { error: false, helperText: '', value: '' },
    });
  };
  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    const endDateString = reportDates.end_date.value.split('T')[0];
    const response = await bulkArchiveOrdersByDate(endDateString);
    if (response) {
      enqueueSnackbar(response.data.message, { variant: 'success' });
    } else {
      enqueueSnackbar('Error archiving orders', { variant: 'error' });
    }
  };

  const handleDateChange = (e: React.SyntheticEvent) => {
    const target = e.target as HTMLInputElement;
    const newOrderDate = reportDates;

    if (target.name === 'end_date') {
      newOrderDate.end_date.value = maskDate(target.value);
      if (newOrderDate.end_date.value !== '') {
        newOrderDate.end_date.error = !validator.isDate(target.value, {
          format: 'MM-DD-YYYY',
        });
      } else {
        newOrderDate.end_date.error = false;
      }
    }
    setReportDates((prev) => ({ ...prev, ...newOrderDate }));
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
                title="Archive Orders"
              />
              <Grid
                container
                direction="row"
                className="my-2 mx-2"
                justifyContent="center"
                alignItems="center"
                columnSpacing={2}
                rowSpacing={1}
                columns={16}
              >
                <Grid item>Archive Orders from Ship Date</Grid>
                <GridField
                  size="auto"
                  error={reportDates.end_date.error}
                  helperText={
                    reportDates.end_date.error ? 'Enter a valid date' : ' '
                  }
                  placeholder="MM-DD-YYYY"
                  id="end_date"
                  name="end_date"
                  margin="normal"
                  label="End Date"
                  inputProps={{
                    maxLength: 10,
                  }}
                  onChange={handleDateChange}
                  value={reportDates.end_date.value}
                />
              </Grid>
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

export default BulkArchiveOrders;
function useEffect(arg0: () => void, arg1: any[]) {
  throw new Error('Function not implemented.');
}
