import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
} from '@mui/material';
import React, { useEffect } from 'react';

import { useSnackbar } from 'notistack';
import GridField from '../../../components/ui/GridField';
import { default_line } from '../../../utils/Constants';
import { ILineItem } from '../@types/OrderTypes';
import { useOrderContext } from '../context/OrderContext';

const MultipleOrderForm = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { formOpen, lineCount, setLineCount, setFormOpen, lines, setLines } =
    useOrderContext();

  const [localLineCount, setLocLineCount] = React.useState(lineCount ?? 1);

  const handleChange = (e: React.SyntheticEvent) => {
    const { value } = e.target as HTMLInputElement;
    try {
      const count = parseInt(value);
      if (count > 99) {
        setLocLineCount(99);
      } else if (count < 1 || Number.isNaN(count)) {
        setLocLineCount(0);
      } else {
        setLocLineCount(count);
      }
    } catch (error) {
      setLocLineCount(1);
      enqueueSnackbar('Invalid number of orders', { variant: 'error' });
    }
  };

  const handleSumbit = () => {
    setLineCount(localLineCount > 0 ? localLineCount : 1);
    const line_def: ILineItem[] = [];
    let copyLine = default_line;
    if (lines.length > 0) {
      copyLine = {
        ...lines[0],
        qty: lines[0].qty ?? 0,
        stock: lines[0].stock ?? 0,
        pieces_per_pack: lines[0].pieces_per_pack ?? 0,
        pack_per_bundle: lines[0].pack_per_bundle ?? 0,
        special_instructions: lines[0].special_instructions ?? '',
        tag_size: lines[0].tag_size ?? '',
      };
    }
    for (let i = 0; i < lineCount; i++) {
      if (lines[i]) {
        line_def.push(lines[i]);
      } else {
        line_def.push(copyLine);
      }
    }
    setLines(lines);
    setFormOpen(false);
  };

  useEffect(() => {
    setLocLineCount(lineCount ?? 1);
  }, [lineCount]);

  return (
    <Dialog
      open={formOpen}
      onClose={() => 1 + 1}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        Generate Multipe Orders
        <Divider className="bg-dark" />
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          This will generate multiple orders, enter the amount of orders.
          <Grid item xs={16} className="pt-2 py-0 my-0">
            <GridField
              size="auto"
              fullWidth
              id="outlined-basic"
              label="Number of Orders"
              variant="outlined"
              value={localLineCount > 0 ? localLineCount : ''}
              onChange={handleChange}
              inputProps={{
                maxLength: 2,
                type: 'number',
                step: '1',
                min: '1',
                max: '99',
              }}
            />
          </Grid>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setFormOpen(false)} variant="outlined">
          Cancel
        </Button>
        <Button
          onClick={() => {
            handleSumbit();
          }}
          variant="contained"
          style={{ boxShadow: 'none' }}
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MultipleOrderForm;
