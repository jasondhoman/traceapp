import { Grid, Paper } from '@mui/material';
import React, { useContext, useState } from 'react';

import LoginIcon from '@mui/icons-material/Login';
import LoadingButton from '@mui/lab/LoadingButton';
import { Container } from '@mui/material';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router';
import { AuthContextType } from '../../../@types/authcontext';
import { StateContextType } from '../../../@types/statecontext';
import GridField from '../../../components/ui/GridField';
import { AuthContext } from '../../../context/AuthContext';
import { StateContext } from '../../../context/StateContext';
import { updatePassword } from '../../Admin/api/admin';

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const { statusLevel, status, user } = useContext(
    AuthContext
  ) as AuthContextType;
  const { isLoading } = useContext(StateContext) as StateContextType;
  const [updatedUser, setUpdatedUser] = useState({
    username: user ? user.username : '',
    password: '',
    password2: '',
  });

  const onChange = (e: React.SyntheticEvent) => {
    const target = e.target as HTMLInputElement;
    setUpdatedUser({ ...updatedUser, [target.name]: target.value });
  };

  const submitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(updatedUser.password);
    updatePassword(updatedUser.password)
      .then((res) => {
        if (res && res.status === 200) {
          navigate('/');
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Grid container direction="row" justifyContent="center" alignItems="center">
      <Container className="mt-2 mx-0 px-0" maxWidth="sm">
        <Paper
          component="form"
          elevation={0}
          variant="outlined"
          onSubmit={submitForm}
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
              Reset Password
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
              value={user ? user?.username : ''}
              disabled={true}
              label="Username"
            />

            <GridField
              size={16}
              fullWidth
              label="Password"
              id="password"
              name="password"
              onChange={onChange}
              value={updatedUser.password}
              inputProps={{ type: 'password', require: true.toString() }}
            />
            <GridField
              error={updatedUser.password !== updatedUser.password2}
              size={16}
              fullWidth
              label="Confirm Password"
              id="password2"
              name="password2"
              onChange={onChange}
              value={updatedUser.password2}
              inputProps={{ type: 'password', require: true.toString() }}
            />

            {status ? (
              <div className="pb-2">
                <Alert severity={statusLevel}>{status}</Alert>
              </div>
            ) : null}
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
          </Grid>
        </Paper>
      </Container>
    </Grid>
  );
};

export default ResetPasswordPage;
