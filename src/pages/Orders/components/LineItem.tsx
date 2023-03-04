import { Divider, Grid } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { ILineItem, OrderContextType } from '../@types/OrderTypes';

import { StateContextType } from '../../../@types/statecontext';
import { ICustomerSize } from '../../../@types/tracetypes';
import CustomerSizeSelect from '../../../components/form/CustomerSizeSelect';
import CustomerTagSelect from '../../../components/form/CustomerTagSelect';
import GridField from '../../../components/ui/GridField';
import { StateContext } from '../../../context/StateContext';
import { getCustomerSize } from '../../Customersize/api/customersize';
import { OrderContext } from '../context/OrderContext';

const LineItem: React.FC<{
  index: number;
  lineitem: ILineItem;
}> = ({ index, lineitem }) => {
  const { setLoading } = useContext(StateContext) as StateContextType;

  const {
    customer_id,
    lines,
    // setLines,
    updateLine,
    setTrackingForLine,
    setGradeForLine,
  } = useContext(OrderContext) as OrderContextType;

  const [selectedGrade, setSelectedGrade] = useState(lineitem.grade);

  const handleChange = (e: React.SyntheticEvent) => {
    const { name, value } = e.target as HTMLInputElement;

    let updatedLine = lines[index];
    if (['qty', 'pieces_per_pack', 'pack_per_bundle', 'stock'].includes(name)) {
      const test = Number(value ?? 0);
      if (isNaN(test)) {
        updatedLine = {
          ...updatedLine,
          [name]: 0,
        };
        return;
      }
      updatedLine = {
        ...updatedLine,
        [name]: Number(value ?? 0),
      };
    } else {
      updatedLine = {
        ...updatedLine,
        [name]: value,
      };
    }
    updateLine(updatedLine, index);
  };

  const handleSizeSelect = async (id: number) => {
    setLoading(true);

    const res = await getCustomerSize(id);
    if (res.data) {
      const customersize: ICustomerSize = res.data;
      const updatedLine = {
        ...lineitem,
        grade_id: customersize.id,
        tag_size: customersize.tag_size,
        pieces_per_pack: customersize.pieces_per_pack,
        pack_per_bundle: customersize.pack_per_bundle,
        stock: customersize.stock,
        grade: customersize.grade,
        run_weight: customersize.run_weight,
        grade_mix_id: customersize.grade_mix_id,
      };
      updateLine(updatedLine, index);
    }
    setLoading(false);
  };

  const handleGradeSelect = async (id: string) => {
    setLoading(true);
    setSelectedGrade(() => id);
    setGradeForLine(id, index);

    updateLine(
      {
        ...lineitem,
        grade_id: 0,
        tag_size: '',
        grade: id,
        qty: 0,
        pieces_per_pack: 0,
        pack_per_bundle: 0,
        stock: 0,
        run_weight: 0,
        grade_mix_id: 0,
      },
      index
    );

    setLoading(false);
  };

  useEffect(() => {
    setTrackingForLine(lineitem.tracking, index);
  }, []);

  return (
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
          value={lineitem.tracking}
          fullWidth
          disabled={true}
          className="text-black"
        />
        {customer_id ? (
          <CustomerSizeSelect
            state={lineitem.grade}
            changeState={handleGradeSelect}
            size={3}
            customer_id={customer_id}
          />
        ) : (
          <GridField
            size={3}
            id="grade"
            name="grade"
            margin="normal"
            label="Grade Mix"
            value={''}
            disabled={true}
            fullWidth
          />
        )}
        <CustomerTagSelect
          state={lineitem.tag_size}
          changeState={handleSizeSelect}
          grade={selectedGrade}
          size={3}
          customer_id={customer_id}
        />
        <GridField
          fullWidth
          size={2}
          id="qty"
          name="qty"
          margin="normal"
          label="QTY"
          onChange={handleChange}
          value={lineitem.qty}
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
          onChange={handleChange}
          value={lineitem.stock}
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
          onChange={handleChange}
          value={lineitem.pieces_per_pack}
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
          onChange={handleChange}
          value={lineitem.pack_per_bundle}
          inputProps={{ maxLength: 6, type: 'number', step: '1', min: '0' }}
        />
      </Grid>
    </Grid>
  );
};

export default LineItem;
