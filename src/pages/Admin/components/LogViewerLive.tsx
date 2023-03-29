import InfoIcon from '@mui/icons-material/Info';
import WarningIcon from '@mui/icons-material/Warning';
import { Grid } from '@mui/material';
import React from 'react';
import { useQuery } from 'react-query';
import { makeStyles } from 'tss-react/mui';
import GridDisplay from '../../../components/ui/GridDisplay';
import { getLogs } from '../api/admin';

const useStyles = makeStyles()((theme) => ({
  root: {
    '& .MuiDataGrid-columnHeaderCheckbox .MuiDataGrid-columnHeaderTitleContainer':
      {
        display: 'none',
      },
  },
}));

const LogViewerLive = () => {
  const today = new Date().toISOString();
  const { classes } = useStyles();
  const { isLoading, data: logs } = useQuery(
    'logs',
    () => getLogs(today.split('T')[0]),
    {
      refetchInterval: 5000,
    }
  );

  const columns = [
    {
      field: 'timestamp',
      headerName: 'Log Time',
      sortable: true,
      width: 250,
    },
    {
      field: 'server',
      headerName: 'Server',
      sortable: true,
      hide: true,
      width: 120,
    },
    {
      field: 'level',
      headerName: 'Level',
      sortable: true,
      width: 100,
      renderCell: (params: any) => {
        return (
          <Grid
            container
            direction="row"
            wrap="nowrap"
            justifyContent="space-evenly"
            alignItems="flex-end"
          >
            <Grid item>
              {params.value === 'warning' || params.value === 'error' ? (
                <WarningIcon color="error" />
              ) : (
                <InfoIcon color="primary" />
              )}{' '}
            </Grid>
            <Grid item>{params.value}</Grid>
          </Grid>
        );
      },
    },
    { field: 'method', headerName: 'Method', sortable: true, width: 90 },
    { field: 'status', headerName: 'Status', sortable: true, width: 60 },
    {
      field: 'response',
      headerName: 'Response Time',
      sortable: true,
      width: 140,
    },
    { field: 'api', headerName: 'API', sortable: true, width: 120 },
    {
      field: 'payload_size',
      headerName: 'Payload Size',
      sortable: true,
      hide: true,
      width: 150,
    },
    {
      field: 'end_point',
      headerName: 'End Point',
      sortable: true,
      hide: true,
      width: 300,
    },
    { field: 'message', headerName: 'Message', sortable: true, width: 600 },
  ];

  return (
    <Grid container direction="row" justifyContent="center" alignItems="center">
      <GridDisplay
        className={classes.root}
        density="compact"
        columns={columns}
        rows={logs ?? []}
        isloading={isLoading}
      />
    </Grid>
  );
};
export default LogViewerLive;
