import { Grid, Paper } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { ReducerActionType, SetPageState } from '../../../utils/reducers';
import {
  addRawMaterial,
  getRawMaterials,
  updateRawMaterial,
} from '../api/rawmaterial';

import { AxiosResponse } from 'axios';
import { useSnackbar } from 'notistack';
import { useQueryClient } from 'react-query';
import { AuthContextType } from '../../../@types/authcontext';
import { StateContextType } from '../../../@types/statecontext';
import { IRawMaterialFormData } from '../../../@types/tracetypes';
import FormButtons from '../../../components/ui/FormButtons';
import GridField from '../../../components/ui/GridField';
import TitleFragment from '../../../components/ui/TitleFragment';
import { AuthContext } from '../../../context/AuthContext';
import { StateContext } from '../../../context/StateContext';
import useQueryMutation from '../../../hooks/useQueryMutation';
import { default_raw_mat } from '../../../utils/constants';
import { GetDate } from '../../../utils/helpers';

interface IRawMaterialsForm {
  reducer: React.Dispatch<SetPageState>;
  prop_raw_material?: IRawMaterialFormData;
  id?: number | null;
}

const RawMaterialForm: React.FC<IRawMaterialsForm> = ({
  reducer,
  prop_raw_material,
  id,
}) => {
  const { enqueueSnackbar } = useSnackbar();

  const { user } = useContext(AuthContext) as AuthContextType;
  const { setLoading, handleDateChange } = useContext(
    StateContext
  ) as StateContextType;
  const queryClient = useQueryClient();
  const [isUpdate, setIsUpdate] = useState(false);
  const [rawmaterial, setRawMaterial] = useState(default_raw_mat);
  const [currentRawMaterials, setCurrentRawMaterials] = useState<string[]>([]);
  const [rawMaterialExists, setRawMaterialExists] = useState(false);

  const handleChangeText = (e: React.SyntheticEvent) => {
    const target = e.target as HTMLInputElement;
    if (target.name === 'description') {
      setRawMaterialExists(
        currentRawMaterials.filter((rm) => rm === target.value).length > 0
      );
    }
    setRawMaterial((prev) => {
      return { ...prev, [target.name]: target.value };
    });
  };

  const handleChangeNum = (e: React.SyntheticEvent) => {
    const target = e.target as HTMLInputElement;
    try {
      const value = Number(target.value);
      setRawMaterial((prev) => {
        return { ...prev, [target.name]: value };
      });
    } catch (error) {
      enqueueSnackbar('Please enter a number', { variant: 'error' });
    }
  };

  const addRawMatrialsMutation = useQueryMutation({
    mutator: addRawMaterial,
    method: 'POST',
    query: 'rawmaterials',
    errorClosure: (error: AxiosResponse<any, any>) => {
      if (error.status === 200 && !isUpdate) {
        reducer({
          type: ReducerActionType.CREATEANDSTAY,
          payload: {
            tablabel: 'Add New',
            tab_id: 2,
            id: null,
            disabled: false,
          },
        });
        ClearForm();
      }
    },
  });

  const updateRawMatrialsMutation = useQueryMutation({
    mutator: updateRawMaterial,
    method: 'PUT',
    query: 'rawmaterials',
  });

  const submitForm = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setLoading(true);
    if (rawMaterialExists) {
      enqueueSnackbar('Enter a different Grade', { variant: 'error' });
      setLoading(false);
      return;
    }
    try {
      const data = {
        ...rawmaterial,
        qty: parseFloat(rawmaterial.qty.toString()),
        amount_received: parseFloat(rawmaterial.amount_received.toString()),
        average_weight: parseFloat(rawmaterial.average_weight.toString()),
        price: parseFloat(rawmaterial.price.toString()),
        rawmaterials_id: isUpdate ? prop_raw_material?.id : null,
        user_id: user?.id,
      };

      if (isUpdate) {
        updateRawMatrialsMutation.mutate(data);
      } else {
        addRawMatrialsMutation.mutate(data);
      }
      queryClient.setQueryData('rawmaterial', rawmaterial);
    } catch (error) {
      enqueueSnackbar('Error: ' + error, { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleDateChangeWrapper = (e: React.SyntheticEvent) => {
    handleDateChange(e, setRawMaterial);
  };

  const ClearForm = () => {
    setRawMaterial(default_raw_mat);
  };

  const getCurrentRawmaterials = async () => {
    const rawmaterials = await getRawMaterials();
    if (rawmaterials) {
      setCurrentRawMaterials(
        rawmaterials.map(
          (rawmaterial: IRawMaterialFormData) =>
            `${rawmaterial.description},${rawmaterial.date_received}`
        )
      );
    }
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (prop_raw_material) {
      setIsUpdate(true);
      setRawMaterial({
        ...default_raw_mat,
        ...prop_raw_material,
        fr_additive: prop_raw_material.fr_additive
          ? prop_raw_material.fr_additive
          : 'N',
        date_received: new Date(prop_raw_material.date_received),
      });
    }
    setLoading(false);
    getCurrentRawmaterials();
  }, [id, prop_raw_material, setLoading]);

  return (
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
        justifyContent="space-center"
        alignItems="center"
        columnSpacing={2}
        rowSpacing={1}
        columns={16}
      >
        <TitleFragment
          firstDivider={false}
          title="Raw Material Form"
          size="h3"
        />
        <GridField
          size={0}
          className="px-1"
          id="date_received"
          name="date_received"
          margin="normal"
          label="Date Received"
          inputProps={{
            maxLength: 10,
            type: 'date',
            min: '1950-01-01',
            max: '2222-12-31',
          }}
          onChange={handleDateChangeWrapper}
          value={GetDate(rawmaterial.date_received)}
        />
        <GridField
          size={16}
          fullWidth
          error={rawMaterialExists}
          helperText={rawMaterialExists ? 'Grade already exists' : ''}
          margin="normal"
          id="description"
          name="description"
          label="Grade"
          value={rawmaterial.description}
          onChange={handleChangeText}
          inputProps={{ maxLength: 40 }}
        />

        <GridField
          size={16}
          fullWidth
          id="vendor"
          name="vendor"
          margin="normal"
          label="Vendor"
          onChange={handleChangeText}
          value={rawmaterial.vendor}
          inputProps={{ maxLength: 40 }}
        />
        {/* <YesNoSelect
          state={rawmaterial.fr_additive}
          changeState={(e) => {
            setStaticValue("fr_additive", e.target.value, setRawMaterial);
          }}
          label="FR Additive"
          size={6}
          id="fr_additive"
          name="fr_additive"
        /> */}
        <Grid
          container
          item
          justifyContent="flex-start"
          direction="row"
          xs={16}
          spacing={1}
          className="py-0 my-0"
          wrap="nowrap"
        >
          <GridField
            size={0}
            fullWidth
            id="price"
            name="price"
            margin="normal"
            label="Price"
            onChange={handleChangeNum}
            value={rawmaterial.price}
            inputProps={{
              maxLength: 10,
              type: 'number',
              step: '.00001',
              min: 0,
            }}
          />
          <GridField
            size={0}
            id="amount_received"
            name="amount_received"
            margin="normal"
            label="Amount Received"
            onChange={handleChangeNum}
            value={rawmaterial.amount_received}
            inputProps={{
              maxLength: 10,
              type: 'number',
              step: '.00001',
              min: 0,
            }}
          />
          <GridField
            size={0}
            id="qty"
            name="qty"
            margin="normal"
            label="Qty"
            onChange={handleChangeNum}
            value={rawmaterial.qty}
            inputProps={{
              maxLength: 10,
              type: 'number',
              step: '.00001',
            }}
          />
          <GridField
            size={0}
            fullWidth
            id="average_weight"
            name="average_weight"
            margin="normal"
            label="Average Weight"
            onChange={handleChangeNum}
            value={rawmaterial.average_weight}
            inputProps={{
              maxLength: 10,
              type: 'number',
              step: '.00001',
              min: 0,
            }}
          />
        </Grid>
        <GridField
          size={16}
          multiline
          fullWidth
          id="notes"
          name="notes"
          margin="normal"
          label="Notes"
          inputProps={{ maxLength: 1000 }}
          onChange={handleChangeText}
          value={rawmaterial.notes}
          helperText="Press Enter to Add New Line"
        />
      </Grid>
      <FormButtons isUpdate={isUpdate} reducer={reducer} clear={ClearForm} />
    </Paper>
  );
};

export default RawMaterialForm;
