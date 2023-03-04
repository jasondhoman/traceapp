//UI Components
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import { ICertification } from '../../@types/tracetypes';
//React
import React from 'react';
//Types
import { SelectChangeEvent } from '@mui/material';
import SelectFragment from './SelectFragment';
//API / Helpers
import { getCertificates } from '../../pages/Certifications/api/certifications';
//Hooks
import { useQuery } from 'react-query';

interface ICertificate {
  id: number;
  changeState: (e: SelectChangeEvent) => void;
  size: number;
}
const CertificateSelect: React.FC<ICertificate> = ({
  id,
  changeState,
  size = 16,
}) => {
  const { isLoading, data: certificates } = useQuery<ICertification[]>(
    'cert_select',
    getCertificates
  );

  return (
    <Grid className="py-0" item xs={size}>
      {!isLoading ? (
        <SelectFragment
          selectOptions={certificates}
          state={id}
          label="Certification"
          id="certification"
          changeState={changeState}
          valColumn="id"
          name="certification"
          descColumn="certification"
          none={false}
          noneValue={undefined}
          disabled={false}
        />
      ) : (
        <CircularProgress />
      )}
    </Grid>
  );
};
export default CertificateSelect;
