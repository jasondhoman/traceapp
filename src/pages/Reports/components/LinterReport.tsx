import { Container, Grid, Paper } from '@mui/material';
import { AxiosResponse } from 'axios';

import { useSnackbar } from 'notistack';
import React, { useEffect } from 'react';
import SelectFragment from '../../../components/form/SelectFragment';
import FormButtons from '../../../components/ui/FormButtons';
import TitleFragment from '../../../components/ui/TitleFragment';
import { useStateContext } from '../../../context/StateContext';
import { getLinterReport, postLinterReport } from '../api/reporting';

const LinterReport: React.FC = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [post, setPost] = React.useState('N');
  const clearForm = () => {
    setPost('N');
  };
  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (post === 'Y') {
      const res = await postLinterReport();
      enqueueSnackbar(res.data.message, {
        variant: res.status === 200 ? 'success' : 'error',
      });
    } else {
      const res = (await getLinterReport()) as AxiosResponse;
      if (res.status !== 200) {
        enqueueSnackbar(`Linter Report Generation Failed`, {
          variant: 'error',
        });
      }
    }
  };

  const { setViewing } = useStateContext();
  useEffect(() => {
    setViewing(false);
  }, [setViewing]);

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
                title="Linter Report"
              />
              <Grid item xs={16} className="py-2 my-0">
                <SelectFragment
                  selectOptions={[
                    { value: 'N', desc: 'Run Report Only' },
                    {
                      value: 'Y',
                      desc: 'Post Updates to Database',
                    },
                  ]}
                  valColumn="value"
                  descColumn="desc"
                  state={post}
                  changeState={(e) => {
                    setPost(e.target.value);
                  }}
                  label="Linter Report"
                  id="print-report"
                  none={true}
                  name="print_report"
                  defaultType="string"
                />
              </Grid>
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

export default LinterReport;
