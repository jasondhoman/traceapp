import { Grid, Paper } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { ReducerActionType, SetPageState } from '../../../utils/reducers';
import {
  addCustomerSize,
  getCustomerSizeLookupByCustomer,
  updateCustomerSize,
} from '../api/customersize';

import { AxiosResponse } from 'axios';
import { useSnackbar } from 'notistack';
import { useQueryClient } from 'react-query';
import { StateContextType } from '../../../@types/statecontext';
import { ICustomerSizeForm } from '../../../@types/tracetypes';
import CustomerSelect from '../../../components/form/CustomerSelect';
import GradeSelect from '../../../components/form/GradeSelect';
import FormButtons from '../../../components/ui/FormButtons';
import GridField from '../../../components/ui/GridField';
import TitleFragment from '../../../components/ui/TitleFragment';
import { StateContext } from '../../../context/StateContext';
import useQueryMutation from '../../../hooks/useQueryMutation';
import { default_size } from '../../../utils/constants';

interface ICustomerSize {
  prop_customer_size?: ICustomerSizeForm;
  reducer: React.Dispatch<SetPageState>;
}

const CustomerSizeForm: React.FC<ICustomerSize> = ({
  reducer,
  prop_customer_size,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const { setStaticValue, setLoading, handleChange } = useContext(
    StateContext
  ) as StateContextType;

  const [isUpdate, setIsUpdate] = useState(false);
  const queryClient = useQueryClient();
  const data = queryClient.getQueryData<ICustomerSizeForm>('customersize');
  const [customersize, setCustomerSize] = useState(default_size);
  const [customersizes, setCustomerSizes] = useState<string[]>([]);
  const [gradeError, setGradeError] = useState(false);
  const [priceError, setPriceError] = useState(false);

  const addCustomerSizeMutation = useQueryMutation({
    mutator: addCustomerSize,
    method: 'POST',
    query: 'customersizes',
    errorClosure: (error: AxiosResponse<any, any>) => {
      if (error.status === 200 && !isUpdate) {
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

  const handleChangeWrapper = (e: React.SyntheticEvent) => {
    const target = e.target as HTMLInputElement;
    const testValue = target.value === '' ? 0 : Number(target.value);
    let error = false;

    if (['price_per_pound', 'price_per_piece'].includes(target.name)) {
      if (
        target.name === 'price_per_pound' &&
        testValue !== 0 &&
        customersize.price_per_piece > 0
      ) {
        error = true;
      }
      if (
        target.name === 'price_per_piece' &&
        testValue !== 0 &&
        customersize.price_per_pound > 0
      ) {
        error = true;
      }
    } else if (
      customersize.price_per_piece > 0 &&
      customersize.price_per_pound > 0
    ) {
      error = true;
    }
    setPriceError(error);
    handleChange(e, setCustomerSize);
  };

  const updateCustomerSizeMutation = useQueryMutation({
    mutator: updateCustomerSize,
    method: 'PUT',
    query: 'customersizes',
  });
  const submitForm = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (gradeError) {
      enqueueSnackbar('Grade found for this customer', { variant: 'error' });
      return;
    }
    if (priceError) {
      enqueueSnackbar('Set either Price Per Pound or Price Per Piece', {
        variant: 'error',
      });
      return;
    }
    setLoading(true);
    if (customersize.price_per_piece > 0 && customersize.price_per_pound > 0) {
      enqueueSnackbar('Set either Price Per Pound or Price Per Piece', {
        variant: 'error',
      });
      setLoading(false);
      return;
    }

    const data = {
      ...customersize,
      pack_per_bundle: parseInt(customersize.pack_per_bundle.toString()),
      customer_id: parseInt(customersize.customer_id.toString()),
      stock: parseFloat(customersize.stock.toString()),
      pieces_per_pack: parseFloat(customersize.pieces_per_pack.toString()),
      length: parseFloat(customersize.length.toString()),
      run_weight: parseFloat(customersize.run_weight.toString()),
      pad_weight: parseFloat(customersize.pad_weight.toString()),
      price_per_pound: parseFloat(customersize.price_per_pound.toString()),
      price_per_piece: parseFloat(customersize.price_per_piece.toString()),
      extra_cost: parseFloat(customersize.extra_cost.toString()),
      avg_bale_weight: parseFloat(customersize.avg_bale_weight.toString()),
      min_weight: parseFloat(
        customersize.min_weight ? customersize.min_weight.toString() : '0'
      ),
      max_weight: parseFloat(
        customersize.max_weight ? customersize.max_weight.toString() : '0'
      ),
      grade_id: isUpdate ? prop_customer_size?.id : null,
    };

    if (isUpdate) {
      updateCustomerSizeMutation.mutate(data);
      queryClient.setQueryData('customersize', customersize);
    } else {
      addCustomerSizeMutation.mutate(data);
    }
  };

  const ClearForm = () => {
    setCustomerSize(default_size);
  };

  const handleDateChange = (e: React.SyntheticEvent) => {
    const target = e.target as HTMLInputElement;
    if (target.value === '' || target.value === undefined) return;
    setStaticValue(target.name, new Date(target.value), setCustomerSize);
  };

  const handleSelectChange = async (id: number) => {
    if (!id) return;

    const sizes = (await getCustomerSizeLookupByCustomer(id)) as {
      grade: string;
      tag_size: string;
      grade_mix_id: number;
    }[];
    const size_arr: string[] = [];
    sizes.forEach((size) => {
      size_arr.push(size.grade_mix_id + size.tag_size);
    });
    setCustomerSizes(size_arr);
    const checkGradeMix = size_arr.find(
      (size) => customersize.grade_mix_id + customersize.tag_size === size
    );
    if (checkGradeMix) {
      setGradeError(true);
    } else {
      setGradeError(false);
    }
    setCustomerSize((prev: any) => {
      return { ...prev, customer_id: id };
    });
    setCustomerSize((prev) => ({ ...prev, customer_id: id }));
  };

  useEffect(() => {
    if (data) {
      setIsUpdate(true);
      setCustomerSize({
        ...data,
        price_date: new Date(data.price_date),
      });
    }
    setLoading(false);
  }, [data, setLoading]);

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
        <TitleFragment size="h3" title="General" firstDivider={false} />

        <CustomerSelect
          id={customersize.customer_id}
          changeState={handleSelectChange}
        />

        <GradeSelect
          state={customersize.grade_mix_id}
          error={gradeError}
          helperText={
            gradeError ? 'Grade and Tag Size found for this customer' : ''
          }
          changeState={(id: number) => {
            setGradeError(() => {
              if (customersizes.includes(id + customersize.tag_size)) {
                return true;
              }
              return false;
            });
            setCustomerSize((prev) => ({ ...prev, grade_mix_id: id }));
          }}
        />

        <GridField
          size={16}
          fullWidth
          error={gradeError}
          helperText={
            gradeError ? 'Grade and Tag Size found for this customer' : ''
          }
          id="tagsize"
          name="tag_size"
          margin="normal"
          label="Tag Size"
          onChange={(e: React.SyntheticEvent) => {
            const target = e.target as HTMLInputElement;

            setGradeError(() => {
              if (
                customersizes.includes(customersize.grade_mix_id + target.value)
              ) {
                return true;
              }
              return false;
            });
            handleChangeWrapper(e);
          }}
          value={customersize.tag_size}
          inputProps={{ maxLength: 150 }}
        />
        <GridField
          size={16}
          fullWidth
          id="special_instructions"
          name="special_instructions"
          margin="normal"
          label="Special Instructions"
          onChange={(e: React.SyntheticEvent) => handleChangeWrapper(e)}
          value={customersize.special_instructions}
          inputProps={{ maxLength: 1000 }}
          multiline
          helperText="Press Enter to Add New Line"
        />
        <GridField
          fullWidth
          size={2}
          id="stock"
          name="stock"
          margin="normal"
          label="Stock"
          onChange={(e: React.SyntheticEvent) => handleChangeWrapper(e)}
          value={customersize.stock}
          inputProps={{
            maxLength: 10,
            type: 'number',
            step: '.00001',
          }}
        />
        <GridField
          size={3}
          className="px-1"
          id="pieces_per_pack"
          name="pieces_per_pack"
          margin="normal"
          label="Pieces Per Pack"
          onChange={(e: React.SyntheticEvent) => handleChangeWrapper(e)}
          value={customersize.pieces_per_pack}
          inputProps={{
            maxLength: 6,
            type: 'number',
            step: '.00001',
            min: 0,
          }}
        />

        <GridField
          size={3}
          className="px-1"
          id="pack_per_bundle"
          name="pack_per_bundle"
          margin="normal"
          label="Pack Per Bundle"
          onChange={(e: React.SyntheticEvent) => handleChangeWrapper(e)}
          value={customersize.pack_per_bundle}
          inputProps={{ maxLength: 6, type: 'number', step: '1', min: '0' }}
        />
        <TitleFragment
          size="h3"
          title="Dimensions and Weights"
          firstDivider={false}
        />

        <Grid
          container
          item
          justifyContent="space-evenly"
          direction="row"
          xs={16}
          className="py-0 my-0"
        >
          <GridField
            size={2}
            className="px-1"
            id="run_size"
            name="run_size"
            margin="normal"
            label="Run Size"
            inputProps={{ maxLength: 50 }}
            onChange={(e: React.SyntheticEvent) => handleChangeWrapper(e)}
            value={customersize.run_size}
          />

          <GridField
            size={2}
            className="px-1"
            id="length"
            name="length"
            margin="normal"
            label="Length"
            inputProps={{
              maxLength: 10,
              type: 'number',
              step: '.00001',
              min: 0,
            }}
            onChange={(e: React.SyntheticEvent) => handleChangeWrapper(e)}
            value={customersize.length}
          />

          <GridField
            size={2}
            className="px-1"
            id="run_weight"
            name="run_weight"
            margin="normal"
            label="Run Weight"
            inputProps={{
              maxLength: 10,
              type: 'number',
              step: '.00001',
              min: 0,
            }}
            onChange={(e: React.SyntheticEvent) => handleChangeWrapper(e)}
            value={customersize.run_weight}
          />

          <GridField
            size={2}
            className="px-1"
            id="pad_weight"
            name="pad_weight"
            margin="normal"
            label="Pad Weight"
            inputProps={{
              maxLength: 10,
              type: 'number',
              step: '.00001',
              min: 0,
            }}
            onChange={(e: React.SyntheticEvent) => handleChangeWrapper(e)}
            value={customersize.pad_weight}
          />
          <GridField
            size={2}
            className="px-1"
            id="avg_bale_weight"
            name="avg_bale_weight"
            margin="normal"
            label="Average Bale Weight"
            inputProps={{
              maxLength: 10,
              type: 'number',
              step: '.00001',
              min: 0,
            }}
            onChange={(e: React.SyntheticEvent) => handleChangeWrapper(e)}
            value={customersize.avg_bale_weight}
          />
          <GridField
            size={2}
            className="px-1"
            id="min_weight"
            name="min_weight"
            margin="normal"
            label="Min Weight"
            inputProps={{
              maxLength: 10,
              type: 'number',
              step: '.00001',
              min: 0,
            }}
            onChange={(e: React.SyntheticEvent) => handleChangeWrapper(e)}
            value={customersize.min_weight}
          />

          <GridField
            size={2}
            className="px-1"
            id="max_weight"
            name="max_weight"
            margin="normal"
            label="Max Weight"
            inputProps={{
              maxLength: 10,
              type: 'number',
              step: '.00001',
              min: 0,
            }}
            onChange={(e: React.SyntheticEvent) => handleChangeWrapper(e)}
            value={customersize.max_weight}
          />
        </Grid>

        <Grid
          container
          justifyContent="space-evenly"
          alignContent="flex-end"
          direction="row"
          spacing={1}
          className="py-0 ms-3 my-0"
        >
          <TitleFragment
            size="h3"
            title="Pricing and Cost"
            firstDivider={false}
          />
          <GridField
            size={0}
            className="px-1"
            id="price_date"
            name="price_date"
            margin="normal"
            label="Price Date"
            inputProps={{
              maxLength: 10,
              type: 'date',
              min: '1950-01-01',
              max: '2222-12-31',
            }}
            onChange={handleDateChange}
            value={customersize.price_date.toISOString().split('T')[0]}
          />

          <GridField
            size={0}
            className="px-1"
            error={priceError}
            id="price_per_pound"
            name="price_per_pound"
            margin="normal"
            label="Price Per Pound"
            inputProps={{
              maxLength: 10,
              type: 'number',
              step: '.0001',
              min: 0,
            }}
            onChange={(e: React.SyntheticEvent) => handleChangeWrapper(e)}
            value={customersize.price_per_pound}
          />
          <GridField
            size={0}
            className="px-1"
            error={priceError}
            id="price_per_piece"
            name="price_per_piece"
            margin="normal"
            label="Price Each"
            inputProps={{
              maxLength: 10,
              type: 'number',
              step: '.0001',
              min: 0,
            }}
            onChange={(e: React.SyntheticEvent) => handleChangeWrapper(e)}
            value={customersize.price_per_piece}
          />
          <GridField
            size={0}
            className="px-1"
            id="extra_cost"
            name="extra_cost"
            margin="normal"
            label="Extra Cost"
            inputProps={{
              maxLength: 10,
              type: 'number',
              step: '.01',
              min: 0,
            }}
            onChange={(e: React.SyntheticEvent) => handleChangeWrapper(e)}
            value={customersize.extra_cost}
          />
        </Grid>
        <TitleFragment
          size="h3"
          title="Equipment Settings"
          firstDivider={false}
        />
        <Grid
          container
          item
          justifyContent="center"
          direction="row"
          flexWrap="nowrap"
          xs={16}
          className="py-0 my-0"
        >
          <GridField
            size={5}
            className="px-1"
            id="floor_apron"
            name="floor_apron"
            margin="normal"
            label="Floor Apron"
            inputProps={{ maxLength: 50 }}
            onChange={(e: React.SyntheticEvent) => handleChangeWrapper(e)}
            value={customersize.floor_apron}
          />
          <GridField
            size={5}
            className="px-1"
            id="feed"
            name="feed"
            margin="normal"
            label="Feed"
            inputProps={{ maxLength: 50 }}
            onChange={(e: React.SyntheticEvent) => handleChangeWrapper(e)}
            value={customersize.feed}
          />
          <GridField
            size={5}
            className="px-1"
            id="stitcher"
            name="stitcher"
            margin="normal"
            label="Stitcher"
            inputProps={{ maxLength: 50 }}
            onChange={(e: React.SyntheticEvent) => handleChangeWrapper(e)}
            value={customersize.stitcher}
          />
        </Grid>

        <GridField
          size={16}
          multiline
          fullWidth
          className="px-1"
          id="equipment_spec_inst"
          name="equipment_spec_inst"
          margin="normal"
          label="Equipment Instructions"
          inputProps={{ maxLength: 1000 }}
          onChange={(e: React.SyntheticEvent) => handleChangeWrapper(e)}
          value={customersize.equipment_spec_inst}
          helperText="Press Enter to Add New Line"
        />
      </Grid>
      <FormButtons isUpdate={isUpdate} reducer={reducer} clear={ClearForm} />
    </Paper>
  );
};

export default CustomerSizeForm;
