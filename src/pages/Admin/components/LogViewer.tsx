import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { getLogDates, getLogs } from '../api/admin';

import InfoIcon from '@mui/icons-material/Info';
import WarningIcon from '@mui/icons-material/Warning';
import { useQueryClient } from 'react-query';
import { LogMessage } from '../../../@types/tracetypes';
import GridDisplay from '../../../components/ui/GridDisplay';

const LogViewer = () => {
  const queryClient = useQueryClient();
  const [isLoading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string>('');
  const [logdates, setLogdates] = useState<string[]>([]);
  const [logs, setLogs] = useState<LogMessage[]>();
  // const {
  //   isLoading,
  //   error,
  //   data: logs,
  // } = useQuery(
  //   "logs",
  //   async () => {
  //     const dates = await getLogDates();
  //     console.log(selected);
  //     if (dates) {
  //       setLogdates(dates);
  //       if (selected === "") {
  //         setSelected(dates[dates.length - 1]);
  //         return getLogs(dates[dates.length - 1]);
  //       }
  //     }
  //     if (selected === "") {
  //       setSelected(today.toISOString().split("T")[0]);
  //       return getLogs(today.toISOString().split("T")[0]);
  //     }

  //     return getLogs(selected);
  //   },
  //   {
  //     refetchInterval: 30000,
  //   }
  // );

  // const;
  // const { data: logdates } = useQuery("logdates", getLogDates);

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    setSelected(e.target.value);
    queryClient.invalidateQueries('logs');
  };

  useEffect(() => {
    getLogDates()
      .then((res) => {
        setLogdates(res);
      })
      .then(() => {
        getLogs(selected)
          .then((res) => {
            if (res) {
              setLogs(res);
            }
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, [selected]);

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
    { field: 'api', headerName: 'Api', sortable: true, width: 120 },
    {
      field: 'payload_size',
      headerName: 'Payload Size',
      sortable: true,
      hide: true,
      width: 150,
    },
    {
      field: 'end_point',
      headerName: 'End_point',
      sortable: true,
      hide: true,
      width: 300,
    },
    { field: 'message', headerName: 'Message', sortable: true, width: 600 },
  ];

  return (
    <Grid container direction="row" justifyContent="center" alignItems="center">
      <FormControl fullWidth variant="outlined" className="m-0">
        <InputLabel id="dateSelect">Log Date</InputLabel>
        <Select
          id="logSelect"
          label="Log Date"
          value={selected}
          onChange={(e) => handleSelectChange(e)}
          fullWidth
          name="logselect"
        >
          <MenuItem key={-1} value="">
            Select Log Date
          </MenuItem>
          {logdates.map((option: any, index: number) => (
            <MenuItem key={index.toString()} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <GridDisplay
        density="compact"
        columns={columns}
        rows={logs ?? []}
        isloading={isLoading}
      />
    </Grid>
  );
};
export default LogViewer;
