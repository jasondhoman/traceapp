import { Grid, Paper } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { ReducerActionType, SetPageState } from '../../../utils/reducers';
import { addCertificate, updateCertificate } from '../api/certifications';

import { AxiosResponse } from 'axios';
import { AuthContextType } from '../../../@types/authcontext';
import { StateContextType } from '../../../@types/statecontext';
import { ICertificationForm } from '../../../@types/tracetypes';
import FormButtons from '../../../components/ui/FormButtons';
import GridField from '../../../components/ui/GridField';
import TitleFragment from '../../../components/ui/TitleFragment';
import { AuthContext } from '../../../context/AuthContext';
import { StateContext } from '../../../context/StateContext';
import useQueryMutation from '../../../hooks/useQueryMutation';
// import { validateRequest } from "../../../utils/validators";
// import { ZodError } from "zod";
import { useSnackbar } from 'notistack';
// import * as Model from "../models/certifications.model";

interface ICertification {
  reducer: React.Dispatch<SetPageState>;
  p_certification?: ICertificationForm;
  id?: number;
}

const CertificationForm: React.FC<ICertification> = ({
  reducer,
  p_certification,
  id,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const updateCertificateMutation = useQueryMutation({
    mutator: updateCertificate,
    method: 'PUT',
    query: 'certifications',
  });

  const addCertificateMutation = useQueryMutation({
    mutator: addCertificate,
    method: 'POST',
    query: 'certifications',
    errorClosure: (error: AxiosResponse<any, any>) => {
      if (error?.status === 200) {
        reducer({
          type: ReducerActionType.CANCEL,
          payload: {
            tablabel: 'Add New',
            tab_id: 1,
            id: null,
            disabled: false,
          },
        });
      }
    },
  });

  const { user } = useContext(AuthContext) as AuthContextType;

  const { setLoading } = useContext(StateContext) as StateContextType;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isUpdate, setIsUpdate] = useState(false);
  const [disableSubmit, setDisableSubmit] = useState(true);
  const [certification, setCertification] = useState<ICertificationForm>(
    p_certification ?? {
      certification: '',
      description: '',
    }
  );

  const submitForm = async (e: React.SyntheticEvent) => {
    try {
      setLoading(true);
      e.preventDefault();

      const data = {
        ...certification,
        certification_id: isUpdate ? p_certification?.id : null,
        user_id: user?.id,
      };

      if (isUpdate) {
        updateCertificateMutation.mutate(data);
      } else {
        addCertificateMutation.mutate(data);
      }
    } catch (error) {
      const err = error as Error;
      const message = err.message.replace('Error:', '');
      enqueueSnackbar(message, { variant: 'error' });
    }
  };

  const ClearForm = () => {
    setCertification({
      certification: '',
      description: '',
    });
  };

  const handleChange = (evt: React.SyntheticEvent) => {
    setDisableSubmit(false);
    const target = evt.target as HTMLInputElement;
    setCertification((prev: any) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (import.meta.env.NODE_ENV === 'development') {
        console.log(
          `Value Change Event fired for name: ${target.name} value change ${
            prev[target.name]
          } 👉 ${target.value}`
        );
      }
      return { ...prev, [target.name]: target.value };
    });
  };
  setLoading(false);

  useEffect(() => {
    if (p_certification) {
      setIsUpdate(true);
      setCertification(p_certification);
    }
  }, [p_certification]);

  return (
    <Paper
      component="form"
      onSubmit={submitForm}
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
          title="Certification Form"
        />
        <GridField
          size={16}
          fullWidth
          margin="normal"
          id="certification"
          label="Certification"
          name="certification"
          value={certification.certification}
          onChange={handleChange}
          inputProps={{ maxLength: 150 }}
        />
        <GridField
          size={16}
          id="description"
          name="description"
          margin="normal"
          label="Description"
          onChange={handleChange}
          value={certification.description}
          inputProps={{ maxLength: 1000 }}
          fullWidth
          multiline
          helperText="Press Enter to Add New Line"
        />
      </Grid>
      <FormButtons
        isUpdate={isUpdate}
        reducer={reducer}
        clear={ClearForm}
        disableSubmit={disableSubmit}
      />
    </Paper>
  );
};

export default CertificationForm;
