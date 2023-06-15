import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
  Paper,
} from '@mui/material';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { IOrderFormData, IOrdersForm } from '../../../@types/tracetypes';
import { default_line, default_order } from '../../../utils/constants';
import { formatShortDate, maskDate } from '../../../utils/helpers';
import {
  addOrder,
  getNextTrackingNumber,
  unshipOrder,
  updateOrder,
} from '../api/order';

import { AxiosResponse } from 'axios';
import { useSnackbar } from 'notistack';
import { useQueryClient } from 'react-query';
import validator from 'validator';
import { StateContextType } from '../../../@types/statecontext';
import CustomerSelect from '../../../components/form/CustomerSelect';
import SalespersonSelect from '../../../components/form/SalespersonSelect';
import FormButtons from '../../../components/ui/FormButtons';
import GridField from '../../../components/ui/GridField';
import TitleFragment from '../../../components/ui/TitleFragment';
import { StateContext } from '../../../context/StateContext';
import useQueryMutation from '../../../hooks/useQueryMutation';
import { ReducerActionType } from '../../../utils/reducers';
import { getCustomerShipping } from '../../Customer/api/customer';
import { getCustomerSize } from '../../Customersize/api/customersize';
import { useOrderContext } from '../context/OrderContext';
import LineItem from './LineItem';
import MultipleOrderForm from './MultipleOrderForm';

