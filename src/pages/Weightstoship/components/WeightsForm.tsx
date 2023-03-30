import {
  CircularProgress,
  createFilterOptions,
  FormControl,
  Grid,
  Paper,
} from '@mui/material';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { formatShortDate, maskDate } from '../../../utils/Helpers';
import {
  getOrderInfoByTracking,
  getOrderTrackingIdsForWeight,
} from '../../Orders/api/order';
import { addWeight, updateWeight } from '../api/weightstoship';

import validator from 'validator';
import { AuthContextType } from '../../../@types/authcontext';
import { StateContextType } from '../../../@types/statecontext';
import { IWeightsToShipOut } from '../../../@types/tracetypes';
import AutocompleteFragment from '../../../components/form/AutocompleteFragment';
import FormButtons from '../../../components/ui/FormButtons';
import GridField from '../../../components/ui/GridField';
import TitleFragment from '../../../components/ui/TitleFragment';
import { AuthContext } from '../../../context/AuthContext';
import { StateContext } from '../../../context/StateContext';
import useQueryMutation from '../../../hooks/useQueryMutation';
import { default_weights_to_ship } from '../../../utils/Constants';
import { SetPageState } from '../../../utils/reducers';
import WeightsGrid from './WeightsGrid';

interface IWeightsToShip {
  reducer: React.Dispatch<SetPageState>;
  prop_ship?: IWeightsToShipOut;
}
interface ITrackingIDs {
  label: string;
  id: number;
  tracking_id: number;
}

