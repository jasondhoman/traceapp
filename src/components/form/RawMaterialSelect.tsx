import React, { useEffect } from 'react';
import { AutoComplete, IRawMaterials } from '../../@types/tracetypes';

import Grid from '@mui/material/Grid';
import { getRawMaterialsWithStock } from '../../pages/Rawmaterials/api/rawmaterial';
import AutocompleteFragment from './AutocompleteFragment';

interface IRawMat {
  state: any;
  changeState: (id: number) => void;
  size: number;
  disabled: boolean;
}

const RawMaterialSelect: React.FC<IRawMat> = ({
  state,
  changeState,
  size = 16,
  disabled = false,
}) => {
  const [rawmaterials, setRawMaterials] = React.useState<AutoComplete[]>([]);
  const [selectedRawMaterial, setSelectedRawMaterial] =
    React.useState<AutoComplete>({
      id: 0,
      label: 'Select Raw Material',
    });
  // const { isLoading, data: rawMaterials } = useQuery(
  //   "rawmats_select",
  //   getRawMaterials
  // );

  useEffect(() => {
    getRawMaterialsWithStock().then((res) => {
      if (res) {
        const rawmats: AutoComplete[] = res.map((c: IRawMaterials) => {
          return { id: c.id, label: c.description };
        });
        rawmats.push({ id: 0, label: '' });

        const selected = rawmats.find((c) => c.id === state);
        if (selected) {
          setSelectedRawMaterial(selected);
        }

        setRawMaterials(rawmats);
      }
    });
  }, [state]);

  return (
    <Grid item xs={size}>
      <AutocompleteFragment
        id="raw-mat-select"
        label="Grade"
        state={selectedRawMaterial}
        viewingText={selectedRawMaterial.label}
        changeState={changeState}
        selectOptions={rawmaterials}
      />
      {/* {rawmaterials ? (
        <SelectFragment
          selectOptions={rawmaterials}
          state={state}
          label="Description"
          id="description"
          changeState={changeState}
          valColumn="id"
          descColumn="description"
          disabled={disabled}
          none={false}
          noneValue={undefined}
        />
      ) : (
        <CircularProgress />
      )} */}
    </Grid>
  );
};
export default RawMaterialSelect;
