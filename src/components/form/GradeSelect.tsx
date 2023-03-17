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
  groupFirst?: string[];
}

const GradeSelect: React.FC<IStateSelect> = ({
  state,
  changeState,
  size = 16,
  name,
  helperText,
  error,
  groupFirst,
}) => {
  //Select States
  const [grades, setGrades] = useState<AutoComplete[]>([]);
  const [selectedGrade, setSelectedGrade] = useState<AutoComplete>({
    id: 0,
    label: '',
    group: '',
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
            const option = {
              id: mix.id,
              label: mix.grade,
              group: '',
            };
            if (groupFirst) {
              option.group = 'Other Grades';
            }
            return {
              id: mix.id,
              label: mix.grade,
              group:
                groupFirst && groupFirst.includes(mix.grade)
                  ? 'Customer Grades'
                  : 'All Grades',
            };
          }
        );
        gradeAutocompletes.unshift({
          id: 0,
          label: '',
          group: '',
        });

        // filter 'Other Grades' to the bottom
        gradeAutocompletes.sort((a, b) => {
          if (a.group === 'All Grades') {
            return 1;
          }
          if (b.group === 'All Grades') {
            return -1;
          }
          return 0;
        });

        const s = gradeAutocompletes.find((c) => c.id === state);
        if (s) {
          setSelectedGrade(s);
        }
        setGrades(gradeAutocompletes);
      }
    });
  }, [groupFirst, state]);

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