const WeightsToShipForm: React.FC<IWeightsToShip> = ({
  reducer,
  prop_ship,
}) => {
  const { user } = useContext(AuthContext) as AuthContextType;
  const { setLoading } = useContext(StateContext) as StateContextType;
  const [weight_to_ship, setWeightToShip] = useState<IWeightsToShipOut>(
    default_weights_to_ship
  );
  const [ship_date, setShipDate] = useState({
    error: false,
    helperText: '',
    value: '',
  });
  const [isUpdate, setIsUpdate] = useState(false);

  const [selected_tracking, setSelected] = useState<number>(
    prop_ship?.tracking || 0
  );

  const addWeightMutation = useQueryMutation({
    mutator: addWeight,
    method: 'POST',
    query: 'weights',
    cleanClosure: (res: any) => {
      const data = res.data as { id: number; message: string };
      setWeightToShip((prev) => {
        return {
          ...prev,
          id: data.id,
        };
      });
    },
  });

  const updateWeightMutation = useQueryMutation({
    mutator: updateWeight,
    method: 'POST',
    query: 'weights',
  });

  const filterOptions = createFilterOptions({
    matchFrom: 'start',
    stringify: (option: ITrackingIDs) => option.label,
  });

  const [trackingids, setTrackingIds] = useState<ITrackingIDs[]>([]);

  const getTrackingids = useCallback(async () => {
    setLoading(true);
    const data = await getOrderTrackingIdsForWeight();

    if (data) {
      data.unshift({
        label: '',
        id: 0,
        tracking_id: 0,
      });
      setTrackingIds(data);
      setSelected(data[0].label);
    }
    setLoading(false);
  }, [setLoading]);

  const populateArray = useCallback((qty: number) => {
    const w: number[] = [];
    if (qty)
      for (let x = 0; x < qty; x++) {
        w.push(0);
      }
    setWeightToShip((prev) => {
      return { ...prev, weights: w };
    });
  }, []);

  const submitForm = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setLoading(true);

    const data = {
      ...weight_to_ship,
      total_weight: weight_to_ship.total_weight
        ? parseFloat(weight_to_ship.total_weight?.toString())
        : 0,
      qty: weight_to_ship.qty ? parseFloat(weight_to_ship.qty?.toString()) : 0,
      ship_date: ship_date.value,
      ship_id: isUpdate ? weight_to_ship?.id : null,
      user_id: user?.id,
    };

    if (isUpdate) {
      updateWeightMutation.mutate(data);
    } else {
      addWeightMutation.mutate(data);
      setIsUpdate(true);
    }
  };

  const ClearForm = () => {
    setWeightToShip(default_weights_to_ship);
    setShipDate({
      error: false,
      helperText: '',
      value: '',
    });
    setSelected(0);
    setIsUpdate(false);
  };

  const handleDateChange = (e: React.SyntheticEvent) => {
    const target = e.target as HTMLInputElement;
    const new_ship_date = ship_date;

    if (target.name === 'ship_date') {
      new_ship_date.value = maskDate(target.value);
      if (new_ship_date.value !== '') {
        new_ship_date.error = !validator.isDate(target.value, {
          format: 'MM-DD-YYYY',
        });
      } else {
        new_ship_date.error = false;
      }
    }

    setShipDate((prev) => ({ ...prev, ...new_ship_date }));
  };

  const handleChange = async (id: number) => {
    setSelected(id);
    const data = await getOrderInfoByTracking(id.toString());

    if (data) {
      setWeightToShip({
        ...data,
        company_name: data.company_name ?? '',
        grade: data.grade ?? '',
        tag_size: data.tag_size ?? '',
        ship_date: data.ship_date
          ? new Date(data.ship_date ?? '').toISOString().split('T')[0]
          : '',
        weights: [],
        min: data.min_weight,
        max: data.max_weight,
      });
      // format usa data from datetime
      setShipDate({
        error: false,
        helperText: '',
        value: data.ship_date
          ? formatShortDate(new Date(data.ship_date ?? ''))
          : '',
      });
    }

    if (data?.qty) {
      populateArray(data?.qty);
    }
  };

  const UpdateWeight = (index: number, e: React.SyntheticEvent) => {
    const target = e.target as HTMLInputElement;
    const new_weights = weight_to_ship.weights;
    try {
      new_weights[index] = parseFloat(target.value);
    } catch {
      new_weights[index] = 0;
    }

    const new_total_weight = new_weights.reduce(
      (previousValue, currentValue) => previousValue + currentValue,
      0
    );
    setWeightToShip((prev) => {
      return { ...prev, weights: new_weights, total_weight: new_total_weight };
    });
  };

  useEffect(() => {
    getTrackingids();

    if (prop_ship) {
      setWeightToShip(prop_ship);
      setSelected(prop_ship.tracking);
      setIsUpdate(true);
      setShipDate({
        error: false,
        helperText: '',
        value: formatShortDate(prop_ship.ship_date) ?? '',
      });
    }

    setLoading(false);
  }, [getTrackingids, prop_ship, setLoading]);

  return (
    <Paper
      component="form"
      elevation={0}
      variant="outlined"
      onSubmit={submitForm}
      className="p-3 w-100"
    >
      <Grid
        container
        direction="row"
        justifyContent="space-center"
        alignItems="center"
        columnSpacing={2}
        rowSpacing={1}
        columns={16}
      >
        <Grid item xs={16}>
          <TitleFragment
            size="h3"
            title="Weights to Ship"
            firstDivider={false}
          />
        </Grid>
        <Grid
          item
          xs={16}
          style={{ paddingLeft: '1rem' }}
          justifyContent="space-between"
          alignItems="center"
        >
          {isUpdate ? (
            <GridField
              size={8}
              id="tracking-id"
              label="Tracking Number"
              inputProps={{ maxLength: 40 }}
              value={weight_to_ship.tracking}
              fullWidth
              disabled={true}
            />
          ) : trackingids ? (
            <FormControl fullWidth variant="outlined" className="m-0">
              <AutocompleteFragment
                id="tracking-id-select"
                label="Tracking Number"
                state={selected_tracking > 0 ? selected_tracking : ''}
                viewingText={selected_tracking.toString()}
                changeState={handleChange}
                selectOptions={trackingids}
                filterOptions={filterOptions}
                isOptionEqualToValue={(option: any, value: any) => {
                  if (!value) {
                    return true;
                  }
                  return option.id === Number(value);
                }}
              />
            </FormControl>
          ) : (
            <CircularProgress />
          )}
        </Grid>

        <Grid
          container
          direction="row"
          justifyContent="flex-start"
          alignItems="center"
          flexWrap="nowrap"
          className="px-2 mx-2 mt-3"
        >
          <GridField
            error={ship_date.error}
            helperText={ship_date.error ? 'Enter a valid date' : ' '}
            placeholder="MM-DD-YYYY"
            size="auto"
            className="mb-0"
            id="ship_date"
            name="ship_date"
            margin="none"
            label=" Shipping Date"
            inputProps={{
              maxLength: 10,
              readOnly: true,
            }}
            onChange={handleDateChange}
            value={ship_date.value}
          />
        </Grid>

        <GridField
          size={8}
          id="company_name"
          label="Name"
          inputProps={{ maxLength: 40 }}
          value={weight_to_ship.company_name}
          fullWidth
          disabled={true}
        />
        <GridField
          size={9}
          id="grade"
          margin="normal"
          label="Grade"
          value={weight_to_ship.grade}
          disabled={true}
          fullWidth
        />
        <GridField
          size={7}
          fullWidth
          id="tagsize"
          margin="normal"
          label="Tag Size"
          value={weight_to_ship.tag_size}
          inputProps={{ maxLength: 150 }}
          disabled={true}
        />
        <GridField
          fullWidth
          size={4}
          id="qty"
          margin="normal"
          label="QTY"
          value={weight_to_ship.qty}
          disabled={true}
          inputProps={{
            maxLength: 10,
            type: 'number',
            step: '.00001',
            min: 0,
          }}
        />
        <GridField
          fullWidth
          size={4}
          id="total_weight"
          margin="normal"
          label="Total Pounds"
          value={weight_to_ship.total_weight}
          disabled={true}
          inputProps={{
            maxLength: 10,
            type: 'number',
            step: '.00001',
            min: 0,
          }}
        />

        {weight_to_ship.weights.length > 0 && (
          <Grid item xs={16}>
            <TitleFragment
              size="h3"
              title="Enter Weight"
              firstDivider={false}
            />
          </Grid>
        )}
        {weight_to_ship.weights && (
          <Grid
            container
            direction="row"
            justifyContent="space-center"
            alignItems="center"
          >
            <WeightsGrid
              qty={weight_to_ship.qty ? weight_to_ship.qty : 0}
              stateChange={UpdateWeight}
              weights={weight_to_ship.weights}
              clear={ClearForm}
              min={weight_to_ship.min}
              max={weight_to_ship.max === 0 ? 100000 : weight_to_ship.max}
            />
          </Grid>
        )}
      </Grid>
      <FormButtons isUpdate={isUpdate} reducer={reducer} clear={ClearForm} />
    </Paper>
  );
};

export default WeightsToShipForm;
