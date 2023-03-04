import { Grid, IconButton } from '@mui/material';
import React, { useContext } from 'react';
import { IDisplay, IGradeMix } from '../../../@types/tracetypes';
import { deleteGradeMixes, getGradeMixes } from '../api/grademix';

import EditIcon from '@mui/icons-material/Edit';
import PageviewIcon from '@mui/icons-material/Pageview';
import { blue } from '@mui/material/colors';
import { useQuery } from 'react-query';
import { StateContextType } from '../../../@types/statecontext';
import GridDisplay from '../../../components/ui/GridDisplay';
import { StateContext } from '../../../context/StateContext';
import { ReducerActionType } from '../../../utils/reducers';

const GradeMixDisplay: React.FC<IDisplay> = ({ reducer }) => {
  const { setViewing } = useContext(StateContext) as StateContextType;
  const { isLoading, data: gradesmixes } = useQuery<IGradeMix[]>(
    'grademixes',
    getGradeMixes
  );

  const MatEdit = (index: any) => {
    const handleEditClick = () => {
      setViewing(false);
      if (reducer) {
        reducer({
          type: ReducerActionType.SET_ID,
          payload: {
            id: index.index,
          },
        });
      }
    };

    return (
      <IconButton
        color="secondary"
        aria-label="Edit Grade Mix"
        onClick={handleEditClick}
      >
        <EditIcon style={{ color: blue[500] }} />
      </IconButton>
    );
  };

  const ViewItem = (index: any) => {
    const handleClick = () => {
      setViewing(true);
      if (reducer) {
        reducer({
          type: ReducerActionType.SET_ID,
          payload: {
            id: index.index,
          },
        });
      }
    };

    return (
      <IconButton
        color="secondary"
        aria-label="add an raw materials used"
        onClick={handleClick}
      >
        <PageviewIcon style={{ color: blue[500] }} />
      </IconButton>
    );
  };

  const columns = [
    {
      field: 'actions',
      headerName: 'Actions',
      align: 'center',
      sortable: false,
      width: 120,
      disableColumnMenu: true,
      renderCell: (params: any) => {
        return (
          <Grid
            container
            direction="row"
            wrap="nowrap"
            justifyContent="center"
            alignContent="center"
            style={{ cursor: 'pointer' }}
          >
            <MatEdit index={params.row.id} />
            <ViewItem index={params.row.id} />
          </Grid>
        );
      },
    },
    {
      field: 'id',
      headerName: 'Id',
      description: 'This column has a value getter and is not sortable.',
      sortable: true,
      hide: true,
      width: 20,
    },
    {
      field: 'grade',
      headerName: 'Grade',
      sortable: true,
      hide: false,
      width: 400,
    },
  ];
  return (
    <GridDisplay
      columns={columns}
      rows={gradesmixes ?? []}
      table="grademixes"
      isloading={isLoading}
      moduleName="Grade Mix"
      deleteApi={deleteGradeMixes}
    />
  );
};

export default GradeMixDisplay;
