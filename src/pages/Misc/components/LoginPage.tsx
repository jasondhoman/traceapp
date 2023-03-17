import { Container, Grid } from '@mui/material';
import React, { useContext } from 'react';

import LoginIcon from '@mui/icons-material/Login';
import LoadingButton from '@mui/lab/LoadingButton';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import { AuthContextType } from '../../../@types/authcontext';
import { StateContextType } from '../../../@types/statecontext';
import GridField from '../../../components/ui/GridField';
import { AuthContext } from '../../../context/AuthContext';
import { StateContext } from '../../../context/StateContext';

const LoginPage = () => {
  const { statusLevel, status, loginUser } = useContext(
    AuthContext
  ) as AuthContextType;
  const { isLoading } = useContext(StateContext) as StateContextType;
  const [user, setUser] = React.useState({
    username: '',
    password: '',
  });

  const handleChange = (e: React.SyntheticEvent) => {
    const target = e.target as HTMLInputElement;
    setUser({ ...user, [target.name]: target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    loginUser(e);
  };
  return (
    <Grid container direction="row" justifyContent="center" alignItems="center">
      <Container className="mt-2 mx-0 px-0" maxWidth="sm">
        <Paper
          component="form"
          elevation={0}
          variant="outlined"
          onSubmit={handleSubmit}
          className="p-3 w-100"
        >
          <Grid item xs={16} className="py-2 my-0">
            <Grid
              item
              xs={16}
              component="div"
              className="text-center py-2 my-0 font-weight-thin"
              style={{ whiteSpace: 'nowrap', fontSize: '2rem' }}
            >
              Trace Industries
            </Grid>
          </Grid>
          <Grid
            container
            direction="row"
            justifyContent="space-center"
            alignItems="center"
            columnSpacing={2}
            rowSpacing={1}
            columns={16}
          >
            <GridField
              size={16}
              fullWidth
              id="username"
              name="username"
              disabled={true}
              label="Username"
              value={user.username}
              onChange={handleChange}
            />

            <GridField
              size={16}
              fullWidth
              label="Password"
              id="password"
              name="password"
              inputProps={{ type: 'password', require: true.toString() }}
              value={user.password}
              onChange={handleChange}
            />

            <Grid
              container
              direction="row"
              justifyContent="center"
              justifyItems="space-evenly"
              spacing={1}
            >
              <Grid item>
                <Button variant="outlined" type="reset">
                  Clear
                </Button>
              </Grid>
              <Grid item>
                <LoadingButton
                  variant="contained"
                  type="submit"
                  style={{ boxShadow: 'none' }}
                  loading={isLoading}
                  startIcon={<LoginIcon />}
                >
                  Submit
                </LoadingButton>
              </Grid>
            </Grid>
            {status ? (
              <Grid
                container
                direction="row"
                className="py-2 mt-1"
                justifyContent="center"
                justifyItems="center"
                spacing={1}
              >
                <Grid item xs={10}>
                  <Alert className="w-100" severity={statusLevel}>
                    {status}
                  </Alert>
                </Grid>
              </Grid>
            ) : null}
          </Grid>
        </Paper>
      </Container>
    </Grid>
  );
};

export default LoginPage;
