import { Grid, Link, Tooltip } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';

import PageviewIcon from '@mui/icons-material/Pageview';
import { blue } from '@mui/material/colors';
import { useNavigate } from 'react-router';
import { AuthContextType } from '../../../@types/authcontext';
import GridDisplay from '../../../components/ui/GridDisplay';
import { AuthContext } from '../../../context/AuthContext';
import { getErrors } from '../api/admin';

const ErrorDisplay = () => {
  const { user } = useContext(AuthContext) as AuthContextType;
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(true);
  const [errors, setErrors] = useState<
    {
      id: number;
      error: string;
      payload: string;
      stacktrace: string;
      endpoint: string;
      userid: number;
      created_at: string;
    }[]
  >();

  useEffect(() => {
    if (!user || user.username.toLowerCase() !== 'jay') {
      navigate('/');
    }
    getErrors()
      .then((res) => {
        setErrors(res);
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, []);

  const columns = [
    {
      field: 'id',
      headerName: 'Action',

      sortable: true,
      width: 100,
      renderCell: (params: any) => {
        return (
          <Grid container justifyContent="center">
            <Tooltip title="View Error" placement="top">
              {params.value ? (
                <Link href={`/adminpanel/errors/${params.value}`} target="new">
                  <PageviewIcon style={{ color: blue[500] }} />
                </Link>
              ) : (
                <Link>{params.value}</Link>
              )}
            </Tooltip>
          </Grid>
        );
      },
    },
    {
      field: 'error',
      headerName: 'Error',
      sortable: true,
      hide: true,
      width: 250,
    },
    {
      field: 'payload',
      headerName: 'Payload',
      sortable: true,
      width: 250,
    },
    {
      field: 'stacktrace',
      headerName: 'Stacktrace',
      sortable: true,
      width: 300,
    },
    { field: 'endpoint', headerName: 'Endpoint', sortable: true, width: 120 },
    {
      field: 'created_at',
      headerName: 'When Occurred',
      sortable: true,
      width: 200,
      renderCell: (params: any) => {
        const cstDateTime = new Date(params.value).toLocaleString('en-US', {
          timeZone: 'America/Chicago',
        });
        return (
          <Grid container justifyContent="center">
            <div>{cstDateTime.replace(/,/g, '')}</div>
          </Grid>
        );
      },
    },
  ];

  return (
    <Grid container direction="row" justifyContent="center" alignItems="center">
      <GridDisplay
        density="compact"
        columns={columns}
        rows={errors ?? []}
        isloading={isLoading}
      />
    </Grid>
  );
};
export default ErrorDisplay;
