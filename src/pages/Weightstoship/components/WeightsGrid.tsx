import React, { ReactElement, useContext, useEffect, useState } from 'react';

import Grid from '@mui/material/Grid';
import { StateContextType } from '../../../@types/statecontext';
import GridField from '../../../components/ui/GridField';
import { StateContext } from '../../../context/StateContext';

interface IWeightGrid {
  qty: number;
  stateChange: (index: number, e: React.SyntheticEvent) => void;
  clear: () => void;
  weights: number[];
  min: number;
  max: number;
}

const WeightsGrid: React.FC<IWeightGrid> = ({
  qty,
  stateChange,
  clear,
  min,
  max,
  weights,
}) => {
  const [rows, setRows] = useState<ReactElement[]>();
  const { viewing } = useContext(StateContext) as StateContextType;

  useEffect(() => {
    const rs: ReactElement[] = [];
    let columns: ReactElement[] = [];
    weights.forEach((weight, index) => {
      columns.push(
        <Grid item xs={1.5} key={'s' + index}>
          <GridField
            size="auto"
            key={'t' + index}
            id={`weight_${index}`}
            margin="normal"
            label={(index + 1).toString()}
            value={weight ?? 0}
            onChange={(e) => stateChange(index, e)}
            inputProps={{
              maxLength: 10,
              type: 'number',
              step: '.00001',
              // min: min,
              // max: max,
              readOnly: viewing,
            }}
            variant={viewing ? 'filled' : 'outlined'}
            className="my-1 py-0"
          />
        </Grid>
      );
      if ((index + 1) % 10 === 0 || index + 1 === qty) {
        rs.push(
          <Grid
            container
            direction="row"
            justifyContent="space-evenly"
            alignItems="center"
            wrap="nowrap"
            style={{ paddingLeft: '1rem' }}
            columnSpacing={1}
            rowSpacing={0}
            columns={16}
            key={index}
          >
            {columns}
          </Grid>
        );

        columns = [];
      }
    });
    setRows(rs);
  }, [weights, qty, stateChange, viewing]);
  return (
    <Grid
      container
      direction="row"
      justifyContent="space-center"
      alignItems="center"
      columnSpacing={0}
      rowSpacing={0}
      columns={16}
    >
      {rows}
    </Grid>
  );
};

export default WeightsGrid;
