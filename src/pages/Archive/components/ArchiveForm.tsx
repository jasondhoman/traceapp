import { Divider, Grid, Paper } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { ArchivedOrderFormData } from '../../../@types/tracetypes';
import { default_archived_order } from '../../../utils/constants';
import { formatShortDate } from '../../../utils/helpers';

import { useSnackbar } from 'notistack';
import { useParams } from 'react-router-dom';
import { StateContextType } from '../../../@types/statecontext';
import GridField from '../../../components/ui/GridField';
import TitleFragment from '../../../components/ui/TitleFragment';
import { StateContext } from '../../../context/StateContext';
import { SetPageState } from '../../../utils/reducers';

const ArchiveForm: React.FC<{
  id?: number;
  reducer: React.Dispatch<SetPageState>;
  prop_order?: ArchivedOrderFormData;
}> = ({ reducer, prop_order }) => {
  const { enqueueSnackbar } = useSnackbar();
  const { setViewing } = useContext(StateContext) as StateContextType;

  const { route_id } = useParams();
  const { setLoading, setStaticValue } = useContext(
    StateContext
  ) as StateContextType;

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
  const [order, setOrder] = useState<ArchivedOrderFormData>(
    default_archived_order
  );

  // update order
  useEffect(() => {
    if (prop_order) {
      setOrder({
        ...prop_order,
        order_date: new Date(prop_order.order_date),
        ship_date: prop_order.ship_date && new Date(prop_order.ship_date),
      });
    }
    setLoading(false);
  }, [prop_order, setLoading]);

  return (
    <Paper component="form" variant="outlined" className="p-3 w-100 my-0">
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
            title="Archived Order"
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
            value={orderDates.ship_date.value}
          />
        </Grid>

        <GridField
          size={4}
          id="tracking"
          name="tracking"
          label="Tracking Number"
          inputProps={{ maxLength: 50 }}
          value={order.tracking}
          fullWidth
          disabled={true}
          className="text-black"
        />

        <GridField
          size={4}
          id="purchase_order"
          name="purchase_order"
          label="Purchase Order"
          inputProps={{ maxLength: 50 }}
          value={order.purchase_order}
          fullWidth
        />
        <GridField
          size={4}
          id="bill_of_lading"
          name="bill_of_lading"
          label="Bill of Lading"
          inputProps={{ maxLength: 50 }}
          value={order.bill_ladening}
          fullWidth
        />
        <GridField
          size={4}
          id="invoice_number"
          name="invoice_number"
          label="Invoice Number"
          inputProps={{ maxLength: 50 }}
          value={order.invoice_number}
          fullWidth
        />
        <GridField
          size={16}
          id="company_name"
          name="company_name"
          label="Company Name"
          inputProps={{ maxLength: 50 }}
          value={order.company_name}
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
          <Grid container>
            <TitleFragment
              size="h3"
              title="Size Information"
              firstDivider={false}
            />
            <Grid
              container
              direction="row"
              justifyContent="space-center"
              className="ps-2 mx-auto"
              alignItems="center"
              columnSpacing={1}
              rowSpacing={1}
              columns={16}
            >
              <GridField
                size={3}
                id="grade"
                name="grade"
                margin="normal"
                label="Grade Mix"
                value={order.grade}
                disabled={true}
                fullWidth
              />
              <GridField
                size={3}
                id="tag_size"
                name="tag_size"
                margin="normal"
                label="Tag Size"
                value={order.tag_size}
                disabled={true}
                fullWidth
              />

              <GridField
                fullWidth
                size={2}
                id="qty"
                name="qty"
                margin="normal"
                label="QTY"
                value={order.qty}
                inputProps={{
                  maxLength: 10,
                  type: 'number',
                  step: '.00001',
                  min: 0,
                }}
              />

              <GridField
                size={2}
                id="pieces_per_pack"
                name="pieces_per_pack"
                margin="normal"
                label="PCS Per Pack"
                value={order.pieces_per_pack}
                inputProps={{
                  maxLength: 6,
                  type: 'number',
                  step: '.00001',
                  min: 0,
                }}
              />
              <GridField
                size={2}
                id="pack_per_bundle"
                name="pack_per_bundle"
                margin="normal"
                label="Pack Per Bun"
                value={order.pack_per_bundle}
                inputProps={{
                  maxLength: 6,
                  type: 'number',
                  step: '1',
                  min: '0',
                }}
              />
            </Grid>
          </Grid>
        </Grid>

        <Divider className="bg-dark" />
        <GridField
          size={8}
          fullWidth
          id="customer_grade_name"
          name="customer_grade_name"
          margin="normal"
          label="Customer Grade Name"
          value={order.customer_grade_name ?? ''}
          inputProps={{ maxLength: 1000 }}
          multiline
        />
        <GridField
          size={8}
          fullWidth
          id="customer_part_no"
          name="customer_part_no"
          margin="normal"
          label="Customer Part Number"
          value={order.customer_part_no ?? ''}
          inputProps={{ maxLength: 1000 }}
          multiline
        />
        <GridField
          size={16}
          fullWidth
          id="special_instructions"
          name="special_instructions"
          margin="normal"
          label="Special Instructions"
          value={order.special_size_instructions ?? ''}
          inputProps={{ maxLength: 1000 }}
          multiline
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
            value={order.run_size ?? ''}
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
            value={order.run_weight ?? 0}
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
            value={order.pad_weight ?? 0}
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
            value={order.avg_bale_weight ?? 0}
          />

          <GridField
            size={0}
            className="px-1"
            id="total_weight"
            name="total_weight"
            margin="normal"
            label="Total Weight"
            inputProps={{
              maxLength: 10,
              type: 'number',
              step: '.01',
              min: 0,
            }}
            value={order.total_weight ?? 0}
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
            value={order.price_date ? formatShortDate(order.price_date) : ''}
          />
          <GridField
            size={0}
            className="px-1"
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
            value={order.price_per_pound ?? 0}
          />
          <GridField
            size={0}
            className="px-1"
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
            value={order.price_per_piece ?? 0}
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
            value={order.extra_cost ?? 0}
          />
          <GridField
            size={0}
            className="px-1"
            id="total_cost"
            name="total_cost"
            margin="normal"
            label="Total Cost"
            inputProps={{
              maxLength: 10,
              type: 'number',
              step: '.01',
              min: 0,
            }}
            value={order.total_cost ?? 0}
          />
          {/* <GridField
            size={0}
            className="px-1"
            id="invoice_total"
            name="invoice_total"
            margin="normal"
            label="Invoice Total"
            inputProps={{
              maxLength: 10,
              type: 'text',
              step: '.01',
              min: 0,
            }}
            style={{ textAlign: 'right' }}
            value={formatAsCurrency(
              order.order_total ? order.order_total.toString() : ''
            )}
          /> */}
        </Grid>
      </Grid>
    </Paper>
  );
};

export default ArchiveForm;
