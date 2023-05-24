import { Button, Divider, Grid } from '@mui/material';
import React, { FormEvent } from 'react';
import { ReducerActionType, SetPageState } from '../../utils/reducers';

import CancelIcon from '@mui/icons-material/Cancel';
import ClearIcon from '@mui/icons-material/Clear';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import LoadingButton from '@mui/lab/LoadingButton';
import { useContext } from 'react';
import { StateContextType } from '../../@types/statecontext';
import { StateContext } from '../../context/StateContext';

interface IFormButtons {
  isUpdate: boolean;
  disableSubmit?: boolean;
  setID?: React.Dispatch<React.SetStateAction<number | null>>;
  clear: () => void;
  before?: any;
  after?: any;
  reducer?: React.Dispatch<SetPageState>;
  noFormDivider?: boolean;
  subButton?: string;
  cancelEditClean?: () => void;
  hideEdit?: boolean;
}

const FormButtons: React.FC<IFormButtons> = ({
  isUpdate,
  setID,
  clear,
  before = null,
  after = null,
  reducer,
  noFormDivider,
  subButton,
  cancelEditClean,
  disableSubmit = false,
  hideEdit = false,
}) => {
  const { viewing, setViewing, isLoading } = useContext(
    StateContext
  ) as StateContextType;

  const CancelEdit = () => {
    if (reducer) {
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
    if (setID) {
      setID(null);
    }
    if (cancelEditClean) {
      cancelEditClean();
    }
    // if (!viewing) {
    //   enqueueSnackbar("Canceled Update", { variant: "info" });
    // }
    setViewing(false);
  };

  const EnableEdit = (e: FormEvent) => {
    e.preventDefault();
    setViewing(false);
  };

  return (
    <Grid container direction="row" justifyContent="center">
      {noFormDivider ?? (
        <Grid item xs={16} className="py-2 mb-2">
          <Divider className="bg-dark" />
        </Grid>
      )}
      {before}
      {isUpdate ? (
        <Button
          variant="outlined"
          type="button"
          onClick={CancelEdit}
          startIcon={<CancelIcon />}
          className="mx-1"
        >
          Exit
        </Button>
      ) : (
        <Button
          variant="outlined"
          type="reset"
          className="mx-1"
          onClick={() => clear()}
          startIcon={<ClearIcon />}
        >
          Clear
        </Button>
      )}

      {viewing ? (
        !hideEdit && (
          <Button
            variant="contained"
            className="mx-1"
            onClick={EnableEdit}
            startIcon={<EditIcon />}
            style={{ boxShadow: 'none' }}
          >
            Edit
          </Button>
        )
      ) : (
        <LoadingButton
          className="mx-1"
          type="submit"
          loading={isLoading}
          loadingPosition="start"
          startIcon={<SaveIcon />}
          variant="contained"
          style={{ boxShadow: 'none' }}
          disabled={disableSubmit}
        >
          {subButton ? subButton : 'Save'}
        </LoadingButton>
      )}
      {after}
    </Grid>
  );
};

export default FormButtons;
