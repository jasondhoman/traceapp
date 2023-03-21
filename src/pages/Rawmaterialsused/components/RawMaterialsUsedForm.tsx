import { Grid, Paper } from '@mui/material';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import {
  IRawMaterials,
  IRawMaterialsUsedFormData,
  IRawMaterialsUsedSubmitData,
} from '../../../@types/tracetypes';
import { ReducerActionType, SetPageState } from '../../../utils/reducers';
import {
  addRawMaterialused,
  updateRawMaterialUsed,
} from '../api/rawmaterialsused';

import { AxiosResponse } from 'axios';
import { useSnackbar } from 'notistack';
import { useQueryClient } from 'react-query';
import { StateContextType } from '../../../@types/statecontext';
import RawMaterialSelect from '../../../components/form/RawMaterialSelect';
import YesNoSelect from '../../../components/form/YesNoSelect';
import FormButtons from '../../../components/ui/FormButtons';
import GridField from '../../../components/ui/GridField';
import TitleFragment from '../../../components/ui/TitleFragment';
import { StateContext } from '../../../context/StateContext';
import useQueryMutation from '../../../hooks/useQueryMutation';
import { getRawMaterials } from '../../Rawmaterials/api/rawmaterial';

interface IRawMaterialsUsedEdit {
  reducer: React.Dispatch<SetPageState>;
  prop_raw_mat_used?: IRawMaterialsUsedFormData;
}

const default_schema = {
  description: 0,
  stock: 0,
  production_line: '',
  linter_report: 'N',
  qty: 0,
  average_weight: 0,
  price: 0,
  cost: 0,
  date_received: new Date(),
  fr_additive: 'N',
};

