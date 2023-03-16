import { AutoComplete, IGradeMix } from '../../@types/tracetypes';
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useCallback, useEffect, useState } from 'react';
import { getGradeMixes } from '../../pages/Grademix/api/grademix';

import Grid from '@mui/material/Grid';
import AutocompleteFragment from './AutocompleteFragment';

interface IStateSelect {
  state: number;
  changeState: (id: any) => void;
  size?: number;
  name?: string;
  helperText?: string;
  error?: boolean;
}

const GradeSelect: React.FC<IStateSelect> = ({
  state,
  changeState,
  size = 16,
  name,
  helperText,
  error,
}) => {
  //Select States
  const [grades, setGrades] = useState<AutoComplete[]>([]);
  const [selectedGrade, setSelectedGrade] = useState<AutoComplete>({
    id: 0,
    label: '',
  });

  const updateSelected = useCallback(
    (state: number) => {
      const s = grades.find((c) => c.id === state);
      if (s) {
        setSelectedGrade(s);
        changeState(s.id);
      }
    },
    [grades, changeState]
  );

  useEffect(() => {
    getGradeMixes().then((mixes: IGradeMix[]) => {
      if (mixes) {
        const gradeAutocompletes: AutoComplete[] = mixes.map(
          (mix: IGradeMix) => {
            return {
              id: mix.id,
              label: mix.grade,
            };
          }
        );
        gradeAutocompletes.unshift({
          id: 0,
          label: '',
        });
        const s = gradeAutocompletes.find((c) => c.id === state);
        if (s) {
          setSelectedGrade(s);
        }
        setGrades(gradeAutocompletes);
      }
    });
  }, [state]);

  return (
    <Grid item xs={size} className="mt-2">
      <AutocompleteFragment
        error={error}
        id="grade_mix_id"
        label="Grade"
        state={selectedGrade}
        viewingText={selectedGrade.label}
        helperText={helperText}
        changeState={(id) => {
          updateSelected(id);
          changeState(id);
        }}
        selectOptions={grades}
      />
    </Grid>
  );
};
export default GradeSelect;