const OrdersForm: React.FC<IOrdersForm> = ({ reducer, prop_order }) => {
  const { enqueueSnackbar } = useSnackbar();
  const { setLoading, setStaticValue } = useContext(
    StateContext
  ) as StateContextType;

  const {
    customer_id,
    setCustomerID,
    lineCount,
    setLineCount,
    setFormOpen,
    lines,
    setLines,
    clearStates,
    isUpdate,
    setIsUpdate,
  } = useOrderContext();

  const [tracking, setTracking] = useState(0);
  const [orderDates, setOrderDates] = useState({
    order_date: {
      error: false,
      helperText: '',
      value:
        prop_order && prop_order.order_date
          ? formatShortDate(prop_order.order_date)
          : formatShortDate(new Date()),
    },
    ship_date: {
      error: false,
      helperText: '',
      value:
        prop_order && prop_order.ship_date
          ? formatShortDate(prop_order.ship_date)
          : '',
    },
  });
  const [order, setOrder] = useState<IOrderFormData>(default_order);

  const queryClient = useQueryClient();
  const [newOrder, setNewOrder] = useState(customer_id ? false : true);
  const [confirmUnship, setConfirmUnship] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const addOrderMutation = useQueryMutation({
    mutator: addOrder,
    method: 'POST',
    query: 'orders',
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

  const updateOrderMutation = useQueryMutation({
    mutator: updateOrder,
    method: 'PUT',
    query: 'orders',
  });

  const handleChange = (e: React.SyntheticEvent) => {
    const target = e.target as HTMLInputElement;
    let value = target.value;
    if (target.name === 'state') {
      value = value.toUpperCase();
    }
    setOrder((prev) => ({ ...prev, [target.name]: value }));
  };

  const submitForm = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (prop_order?.shipped) {
        throw new Error('Order is shipped and can not be updated');
      }
      if (orderDates.order_date.error || orderDates.ship_date.error) {
        throw new Error('Please correct Date errors in the form');
      }
      if (order.grade_mix_id === 0 && isUpdate) {
        const res = await getCustomerSize(order.grade_id);
        if (res.data) {
          order.grade_mix_id = res.data.grade_mix_id;
          lines[0].grade_mix_id = res.data.grade_mix_id;
        }
      }
      const data = {
        ...order,
        customer_id: parseFloat(order.customer_id.toString()),
        stock: parseFloat(order.stock ? order.stock!.toString() : '0'),
        pieces_per_pack: parseFloat(order.pieces_per_pack!.toString()),
        pack_per_bundle: parseFloat(order.pack_per_bundle!.toString()),
        qty: parseFloat(order.qty!.toString()),
        tracking: parseFloat(order.tracking.toString()),
        order_id: isUpdate ? prop_order?.id : null,
        order_date: orderDates.order_date.value,
        ship_date: orderDates.ship_date.value,
      };

      if (isUpdate) {
        const update = { ...data, ...lines[0] };
        updateOrderMutation.mutate(update);
      } else {
        const payload = {
          orders: lines
            .filter((line) => line.grade_id > 0 && line.tag_size !== undefined)
            .map((line) => {
              return {
                ...data,
                ...line,
                tracking: line.tracking,
              };
            }),
        };

        if (payload.orders.length === 0) {
          throw new Error('Please add at least one line item');
        }
        addOrderMutation.mutate(payload, {
          onSuccess: () => {
            clearStates();
            clearForm();
            setIsUpdate(true);
          },
        });
      }
      setLines(lines);
      queryClient.setQueryData('order', { ...order });
    } catch (error) {
      enqueueSnackbar(`${error}`, { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const clearForm = () => {
    setOrder({ ...default_order, tracking: order.tracking });
    setCustomerID(0);
    clearStates();
    setLineCount(1);
  };

  const handleCustomerSelect = async (id: number) => {
    setCustomerID(0);
    if (!id) return;
    const hold_tracking = order.tracking;

    const res = await getCustomerShipping(id);

    if (res.data) {
      setCustomerID(id);
      queryClient.removeQueries('size_select');
      setStaticValue('customer_id', id, setOrder);
      setOrder(() => ({
        ...default_order,
        ...res.data,
        customer_id: id,
        ship_date: order.ship_date,
        order_date: order.order_date,
        purchase_order: order.purchase_order,
        transport: res.data?.transport ?? '',
        tracking: hold_tracking,
      }));
    }
  };

  const handleDateChange = (e: React.SyntheticEvent) => {
    const target = e.target as HTMLInputElement;
    const newOrderDate = orderDates;

    if (target.name === 'order_date') {
      newOrderDate.order_date.value = maskDate(target.value);
      if (newOrderDate.order_date.value !== '') {
        newOrderDate.order_date.error = !validator.isDate(target.value, {
          format: 'MM-DD-YYYY',
        });
      } else {
        newOrderDate.order_date.error = false;
      }
    }
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

  const handleUnshipOrder = async () => {
    try {
      if (!prop_order?.id) {
        return;
      }
      const res = await unshipOrder(prop_order?.id);
      if (res.status === 200) {
        enqueueSnackbar(`Order ${prop_order?.tracking} Unshipped`, {
          variant: 'success',
        });
        queryClient.invalidateQueries('orders');
        setConfirmUnship(false);
      }
      prop_order.shipped = false;
    } catch (error) {
      enqueueSnackbar(`Error Unshipping Order ${prop_order?.tracking}`, {
        variant: 'error',
      });
    } finally {
      setConfirmUnship(false);
    }
  };

  const setupLines = useCallback(() => {
    if (prop_order) {
      setLines([
        {
          tracking: prop_order.tracking,
          grade_id: prop_order.grade_id,
          grade_mix_id: prop_order.grade_mix_id ?? 0,
          grade: prop_order.grade ?? '',
          tag_size: prop_order.tag_size,
          qty: prop_order.qty,
          stock: prop_order.stock,
          pieces_per_pack: prop_order.pieces_per_pack,
          pack_per_bundle: prop_order.pack_per_bundle,
          run_weight: prop_order.run_weight,
        },
      ]);
    }
  }, [prop_order, setLines]);

  // new order
  useEffect(() => {
    const getTracking = async () => {
      const res = await getNextTrackingNumber();
      if (res) {
        setTracking(res.tracking);
      }
    };
    getTracking();
    if (newOrder) {
      setLines([default_line]);
      setNewOrder(false);
      clearStates();
      setCustomerID(0);
    }
  }, [clearStates, newOrder, setCustomerID, setLines]);

  // update order
  useEffect(() => {
    if (prop_order) {
      setIsUpdate(true);
      setOrder({
        ...prop_order,
        order_date: new Date(prop_order.order_date),
        ship_date: prop_order.ship_date && new Date(prop_order.ship_date),
      });

      setCustomerID(prop_order.customer_id);
      setupLines();
    } else {
      setCustomerID(0);
      setLineCount(1);
    }
    setLoading(false);
  }, [
    prop_order,
    setCustomerID,
    setIsUpdate,
    setLineCount,
    setLoading,
    setupLines,
  ]);

  //line count change and duplicate last line
  useEffect(() => {
    if (!prop_order) {
      if (lineCount > lines.length) {
        const newLines = [...lines];
        const dupedLine = { ...newLines[newLines.length - 1] };
        for (let i = lines.length; i < lineCount; i++) {
          newLines.push({ ...default_line, ...dupedLine });
        }
        setLines(newLines);
      } else if (lineCount < lines.length) {
        const newLines = [...lines];
        newLines.splice(lineCount, lines.length - lineCount);
        setLines(newLines);
      }
    }
  }, [lineCount, lines, setLines, prop_order]);

  return (
    <Paper
      component="form"
      variant="outlined"
      onSubmit={submitForm}
      className="p-3 w-100 my-0"
    >
      <Grid
        container
        direction="row"
        justifyContent="space-center"
        className="my-0"
        alignItems="center"
        columnSpacing={2}
        rowSpacing={1}
        columns={16}
      >
        <Grid item xs={16}>
          <TitleFragment
            size="h3"
            title={`Order Form${prop_order?.shipped ? ' - Shipped' : ''}`}
            firstDivider={false}
          />
        </Grid>

        <Grid
          container
          direction="row"
          justifyContent="flex-start"
          alignItems="center"
          flexWrap="nowrap"
          className="px-2 mx-1 my-1"
        >
          <GridField
            size="auto"
            error={orderDates.order_date.error}
            helperText={
              orderDates.order_date.error ? 'Enter a valid date' : ' '
            }
            placeholder="MM-DD-YYYY"
            className="px-1 my-0"
            id="order_date"
            name="order_date"
            margin="normal"
            label="Order Date"
            inputProps={{
              maxLength: 10,
            }}
            onChange={handleDateChange}
            value={orderDates.order_date.value}
          />

          <GridField
            error={orderDates.ship_date.error}
            helperText={orderDates.ship_date.error ? 'Enter a valid date' : ' '}
            placeholder="MM-DD-YYYY"
            size="auto"
            className="px-2 my-0"
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
          {!isUpdate && (
            <Grid
              container
              direction="row"
              justifyContent="flex-end"
              alignItems="center"
              className="px-2 mx-1 my-1"
              style={{ width: '65%' }}
            >
              <GridField
                size="auto"
                id="tracking"
                name="tracking"
                label="Tracking"
                component={
                  <Button
                    variant="contained"
                    type="button"
                    className="mx-1"
                    onClick={() => setFormOpen(true)}
                    style={{ boxShadow: 'none' }}
                    disabled={customer_id === 0}
                  >
                    Duplicate Order
                  </Button>
                }
              />
            </Grid>
          )}
          {prop_order?.shipped && (
            <Grid
              container
              direction="row"
              justifyContent="flex-end"
              alignItems="center"
              className="px-2 mx-1 my-1"
              style={{ width: '65%' }}
            >
              <GridField
                size="auto"
                id="tracking"
                name="tracking"
                label="Tracking"
                component={
                  <Button
                    variant="contained"
                    type="button"
                    className="mx-1"
                    onClick={() => setConfirmUnship(true)}
                    style={{ boxShadow: 'none' }}
                    disabled={customer_id === 0}
                  >
                    Unship Order
                  </Button>
                }
              />
            </Grid>
          )}
        </Grid>

        <GridField
          size={4}
          id="purchase_order"
          name="purchase_order"
          label="Purchase Order"
          inputProps={{ maxLength: 50 }}
          onChange={handleChange}
          value={order.purchase_order}
          fullWidth
        />
        <CustomerSelect
          id={customer_id}
          changeState={handleCustomerSelect}
          size={16}
        />
        <GridField
          size={8}
          id="name"
          name="name"
          label="Name"
          inputProps={{ maxLength: 40 }}
          onChange={handleChange}
          value={order.name}
          fullWidth
        />
        <GridField
          size={8}
          id="address1"
          name="address1"
          label="Address"
          inputProps={{ maxLength: 40 }}
          onChange={handleChange}
          value={order.address1}
          fullWidth
        />
        <GridField
          size={8}
          id="address2"
          name="address2"
          label="Address"
          inputProps={{ maxLength: 40 }}
          onChange={handleChange}
          value={order.address2}
          fullWidth
        />
        <GridField
          size={3}
          id="city"
          name="city"
          label="City"
          inputProps={{ maxLength: 40 }}
          onChange={handleChange}
          value={order.city}
          fullWidth
        />
        <GridField
          size={2}
          id="state"
          name="state"
          label="State"
          inputProps={{ maxLength: 2, uppercase: 'true' }}
          onChange={handleChange}
          value={order.state}
          fullWidth
        />

        <GridField
          size={3}
          id="zip"
          name="zip"
          label="Zip"
          inputProps={{ maxLength: 10 }}
          onChange={handleChange}
          value={order.zip}
          fullWidth
        />
        <SalespersonSelect
          state={order.salesperson}
          name="salesperson"
          changeState={(id) => {
            setStaticValue(id.toString() ?? '', 'salesperson', setOrder);
          }}
          size={8}
        />
        <GridField
          size={8}
          id="transport"
          name="transport"
          label="Transportation"
          inputProps={{ maxLength: 30 }}
          onChange={handleChange}
          value={order.transport}
          fullWidth
        />
        <Grid
          container
          direction="row"
          justifyContent="space-center"
          className="ms-0 pt-2"
          alignItems="center"
          columnSpacing={1}
          rowSpacing={1}
          columns={16}
        >
          {lines.map((line, index) => (
            <LineItem
              key={index}
              index={index}
              lineitem={{
                tracking: isUpdate ? line.tracking : tracking + index,
                grade_id: line.grade_id,
                grade_mix_id: line.grade_mix_id,
                grade: line.grade,
                tag_size: line.tag_size,
                qty: line.qty,
                stock: line.stock,
                pieces_per_pack: line.pieces_per_pack,
                pack_per_bundle: line.pack_per_bundle,
              }}
            />
          ))}
        </Grid>
        <FormButtons
          isUpdate={isUpdate}
          reducer={reducer}
          clear={clearForm}
          cancelEditClean={() => clearStates()}
          disableSubmit={prop_order?.shipped ?? false}
        />
        <MultipleOrderForm />
        <Dialog
          open={confirmUnship}
          onClose={() => setConfirmUnship(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {`Unship Select Order`}
            <Divider className="bg-dark" />
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              This action will clear the invoicing and bill of ladening for
              tracking number {prop_order?.tracking}. After performing this you
              will need to rerun invoicing to ship the order. Are you sure you
              want?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmUnship(false)} variant="outlined">
              Cancel
            </Button>
            <Button
              onClick={() => handleUnshipOrder()}
              variant="contained"
              style={{ boxShadow: 'none' }}
            >
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </Grid>
    </Paper>
  );
};

export default OrdersForm;
