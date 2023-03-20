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
import { useOrderContext } from '../context/OrderContext';

const MultipleOrderForm = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { formOpen, lineCount, setLineCount, setFormOpen } = useOrderContext();

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
              value={localLineCount}
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
            setLineCount(localLineCount > 0 ? localLineCount : 1);
            setLineCount(localLineCount > 0 ? localLineCount : 1);
            setFormOpen(false);
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
