import { createFilterOptions, FormControl, Grid, Paper } from '@mui/material';
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { AuthContextType } from '../../../@types/authcontext';
import { StateContextType } from '../../../@types/statecontext';
import { IProductionInformationForm } from '../../../@types/tracetypes';
import YesNoSelect from '../../../components/form/YesNoSelect';
import FormButtons from '../../../components/ui/FormButtons';
import GridField from '../../../components/ui/GridField';
import TitleFragment from '../../../components/ui/TitleFragment';
import { AuthContext } from '../../../context/AuthContext';
import { StateContext } from '../../../context/StateContext';
import { default_prod_info } from '../../../utils/constants';
import { formatShortDate, maskDate, roundNumber } from '../../../utils/helpers';
import {
  getIdFromTrackingNumber,
  getOrderTrackingIds,
  updateProductionInfo,
} from '../api/order';
// import { useQueryClient } from "react-query";
import { useSnackbar } from 'notistack';
import validator from 'validator';
import AutocompleteFragment from '../../../components/form/AutocompleteFragment';
import useQueryMutation from '../../../hooks/useQueryMutation';

interface ITrackingIDs {
  label: string;
  id: number;
  tracking_id: number;
}

const ProductionInformationForm: React.FC<IProductionInformationForm> = ({
  reducer,
  prop_order,
  getOrder,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useContext(AuthContext) as AuthContextType;
  const { viewing, setLoading, handleChange, setStaticValue } = useContext(
    StateContext
  ) as StateContextType;
  const [productiondata, setProductionData] = useState(default_prod_info);
  const [isUpdate, setIsUpdate] = useState(true);
  const [orderDates, setOrderDates] = useState({
    ship_date: {
      error: false,
      helperText: '',
      value: '',
    },
  });
  const [selected_tracking, setSelected] = useState<number>(
    prop_order?.tracking || 0
  );
  const [trackingids, setTrackingIds] = useState<ITrackingIDs[]>([]);
  const filterOptions = createFilterOptions({
    matchFrom: 'start',
    stringify: (option: ITrackingIDs) => option.label,
  });

  const getTrackingids = useCallback(async () => {
    setLoading(true);
    const data = await getOrderTrackingIds();

    if (data) {
      data.unshift({
        label: '',
        id: 0,
        tracking_id: 0,
      });
      setTrackingIds(data);
      setSelected(data[0].label);
    }
    setLoading(false);
  }, [setLoading]);

  const updateProdInfoMutation = useQueryMutation({
    mutator: updateProductionInfo,
    method: 'PUT',
    query: 'orders',
  });

  const handleChangeWrapper = (e: React.SyntheticEvent) => {
    handleChange(e, setProductionData);
  };

  const handleChangeNum = (e: React.SyntheticEvent) => {
    const { name, value } = e.target as HTMLInputElement;
    try {
      setProductionData((prev) => ({
        ...prev,
        [name]: Number(value),
      }));
    } catch (err) {
      enqueueSnackbar('Please enter a number', { variant: 'error' });
    }
  };

  const handleDateChange = (e: React.SyntheticEvent) => {
    const target = e.target as HTMLInputElement;
    const newOrderDate = orderDates;

    if (target.name === 'ship_date') {
      newOrderDate.ship_date.value = maskDate(target.value);
      if (newOrderDate.ship_date.value !== '') {
        newOrderDate.ship_date.error = !validator.isDate(target.value, {
          format: 'MM-DD-YYYY',
        });
      } else {
        newOrderDate.ship_date.error = false;
      }
    }
    setOrderDates((prev) => ({ ...prev, ...newOrderDate }));
  };

  const submitForm = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (orderDates.ship_date.error) {
        throw new Error('Please correct Date errors in the form');
      }
      const data = {
        ...productiondata,
        order_id: prop_order?.id,
        user_id: user?.id,
        production_line:
          productiondata.line && productiondata.line.toUpperCase(),
        ship_date: orderDates.ship_date.value,
        tracking: selected_tracking,
      };
      if (!data.production_line || !productiondata.line) {
        if (productiondata.linter_report === 'Y') {
          throw new Error('Please select a production line');
        }
      }

      updateProdInfoMutation.mutate(data);
    } catch (err) {
      enqueueSnackbar(`${err}`, { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const ClearForm = () => {
    setProductionData(default_prod_info);
  };

  useMemo(() => {
    let total = productiondata.weight * productiondata.price_per_pound;
    let total_weight = productiondata.qty;
    total_weight *= Number(productiondata?.pieces_per_pack);
    total_weight *= productiondata?.pack_per_bundle;
    total_weight *= Number(productiondata?.run_weight);

    if (productiondata.weight === 0) {
      if (productiondata.price_per_piece > 0) {
        total =
          productiondata.pieces_per_pack *
          productiondata.qty *
          productiondata.pack_per_bundle *
          productiondata.price_per_piece;
      }
      if (productiondata.price_per_pound > 0) {
        total = productiondata.total_weight * productiondata.price_per_pound;
      }
    }
    if (
      productiondata?.use_weight_for_total ||
      productiondata?.price_per_piece === 0
    ) {
      total_weight = productiondata.weight;
    }

    setProductionData((prev) => {
      return {
        ...prev,
        total_weight: total_weight,
        total_cost: roundNumber(total),
      };
    });
  }, [
    productiondata.weight,
    productiondata.price_per_pound,
    productiondata.qty,
    productiondata.pieces_per_pack,
    productiondata.pack_per_bundle,
    productiondata?.run_weight,
    productiondata?.use_weight_for_total,
    productiondata.price_per_piece,
    productiondata.total_weight,
  ]);

  const handleTrackingChange = async (id: number) => {
    setSelected(id);
    const orderID = await getIdFromTrackingNumber(id);
    if (orderID) {
      await getOrder(orderID.id);
    }
  };

  useEffect(() => {
    if (prop_order) {
      setIsUpdate(true);
      setProductionData({
        ...prop_order,
        ship_date: prop_order.ship_date ?? '',
      });
      if (prop_order.ship_date) {
        setOrderDates((prev) => ({
          ...prev,
          ship_date: {
            ...prev.ship_date,
            value: formatShortDate(new Date(prop_order.ship_date)),
          },
        }));
      }
    }
  }, [prop_order]);

  useEffect(() => {
    getTrackingids().then(() => {
      if (prop_order) {
        setSelected(prop_order.tracking);
      }
    });
  }, [getTrackingids, prop_order]);

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
        <Grid item xs={16}>
          <TitleFragment
            size="h3"
            title="Production Data"
            firstDivider={false}
          />
        </Grid>
        <Grid
          container
          direction="row"
          className="ms-2"
          justifyContent="flex-start"
          alignItems="flex-end"
          spacing={1}
        >
          <GridField
            error={orderDates.ship_date.error}
            helperText={orderDates.ship_date.error ? 'Enter a valid date' : ' '}
            size="auto"
            id="ship_date"
            name="ship_date"
            margin="normal"
            label=" Shipping Date"
            inputProps={{
              maxLength: 10,
            }}
            onChange={handleDateChange}
            value={orderDates.ship_date.value}
          />
          {/* <GridField
            size={0}
            id="shipping_date"
            name="ship_date"
            margin="normal"
            label="Shipping Date"
            inputProps={{ maxLength: 10, type: "text" }}
            value={
              productiondata.ship_date
              // productiondata.ship_date ? GetDate(productiondata.ship_date) : ""
            }
            disabled={true}
          /> */}
          <Grid item xs={4} style={{ marginBottom: '.45rem' }}>
            <AutocompleteFragment
              id="tracking-id-select"
              label="Tracking Number"
              state={selected_tracking}
              viewingText={selected_tracking.toString()}
              changeState={handleTrackingChange}
              selectOptions={trackingids}
              filterOptions={filterOptions}
              isOptionEqualToValue={(option: any, value: any) => {
                if (!value) {
                  return true;
                }
                return option.id === Number(value);
              }}
            />
            <FormControl variant="outlined" className="ps-2"></FormControl>
          </Grid>

          <GridField
            size={0}
            id="purchase_order"
            name="purchase_order"
            label="Purchase Order"
            helperText=" "
            inputProps={{ maxLength: 50, readOnly: true }}
            value={productiondata.purchase_order}
            fullWidth
            disabled={true}
          />
        </Grid>
        <Grid
          container
          style={{ paddingLeft: '1rem' }}
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        ></Grid>
        <Grid
          container
          direction="row"
          justifyContent="space-between"
          style={{ paddingLeft: '1rem' }}
          alignItems="flex-end"
        >
          <GridField
            size={6}
            id="company_name"
            name="company_name"
            label="Name"
            inputProps={{ maxLength: 40 }}
            value={productiondata.company_name}
            fullWidth
            disabled={true}
          />
          <GridField
            size={1.5}
            id="production_line"
            name="line"
            className="w-10"
            margin="normal"
            label="Line"
            onChange={handleChangeWrapper}
            value={productiondata.line ? productiondata.line.toUpperCase() : ''}
            inputProps={{ maxLength: 1 }}
            disabled={viewing}
          />
          <Grid item xs={4}>
            <YesNoSelect
              state={productiondata.linter_report}
              changeState={(e) => {
                setStaticValue(
                  'linter_report',
                  e.target.value,
                  setProductionData
                );
              }}
              label="Linter Report"
              size={6}
              id="linter_report"
              name="linter_report"
            />
          </Grid>
        </Grid>

        <GridField
          size={4}
          id="grade"
          name="grade"
          margin="normal"
          label="Grade"
          value={productiondata.grade}
          inputProps={{ maxLength: 150, readOnly: true }}
          fullWidth
        />
        <GridField
          size={4}
          fullWidth
          id="tagsize"
          name="tagsize"
          margin="normal"
          label="Tag Size"
          value={productiondata.tag_size}
          inputProps={{ maxLength: 150, readOnly: true }}
          disabled={true}
        />
        <Grid item xs={16}>
          <TitleFragment size="h3" title="" firstDivider={false} />
        </Grid>
        <Grid
          container
          direction="row"
          justifyContent="space-evenly"
          alignItems="flex-end"
        >
          <GridField
            fullWidth
            size={2}
            id="qty"
            name="qty"
            margin="normal"
            label="QTY"
            onChange={handleChangeNum}
            value={productiondata.qty}
            inputProps={{
              maxLength: 10,
              type: 'number',
              step: '.00001',
              min: 0,
            }}
          />
          <GridField
            size={2}
            className="px-1"
            id="pieces_per_pack"
            name="pieces_per_pack"
            margin="normal"
            label="Pieces Per Pack"
            onChange={handleChangeNum}
            value={productiondata.pieces_per_pack}
            inputProps={{
              maxLength: 6,
              type: 'number',
              step: '.00001',
              min: 0,
            }}
          />

          <GridField
            size={2}
            className="px-1"
            id="pack_per_bundle"
            name="pack_per_bundle"
            margin="normal"
            label="Pack Per Bundle"
            onChange={handleChangeNum}
            value={productiondata.pack_per_bundle}
            inputProps={{ maxLength: 6, type: 'number', step: '1', min: '0' }}
          />
          <GridField
            fullWidth
            size={2}
            id="price_each"
            name="price_each"
            margin="normal"
            label="Price Each"
            onChange={handleChangeNum}
            value={productiondata.price_per_piece}
            inputProps={{
              maxLength: 10,
              type: 'number',
              step: '.00001',
              min: 0,
            }}
          />
        </Grid>

        <Grid
          container
          direction="row"
          justifyContent="space-evenly"
          alignItems="flex-end"
        >
          <GridField
            fullWidth
            size={2}
            id="run_weight"
            name="run_weight"
            margin="normal"
            label="Run Weight"
            onChange={handleChangeNum}
            value={productiondata.run_weight}
            inputProps={{
              maxLength: 10,
              type: 'number',
              step: '.00001',
              min: 0,
            }}
          />
          <GridField
            size={2}
            className="px-1"
            id="weight"
            name="weight"
            margin="normal"
            label="Weight"
            onChange={handleChangeNum}
            value={productiondata.weight}
            inputProps={{
              maxLength: 6,
              type: 'number',
              step: '.00001',
              min: 0,
            }}
          />

          <GridField
            fullWidth
            size={2}
            id="price_per_pound"
            name="price_per_pound"
            margin="normal"
            label="Price Per Pound"
            onChange={handleChangeNum}
            value={productiondata.price_per_pound}
            inputProps={{
              maxLength: 10,
              type: 'number',
              step: '.00001',
              min: 0,
            }}
          />
        </Grid>
        <Grid
          container
          direction="row"
          justifyContent="space-evenly"
          alignItems="flex-end"
          className="mb-3"
        >
          <GridField
            size={2}
            className="px-1 input-right"
            id="total_cost"
            name="total_cost"
            margin="normal"
            label="Total Cost"
            style={{ textAlign: 'right' }}
            onChange={() => {
              // do nothing
            }}
            value={productiondata.total_cost.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
            disabled={true}
            // inputProps={{
            //   maxLength: 10,
            //   type: "number",
            //   step: ".001",
            //   min: 0,
            // }}
          />
          <GridField
            fullWidth
            size={2}
            className="input-right"
            id="total_weight"
            name="total_weight"
            margin="normal"
            label="Total Pounds"
            onChange={() => {
              // do nothing
            }}
            value={productiondata.total_weight.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
            disabled={true}
            inputProps={{
              maxLength: 10,
              type: 'numeric',
              step: '.00001',
              min: 0,
            }}
          />
        </Grid>
      </Grid>
      <FormButtons isUpdate={isUpdate} reducer={reducer} clear={ClearForm} />
    </Paper>
  );
};

export default ProductionInformationForm;
