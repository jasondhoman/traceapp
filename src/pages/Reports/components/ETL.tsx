import LoadingButton from '@mui/lab/LoadingButton';
import { useSnackbar } from 'notistack';
import React from 'react';
import { runETL } from '../api/reporting';

import SaveIcon from '@mui/icons-material/Save';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
} from '@mui/material';

const ETL: React.FC = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar();
  // const handleClickOpen = () => {
  //   setOpen(true);
  // };

  const handleClose = () => {
    setOpen(false);
  };
  const handleSubmit = async (e: React.SyntheticEvent) => {
    setOpen(false);
    setIsLoading(true);
    const res = await runETL();
    if (res.status === 200) {
      enqueueSnackbar('Reload Process Complete', { variant: 'success' });
    } else {
      enqueueSnackbar('Reload Process Failed', { variant: 'error' });
    }
    setIsLoading(false);
  };

  return (
    <>
      <h3>Run Data Transfer Process</h3>
      <LoadingButton
        className="mx-1"
        type="submit"
        loading={isLoading}
        loadingPosition="start"
        startIcon={<SaveIcon />}
        variant="contained"
        onClick={() => setOpen(true)}
        style={{ boxShadow: 'none' }}
      >
        Run Data Transfer
      </LoadingButton>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {`Reload Database`}
          <Divider className="bg-dark" />
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {`This action will delete all data currently in the database. Then reload it with the current data from the Bill Program.`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            style={{ boxShadow: 'none' }}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ETL;
