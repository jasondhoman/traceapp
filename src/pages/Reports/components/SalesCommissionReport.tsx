import { Container, Grid, Paper } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { formatShortDate, maskDate } from '../../../utils/helpers';

import validator from 'validator';
import FormButtons from '../../../components/ui/FormButtons';
import GridField from '../../../components/ui/GridField';
import TitleFragment from '../../../components/ui/TitleFragment';
import { useStateContext } from '../../../context/StateContext';
import { getSalesCommissionReport } from '../api/reporting';

const SalesCommissionReport: React.FC = () => {
  const [enddate] = useState(formatShortDate(new Date()));
  const [reportDates, setReportDates] = useState({
    begin_date: {
      error: false,
      helperText: '',
      value: '',
    },
    end_date: { error: false, helperText: '', value: enddate },
  });
  const clearForm = () => {
    setReportDates({
      begin_date: {
        error: false,
        helperText: '',
        value: '',
      },
      end_date: { error: false, helperText: '', value: enddate },
    });
  };
  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    const beginDateString = reportDates.begin_date.value.split('T')[0];
    const endDateString = reportDates.end_date.value.split('T')[0];
    getSalesCommissionReport(beginDateString, endDateString);
  };

  const handleDateChange = (e: React.SyntheticEvent) => {
    const target = e.target as HTMLInputElement;
    const newOrderDate = reportDates;

    if (target.name === 'begin_date') {
      newOrderDate.begin_date.value = maskDate(target.value);
      if (newOrderDate.begin_date.value !== '') {
        newOrderDate.begin_date.error = !validator.isDate(target.value, {
          format: 'MM-DD-YYYY',
        });
      } else {
        newOrderDate.begin_date.error = false;
      }
    }
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
                title="Sales Commission Report"
              />
              <Grid
                container
                direction="row"
                className="my-2 mx-2"
                justifyContent="space-center"
                alignItems="center"
                columnSpacing={2}
                rowSpacing={1}
                columns={16}
              >
                <GridField
                  size="auto"
                  error={reportDates.begin_date.error}
                  helperText={
                    reportDates.begin_date.error ? 'Enter a valid date' : ' '
                  }
                  placeholder="MM-DD-YYYY"
                  id="begin_date"
                  name="begin_date"
                  margin="normal"
                  label="Begin Date"
                  inputProps={{
                    maxLength: 10,
                  }}
                  onChange={handleDateChange}
                  value={reportDates.begin_date.value}
                />
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

export default SalesCommissionReport;
