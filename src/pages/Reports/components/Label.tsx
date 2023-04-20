import {
  Checkbox,
  Container,
  Grid,
  Paper,
  SelectChangeEvent,
} from '@mui/material';
import { useSnackbar } from 'notistack';

import React, { FC, SyntheticEvent, useState } from 'react';
import SelectFragment from '../../../components/form/SelectFragment';
import FormButtons from '../../../components/ui/FormButtons';
import GridField from '../../../components/ui/GridField';
import TitleFragment from '../../../components/ui/TitleFragment';
import { generateLabel } from '../api/reporting';

const LabelGenerator: FC = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [tracking, setTracking] = useState(0);
  const [selectedSize, setSelectedSize] = useState(0);
  const [qrCode, setQrCode] = useState(false);
  const [organic, setOrganic] = useState(false);
  const clearForm = () => {
    setTracking(0);
  };
  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    const body = {
      tracking,
      organic,
      qr_code: qrCode,
      per_sheet: selectedSize === 0 ? 6 : 4,
    };
    const res = await generateLabel(body);
    if (!res) {
      enqueueSnackbar(`No Production Information Found for ${tracking}`, {
        variant: 'error',
      });
    }
  };
  const handleChange = (e: React.SyntheticEvent) => {
    const target = e.target as HTMLInputElement;
    setTracking(parseInt(target.value));
  };

  return (
    <Container className="mt-2 mx-0 px-0" maxWidth={false}>
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
      >
        <Container className="mt-2 mx-0 px-0" maxWidth={'sm'}>
          <Paper
            component="form"
            style={{ padding: '1rem' }}
            onSubmit={handleSubmit}
            variant="outlined"
            elevation={0}
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
              <TitleFragment
                size="h3"
                firstDivider={false}
                title="Print Labels"
              />

              <GridField
                size={16}
                fullWidth
                margin="normal"
                id="tracking"
                label="Tracking"
                name="tracking"
                value={tracking}
                onChange={handleChange}
                inputProps={{ max: 1000000000, min: 0, type: 'number' }}
              />

              <SelectFragment
                className="ms-3 mt-3"
                selectOptions={[
                  {
                    value: 0,
                    desc: '2x6 (6 Per Sheet)',
                  },
                  {
                    value: 1,
                    desc: '2x2 (4 Per Sheet)',
                  },
                ]}
                state={selectedSize}
                changeState={(e: SelectChangeEvent) =>
                  setSelectedSize(Number(e.target.value))
                }
                label="Select Label Size"
                id="label-size"
              />
              {selectedSize === 1 && (
                <Grid
                  className="m-2"
                  container
                  direction="row"
                  justifyContent="space-center"
                  alignItems="center"
                  columnSpacing={2}
                  rowSpacing={1}
                  columns={16}
                >
                  {/* <Checkbox
                    id="qr-code"
                    value={qrCode}
                    onChange={() => setQrCode(!qrCode)}
                  />
                  <label htmlFor="qr-code">QR Code</label> */}

                  <Checkbox
                    id="organic"
                    value={organic}
                    onChange={() => setOrganic(!organic)}
                  />
                  <label htmlFor="organic">Print Organic License</label>
                </Grid>
              )}
            </Grid>
            <FormButtons
              isUpdate={false}
              clear={clearForm}
              subButton="Submit"
            />
          </Paper>
        </Container>
      </Grid>
    </Container>
  );
};

export default LabelGenerator;