const RawMaterialsUsedEdit: React.FC<IRawMaterialsUsedEdit> = ({
  reducer,
  prop_raw_mat_used,
}) => {
  const { enqueueSnackbar } = useSnackbar();

  const { setLoading, viewing, handleChange, setStaticValue, setStaticValues } =
    useContext(StateContext) as StateContextType;

  const [rawmaterialused, setRawMaterialUsed] = useState(default_schema);
  const [isUpdate, setIsUpdate] = useState(false);
  const [init, setInit] = useState(true);
  const [rawMaterials, setRawMaterials] = useState<IRawMaterials[]>();
  const queryClient = useQueryClient();
  const data =
    queryClient.getQueryData<IRawMaterialsUsedFormData>('rawmaterialused');

  const addRawMatrialsUsedMutation = useQueryMutation({
    mutator: addRawMaterialused,
    method: 'POST',
    query: 'rawmaterialsused',
    errorClosure: (error: AxiosResponse<any, any>) => {
      if (error.status === 200 && !isUpdate) {
        reducer({
          type: ReducerActionType.CREATEANDSTAY,
          payload: {
            tablabel: 'Add New',
            tab_id: 1,
            id: null,
            disabled: false,
          },
        });
        ClearForm();
      }
    },
  });

  const updateRawMatrialsUsedMutation = useQueryMutation({
    mutator: updateRawMaterialUsed,
    method: 'PUT',
    query: 'rawmaterialsused',
  });

  const submitForm = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data: IRawMaterialsUsedSubmitData = {
        ...rawmaterialused,
        description: parseInt(rawmaterialused.description.toString()),
        stock: parseFloat(rawmaterialused.stock.toString()),
        qty: parseFloat(rawmaterialused.qty.toString()),
        average_weight: parseFloat(rawmaterialused.average_weight.toString()),
        price: parseFloat(rawmaterialused.price.toString()),
        cost: parseFloat(rawmaterialused.cost.toString()),
        rawmaterialsused_id: isUpdate ? prop_raw_mat_used?.id : null,
        production_line: rawmaterialused.production_line.toUpperCase(),
      };

      if (data.qty === 0) {
        throw new Error('Please Enter a qty value greater than zero');
      }
      if (isUpdate) {
        updateRawMatrialsUsedMutation.mutate(data);
      } else {
        addRawMatrialsUsedMutation.mutate(data);
      }
    } catch (error) {
      enqueueSnackbar(`${error}`, { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleChangeWrapper = (e: React.SyntheticEvent) => {
    handleChange(e, setRawMaterialUsed);
    // const cost =
    //   parseFloat(rawmaterialused.qty.toString()) *
    //   parseFloat(rawmaterialused.price.toString()) *
    //   parseFloat(rawmaterialused.average_weight.toString());
  };

  useEffect(() => {
    try {
      const cost =
        rawmaterialused.qty *
        rawmaterialused.price *
        rawmaterialused.average_weight;

      setRawMaterialUsed((prev) => {
        return { ...prev, cost: Number(cost.toFixed(2)) };
      });
    } catch {
      setRawMaterialUsed((prev) => {
        return { ...prev, cost: 0 };
      });
    }
  }, [
    rawmaterialused.average_weight,
    rawmaterialused.price,
    rawmaterialused.qty,
  ]);

  const handleChangeDescription = (id: number) => {
    if (rawMaterials && rawMaterials.length) {
      const selected = rawMaterials
        .filter((rawMaterial) => id === rawMaterial.id)
        .shift();

      setStaticValues(
        {
          description: selected?.id,
          price: selected?.price ?? 0,
          average_weight: selected?.average_weight ?? 0,
          stock: selected?.qty ?? 0,
          fr_additive: selected?.fr_additive ?? 'N',
        },
        setRawMaterialUsed
      );
    }
  };

  const getRawMaterialsData = useCallback(async () => {
    const data = await queryClient.fetchQuery<IRawMaterials[]>(
      `raw_mats`,
      getRawMaterials
    );
    if (data) {
      setRawMaterials(data);
    }
  }, [queryClient]);

  const ClearForm = () => {
    setRawMaterialUsed(default_schema);
  };

  useCallback(() => {
    if (
      rawmaterialused.qty === 0 ||
      rawmaterialused.average_weight === 0 ||
      rawmaterialused.price === 0
    ) {
      setRawMaterialUsed((prev) => ({
        ...prev,
        cost: 0,
      }));
    } else {
      setRawMaterialUsed((prev) => ({
        ...prev,
        cost:
          rawmaterialused.qty *
          rawmaterialused.average_weight *
          rawmaterialused.price,
      }));
    }
  }, [
    rawmaterialused.qty,
    rawmaterialused.average_weight,
    rawmaterialused.price,
  ]);

  useEffect(() => {
    getRawMaterialsData();

    if (data && init) {
      setIsUpdate(true);
      setRawMaterialUsed({
        ...data,
        date_received: new Date(data.date_received),
      });
      setInit(false);
    }
    setLoading(false);
  }, [data, getRawMaterialsData, init, setLoading]);

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
          title="Raw Material Used"
          size="h3"
        />

        <RawMaterialSelect
          state={rawmaterialused.description}
          changeState={handleChangeDescription}
          size={16}
          disabled={viewing}
        />

        <Grid
          container
          item
          justifyContent="flex-evenly"
          direction="row"
          alignItems="flex-end"
          spacing={2}
          columns={16}
          className="py-0 my-0"
        >
          <GridField
            size={4}
            fullWidth
            id="stock"
            name="stock"
            margin="normal"
            label="Stock"
            onChange={handleChangeWrapper}
            value={rawmaterialused.stock}
            inputProps={{ type: 'number', step: '.00001', maxLength: 40 }}
            disabled={viewing}
          />

          <GridField
            size={6}
            fullWidth
            requiredInput
            id="production_line"
            name="production_line"
            margin="normal"
            label="Production Line"
            onChange={handleChangeWrapper}
            value={rawmaterialused.production_line.toUpperCase()}
            inputProps={{ maxLength: 1, required: true }}
            disabled={viewing}
          />
          <YesNoSelect
            state={rawmaterialused.linter_report}
            changeState={(e) => {
              setStaticValue(
                'linter_report',
                e.target.value,
                setRawMaterialUsed
              );
            }}
            label="Linter Report"
            size={6}
            id="linter_report"
            name="linter_report"
          />
        </Grid>
        <Grid
          container
          direction="row"
          className="m-auto w-100 px-3 pb-3"
          justifyContent="flex-evenly"
          alignItems="flex-end"
          spacing={1}
          wrap="nowrap"
        >
          <GridField
            size={0}
            id="qty"
            name="qty"
            margin="normal"
            label="Qty"
            variant="standard"
            onChange={handleChangeWrapper}
            value={rawmaterialused.qty}
            inputProps={{
              maxLength: 10,
              type: 'number',
              step: '.00001',
              min: 0,
            }}
            disabled={viewing}
          />
          <Grid item className="mx-1 pb-1">
            x
          </Grid>
          <GridField
            size={0}
            fullWidth
            id="average_weight"
            name="average_weight"
            margin="normal"
            label="Average Weight"
            variant="standard"
            onChange={handleChangeWrapper}
            value={rawmaterialused.average_weight}
            inputProps={{
              maxLength: 10,
              type: 'number',
              step: '.00001',
              min: 0,
            }}
            disabled={viewing}
          />
          <Grid item className="mx-1 pb-1">
            x
          </Grid>
          <GridField
            size={0}
            fullWidth
            className="text-right"
            id="price"
            name="price"
            margin="normal"
            label="Price"
            variant="standard"
            onChange={handleChangeWrapper}
            value={rawmaterialused.price}
            inputProps={{
              maxLength: 10,
              type: 'number',
              step: '.00001',
              min: 0,
            }}
            disabled={viewing}
          />
          <Grid item xs={0} className="mx-1 pb-1">
            =
          </Grid>
          <GridField
            size={0}
            fullWidth
            id="cost"
            name="cost"
            margin="normal"
            label="Cost"
            variant="standard"
            onChange={handleChangeWrapper}
            value={rawmaterialused.cost}
            inputProps={{
              maxLength: 10,
              type: 'number',
              step: '.00001',
              min: 0,
            }}
            disabled={viewing}
          />
        </Grid>
      </Grid>
      <FormButtons isUpdate={isUpdate} reducer={reducer} clear={ClearForm} />
    </Paper>
  );
};

export default RawMaterialsUsedEdit;
