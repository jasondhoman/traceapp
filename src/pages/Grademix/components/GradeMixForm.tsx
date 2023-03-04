import { Button, Paper, TextField } from '@mui/material';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { IGradeMix, IGradeMixDetail } from '../../../@types/tracetypes';
import { ReducerActionType, SetPageState } from '../../../utils/reducers';
import { addGradeMix, updateGradeMix } from '../api/grademix';

import Grid from '@mui/material/Grid';
import { AxiosResponse } from 'axios';
import { StateContextType } from '../../../@types/statecontext';
import FormButtons from '../../../components/ui/FormButtons';
import { StateContext } from '../../../context/StateContext';
import useQueryMutation from '../../../hooks/useQueryMutation';

interface IGradeMixForm {
  reducer: React.Dispatch<SetPageState>;
  prop_grade_mix?: IGradeMix;
}

const GradeMixForm: React.FC<IGradeMixForm> = ({ reducer, prop_grade_mix }) => {
  const { setLoading, viewing } = useContext(StateContext) as StateContextType;

  const [isUpdate, setIsUpdate] = useState(false);
  const [grade, setGrade] = useState('');
  const [details, setDetails] = useState<IGradeMixDetail[]>([]);
  const [total_rows, setTotalRows] = useState(12);
  const [init, setInit] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);

  const addGradeMixMutation = useQueryMutation({
    mutator: addGradeMix,
    method: 'POST',
    query: 'grademixes',
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

  const updateGradeMixMutation = useQueryMutation({
    mutator: updateGradeMix,
    method: 'PUT',
    query: 'grademixes',
  });

  const submitForm = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setLoading(true);
    const gradeMixDetails = details.filter(
      (detail: IGradeMixDetail) => detail.description !== ''
    );
    // let gradeMixDetails = [
    //   ...details!.filter((detail) => {
    //     if (detail.description && detail.qty) {
    //       return detail;
    //     }
    //   }),
    // ];

    const data = {
      grade,
      grademix_id: isUpdate ? prop_grade_mix?.id : null,
      gradeMixDetails,
    };

    if (isUpdate) {
      updateGradeMixMutation.mutate(data);
    } else {
      addGradeMixMutation.mutate(data);
    }
  };

  const handleQtyChange = (a: any, e: React.SyntheticEvent) => {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'decimal',
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    });
    const target = e.target as HTMLInputElement;
    const value = formatter.format(target.valueAsNumber);
    const updatedDetails = details!.map((detail, index) => {
      if (index === a.index) {
        return {
          ...detail,
          qty: parseFloat(value.toString()),
        };
      } else {
        return {
          ...detail,
        };
      }
    });
    setDetails(updatedDetails);
  };

  const handleDescChange = (a: any, value: any) => {
    const updatedDetails = details!.map((detail, index) => {
      if (index === a.index) {
        return {
          ...detail,
          description: value,
        };
      } else {
        return {
          ...detail,
        };
      }
    });
    setDetails(updatedDetails);
  };

  const deleteRow = useCallback(
    (a: any) => () => {
      if (initialLoad) setInitialLoad(false);

      setDetails(details!.filter((detail, index) => index !== a.index));
    },

    [details]
  );

  const addRow = () => {
    const newRows = total_rows + 1;
    if (initialLoad) setInitialLoad(false);
    setTotalRows(newRows);
    const new_details = details;
    if (new_details) {
      new_details[newRows - 1] = {
        description: '',
        qty: 0,
        cordinal_order: newRows,
      };
      setDetails(new_details);
    }
  };
  const ClearForm = () => {
    setGrade('');
    setDetails([]);
    setTotalRows(12);
    setInit(true);
    setInitialLoad(true);
  };
  useEffect(() => {
    if (prop_grade_mix && initialLoad) {
      setIsUpdate(true);
      setGrade(prop_grade_mix.grade);
      setDetails(prop_grade_mix.gradeMixDetails);
      setInit(false);
    }
    if (init) {
      const init_details: IGradeMixDetail[] = [];
      for (let x = 0; x < total_rows; x++) {
        init_details[x] = {
          description: '',
          qty: 0,
          cordinal_order: x + 1,
        };
      }
      setDetails(init_details);
      setInit(false);
    }
    setLoading(false);
  }, [details, init, total_rows]);

  return (
    <Paper
      component="form"
      elevation={0}
      variant="outlined"
      onSubmit={submitForm}
      className="p-3 w-100"
    >
      <h3 className="text-center">Grade Mix</h3>
      <Grid
        container
        direction="row"
        justifyContent="space-evenly"
        alignItems="center"
        columnSpacing={2}
        rowSpacing={1}
        columns={16}
      >
        <Grid item xs={16} className="py-0 my-0">
          <TextField
            fullWidth
            id="grade"
            margin="normal"
            label="Grade"
            required
            onChange={(e) => setGrade(e.target.value)}
            value={grade}
            inputProps={{ maxLength: 150 }}
            variant={viewing ? 'filled' : 'outlined'}
            InputProps={{
              readOnly: viewing,
            }}
          />
        </Grid>
        {details!.map((detail, index) => {
          return (
            <Grid
              container
              direction="row"
              justifyContent="space-center"
              alignItems="flex-start"
              columnSpacing={2}
              rowSpacing={1}
              columns={16}
              key={index}
              wrap="nowrap"
              className="mx-auto w-100 pt-2"
            >
              <Grid item direction="row" className="py-0 h-100 text-center">
                <Button
                  variant="outlined"
                  className="mx-0 w-100 h-100 p-2"
                  onClick={deleteRow({ index })}
                  style={{
                    color: !viewing ? 'red' : 'gray',
                    borderColor: !viewing ? 'red' : 'gray',
                  }}
                  disabled={viewing}
                >
                  Delete
                </Button>
              </Grid>
              <Grid item xs={2} className="py-0 my-0">
                <TextField
                  fullWidth
                  id="qty"
                  margin="normal"
                  label="Qty"
                  onChange={(e) => handleQtyChange({ index }, e)}
                  value={detail.qty}
                  inputProps={{
                    maxLength: 150,
                    type: 'number',
                    min: 0.0,
                    step: 0.01,
                  }}
                  className="mt-0"
                  variant={viewing ? 'filled' : 'outlined'}
                  InputProps={{
                    readOnly: viewing,
                  }}
                />
              </Grid>
              <Grid item xs={12} className="py-0 my-0">
                <TextField
                  fullWidth
                  id="description"
                  margin="normal"
                  label="Mix Detail"
                  onChange={(e) => handleDescChange({ index }, e.target.value)}
                  value={detail.description}
                  inputProps={{ maxLength: 150 }}
                  className="mt-0"
                  variant={viewing ? 'filled' : 'outlined'}
                  InputProps={{
                    readOnly: viewing,
                  }}
                />
              </Grid>
            </Grid>
          );
        })}
      </Grid>
      <FormButtons
        isUpdate={isUpdate}
        reducer={reducer}
        clear={ClearForm}
        after={
          !viewing && (
            <Button
              variant="contained"
              type="button"
              className="mx-1"
              onClick={addRow}
            >
              Add Row
            </Button>
          )
        }
      />
    </Paper>
  );
};

export default GradeMixForm;
