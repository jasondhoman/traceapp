import { Grid, Paper } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { AuthContextType } from '../../../@types/authcontext';
import GridField from '../../../components/ui/GridField';
import TitleFragment from '../../../components/ui/TitleFragment';
import { AuthContext } from '../../../context/AuthContext';
import { getError } from '../api/admin';

const ErrorView: React.FC = () => {
  const { user } = useContext(AuthContext) as AuthContextType;
  const navigate = useNavigate();
  const { id } = useParams();
  const [error, setError] = useState<{
    id: number;
    error: string;
    payload: string;
    stacktrace: string;
    endpoint: string;
    userid: number;
    created_at: string;
  } | null>(null);

  useEffect(() => {
    if (!user || user.username.toLowerCase() !== 'jay') {
      navigate('/');
    }
    if (id) {
      getError(Number(id))
        .then((res) => {
          const error = res;
          error.error = error.error
            .replaceAll('\\n', '\n')
            .replaceAll('\\t', '\t')
            .replaceAll('\\r', '\r')
            .replaceAll('\\', '');
          error.stacktrace = error.stacktrace
            .replaceAll('\\n', '\n')
            .replaceAll('\\t', '\t')
            .replaceAll('\\r', '\r')
            .replaceAll('\\', '');
          error.payload = error.payload
            .replaceAll('\\n', '\n')
            .replaceAll('\\t', '\t')
            .replaceAll('\\r', '\r')
            .replaceAll('\\', '');

          const payload = JSON.parse(error.payload);
          error.payload = JSON.stringify(payload, null, 2);

          setError(error);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [id, navigate, user]);

  return (
    <Paper
      component="form"
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
        <TitleFragment size="h3" firstDivider={false} title="Error" />

        <GridField
          size={16}
          id="outlined-multiline-static"
          label="Endpoint"
          variant="filled"
          value={error?.endpoint || ''}
          fullWidth
        />
        <GridField
          size={16}
          fullWidth
          multiline
          margin="normal"
          id="error"
          label="Error"
          variant="filled"
          value={error?.error || ''}
          inputProps={{ maxLength: 150 }}
        />
        <GridField
          size={16}
          fullWidth
          multiline
          margin="normal"
          id="stacktrace"
          label="Stacktrace"
          variant="filled"
          value={error?.stacktrace || ''}
          inputProps={{ maxLength: 150 }}
        />

        <GridField
          size={16}
          fullWidth
          multiline
          margin="normal"
          id="payload"
          label="Payload"
          variant="filled"
          value={error?.payload || ''}
          inputProps={{ maxLength: 150 }}
        />
      </Grid>
    </Paper>
  );
};

export default ErrorView;
