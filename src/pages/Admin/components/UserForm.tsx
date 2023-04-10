import {
  Checkbox,
  Container,
  FormControlLabel,
  Grid,
  Paper,
  SelectChangeEvent,
} from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import {
  IDetailLookup,
  IPage,
  ITraceUserFormData,
} from '../../../@types/tracetypes';
import { createUser, getUser, getUsernames, updateUser } from '../api/admin';

import { useSnackbar } from 'notistack';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import { AuthContextType } from '../../../@types/authcontext';
import { StateContextType } from '../../../@types/statecontext';
import SelectFragment from '../../../components/form/SelectFragment';
import FormButtons from '../../../components/ui/FormButtons';
import GridField from '../../../components/ui/GridField';
import TitleFragment from '../../../components/ui/TitleFragment';
import { AuthContext } from '../../../context/AuthContext';
import { StateContext } from '../../../context/StateContext';
import { default_user } from '../../../utils/constants';
import { getDetailByID } from '../../Misc/api/details';

const UserForm: React.FC<IPage> = () => {
  const { id } = useParams();
  const [traceUser, setTraceUser] = useState<ITraceUserFormData>(default_user);
  const { user, isAdmin, setUser } = useContext(AuthContext) as AuthContextType;
  const [users, setUsernames] = useState<string[]>([]);
  const [checkUsername, setCheckUsername] = useState<boolean>(false);
  const [originalUsername, setOriginalUsername] = useState<string>('');

  const { enqueueSnackbar } = useSnackbar();

  const { setLoading, setStaticValue, handleSelectChange } = useContext(
    StateContext
  ) as StateContextType;
  const [isUpdate, setIsUpdate] = useState(false);
  const { data: roles } = useQuery<IDetailLookup[]>('roles', () =>
    getDetailByID(4)
  );

  const ClearForm = () => {
    setTraceUser(default_user);
  };

  const checkUsernameExists = (username: string) => {
    if (username === originalUsername) {
      setCheckUsername(false);
      return;
    }
    if (users.includes(username)) {
      setCheckUsername(true);
    } else {
      setCheckUsername(false);
    }
  };

  const handleChange = (e: React.SyntheticEvent) => {
    const target = e.target as HTMLInputElement;
    const value = target.value;
    if (target.name === 'username') {
      checkUsernameExists(value);
    }
    setTraceUser((prev: any) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (import.meta.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-restricted-syntax
        console.log(
          `Value Change Event fired for name: ${target.name} value change ${
            prev[target.name]
          } 👉 ${value}`
        );
      }
      return { ...prev, [target.name]: value };
    });
  };

  const handleSwitch = (e: React.SyntheticEvent) => {
    const target = e.target as HTMLInputElement;
    setStaticValue(target.name, target.checked, setTraceUser);
  };

  const submitForm = async (e: React.SyntheticEvent) => {
    setLoading(true);
    e.preventDefault();

    const data = {
      ...traceUser,
      user_id: isUpdate ? user?.id : undefined,
    };

    // Upsert Here
    try {
      if (isUpdate) {
        const res = await updateUser(data);
        if (!res.success) {
          enqueueSnackbar('Error Updating User', { variant: 'error' });
        } else {
          enqueueSnackbar('User Updated', { variant: 'success' });
          if (user?.username === data.username) {
            setUser((prev: any) => {
              return {
                ...prev,
                firstname: data.first_name,
                lastname: data.last_name,
              };
            });
          }
        }
      } else {
        await createUser(data);
        enqueueSnackbar('User Created', { variant: 'success' });
      }
    } catch (error) {
      enqueueSnackbar('Error Creating User', { variant: 'error' });
      console.error(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    getUsernames().then((res) => {
      if (res) {
        setUsernames(res.data);
      }
    });
  }, []);

  useEffect(() => {
    if (id) {
      getUser(Number(id)).then((res) => {
        if (res.success) {
          setTraceUser(res.data);
          setIsUpdate(true);
          setOriginalUsername(res.data.username);
        }
      });
      setIsUpdate(true);
    } else {
      setTraceUser(default_user);
      setIsUpdate(false);
    }
  }, [id]);

  return (
    <Grid container direction="row" justifyContent="center" alignItems="center">
      <Container className="mt-2 mx-0 px-0" maxWidth="md">
        <Paper
          component="form"
          elevation={0}
          variant="outlined"
          onSubmit={submitForm}
          className="p-3 w-100"
        >
          <Grid
            container
            direction="row"
            wrap="nowrap"
            justifyContent="space-around"
            alignContent="center"
          >
            <Grid xs={16} item>
              <TitleFragment
                size="h3"
                title={id ? 'My Account' : 'New User'}
                firstDivider={false}
              />
            </Grid>
          </Grid>
          <Grid
            container
            direction="row"
            wrap="nowrap"
            justifyContent="space-evenly"
            alignItems="center"
            columnSpacing={1}
          >
            <GridField
              size={16}
              id="Username"
              label="Username"
              name="username"
              error={checkUsername}
              helperText={checkUsername ? 'Username is taken' : ' '}
              inputProps={{
                maxLength: 55,
                autocomplete: '',
              }}
              disableAutocomplete
              onChange={(e: React.SyntheticEvent) => handleChange(e)}
              value={traceUser?.username ? traceUser.username : ''}
              fullWidth
            />
          </Grid>
          {!isUpdate && (
            <Grid
              container
              direction="row"
              wrap="nowrap"
              justifyContent="space-evenly"
              alignItems="center"
              columnSpacing={1}
            >
              <GridField
                size={16}
                id="Password"
                label="Password"
                name="password"
                inputProps={{ maxLength: 100, type: 'password' }}
                onChange={(e: React.SyntheticEvent) => handleChange(e)}
                value={traceUser?.password ? traceUser.password : ''}
                fullWidth
                disableAutocomplete
              />
            </Grid>
          )}
          <Grid
            container
            direction="row"
            wrap="nowrap"
            justifyContent="space-evenly"
            alignItems="center"
            columnSpacing={1}
          >
            <GridField
              size={8}
              id="FirstName"
              label="First Name"
              name="first_name"
              inputProps={{ maxLength: 55 }}
              onChange={(e: React.SyntheticEvent) => handleChange(e)}
              value={traceUser?.first_name ? traceUser.first_name : ''}
              fullWidth
            />
            <GridField
              size={8}
              id="LastName"
              label="Last Name"
              name="last_name"
              inputProps={{ maxLength: 55 }}
              onChange={(e: React.SyntheticEvent) => handleChange(e)}
              value={traceUser?.last_name ? traceUser.last_name : ''}
              fullWidth
            />
          </Grid>
          {isAdmin && (
            <>
              <Grid
                container
                direction="row"
                className="py-2"
                wrap="nowrap"
                justifyContent="flex-start"
                alignItems="center"
                columnSpacing={1}
              >
                {roles && (
                  <Grid item xs={4}>
                    <SelectFragment
                      selectOptions={roles}
                      state={traceUser?.role ? traceUser.role : 0}
                      label="Role"
                      id="role"
                      changeState={(e: SelectChangeEvent) =>
                        handleSelectChange(e, setTraceUser)
                      }
                      valColumn="value"
                      name="role"
                      descColumn="desc"
                      none={false}
                      noneValue={undefined}
                      disabled={false}
                    />
                  </Grid>
                )}
              </Grid>
              <Grid
                container
                className="pt-1"
                direction="row"
                wrap="nowrap"
                justifyContent="flex-start"
                alignItems="center"
                columnSpacing={1}
              >
                <Grid item xs={2}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="is_active"
                        checked={
                          traceUser?.is_active ? traceUser.is_active : false
                        }
                        value={traceUser?.is_active}
                        onChange={(e: React.SyntheticEvent) => handleSwitch(e)}
                      />
                    }
                    label="Active User"
                  />
                </Grid>

                <Grid item xs={8}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="reset_password"
                        checked={
                          traceUser?.reset_password
                            ? traceUser.reset_password
                            : false
                        }
                        value={traceUser?.reset_password}
                        onChange={(e: React.SyntheticEvent) => handleSwitch(e)}
                      />
                    }
                    label="Force Password Reset"
                  />
                </Grid>
              </Grid>
            </>
          )}
          <FormButtons isUpdate={isUpdate} clear={ClearForm} />
        </Paper>
      </Container>
    </Grid>
  );
};

export default UserForm;
