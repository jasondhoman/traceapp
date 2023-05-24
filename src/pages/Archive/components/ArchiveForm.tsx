import { Divider, Grid, Paper } from '@mui/material';
import React from 'react';
import { IOrdersForm } from '../../../@types/tracetypes';

import FormButtons from '../../../components/ui/FormButtons';
import GridField from '../../../components/ui/GridField';
import TitleFragment from '../../../components/ui/TitleFragment';
import { default_order } from '../../../utils/constants';
import { formatShortDate } from '../../../utils/helpers';

const ArchiveForm: React.FC<IOrdersForm> = ({ reducer, prop_order }) => {
  const [order] = React.useState(prop_order ?? default_order);

  return (
    <Paper
      component="form"
      variant="outlined"
      onSubmit={() => {
        return;
      }}
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
          <TitleFragment size="h3" title="Order Form" firstDivider={false} />
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
            placeholder="MM-DD-YYYY"
            className="px-1 my-0"
            id="order_date"
            name="order_date"
            margin="normal"
            label="Order Date"
            inputProps={{
              maxLength: 10,
            }}
            // onChange={handleDateChange}
            value={formatShortDate(order.order_date ?? '')}
          />

          <GridField
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
            value={formatShortDate(order.ship_date ?? '')}
          />
        </Grid>
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
          size={8}
          id="company_name"
          name="company_name"
          label="Company Name"
          inputProps={{ maxLength: 40 }}
          value={order.company_name}
          fullWidth
        />
        <GridField
          size={8}
          id="name"
          name="name"
          label="Name"
          inputProps={{ maxLength: 40 }}
          value={order.name}
          fullWidth
        />
        <GridField
          size={8}
          id="address1"
          name="address1"
          label="Address"
          inputProps={{ maxLength: 40 }}
          value={order.address1}
          fullWidth
        />
        <GridField
          size={8}
          id="address2"
          name="address2"
          label="Address"
          inputProps={{ maxLength: 40 }}
          value={order.address2}
          fullWidth
        />
        <GridField
          size={3}
          id="city"
          name="city"
          label="City"
          inputProps={{ maxLength: 40 }}
          value={order.city}
          fullWidth
        />
        <GridField
          size={2}
          id="state"
          name="state"
          label="State"
          inputProps={{ maxLength: 2, uppercase: 'true' }}
          value={order.state}
          fullWidth
        />
        <GridField
          size={3}
          id="zip"
          name="zip"
          label="Zip"
          inputProps={{ maxLength: 10 }}
          value={order.zip}
          fullWidth
        />
        <GridField
          size={8}
          id="transport"
          name="transport"
          label="Transportation"
          inputProps={{ maxLength: 30 }}
          value={order.transport}
          fullWidth
        />
        <GridField
          size={8}
          id="salesperson"
          name="salesperson"
          label="Salesperson"
          inputProps={{ maxLength: 30 }}
          value={order.salesperson}
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
            <Grid item xs={16} className="ms-3 py-1 mb-1">
              <Divider className="bg-dark" />
            </Grid>
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
                size={2}
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
                id="tag"
                name="tag"
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
                fullWidth
                size={2}
                id="stock"
                name="stock"
                margin="normal"
                label="Stock"
                value={order.stock}
                inputProps={{
                  maxLength: 10,
                  type: 'number',
                  step: '.00001',
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

        <FormButtons
          isUpdate={true}
          reducer={reducer}
          hideEdit={true}
          clear={() => {
            return;
          }}
        />
      </Grid>
    </Paper>
  );
};

export default ArchiveForm;
