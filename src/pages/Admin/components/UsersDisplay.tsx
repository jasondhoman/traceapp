import EditIcon from '@mui/icons-material/Edit';
import PageviewIcon from '@mui/icons-material/Pageview';
import { Grid, IconButton } from '@mui/material/';
import { blue } from '@mui/material/colors';
import Tooltip from '@mui/material/Tooltip';
import {
  GridColumnOrderChangeParams,
  GridColumnVisibilityModel,
} from '@mui/x-data-grid';
import React, { useContext, useState } from 'react';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router';
import { StateContextType } from '../../../@types/statecontext';
import { IDisplay } from '../../../@types/tracetypes';
import GridDisplay from '../../../components/ui/GridDisplay';
import { StateContext } from '../../../context/StateContext';
import {
  getLocaleStorageItem,
  setDateStringToCST,
  setLocaleStorageItem,
} from '../../../utils/Helpers';
import { ReducerActionType } from '../../../utils/reducers';
import { getUsers } from '../api/admin';

const UsersDisplay: React.FC<IDisplay> = ({ reducer }) => {
  const navigate = useNavigate();
  const { setViewing } = useContext(StateContext) as StateContextType;

  const { isLoading, data: users } = useQuery('users', getUsers, {
    refetchInterval: 30000,
    staleTime: 30000,
  });

  const MatEdit = (index: any) => {
    const handleEditClick = () => {
      setViewing(false);
      navigate(`/adminpanel/userform/${index.index}`);
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
      <Tooltip title="Edit" placement="top">
        <IconButton
          color="secondary"
          aria-label="Edit Certification"
          onClick={handleEditClick}
        >
          <EditIcon style={{ color: blue[500] }} />
        </IconButton>
      </Tooltip>
    );
  };

  const ViewItem = (index: any) => {
    const handleClick = () => {
      setViewing(true);
      navigate(`/adminpanel/userform/${index.index}?view=true`);
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
      <Tooltip title="View" placement="top">
        <IconButton
          color="secondary"
          aria-label="View a Customer"
          onClick={handleClick}
        >
          <PageviewIcon style={{ color: blue[500] }} />
        </IconButton>
      </Tooltip>
    );
  };

  const renderCells = {
    actions: (params: any) => {
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
    status: (params: any) => {
      return (
        <Grid container justifyContent="center">
          {params.value}
        </Grid>
      );
    },
    lastActive: (params: any) => {
      return (
        <Grid container justifyContent="center">
          {setDateStringToCST(params.value)}
        </Grid>
      );
    },
  };
  const defColumns = [
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
      sortable: true,
      hide: true,
      width: 20,
    },
    {
      field: 'username',
      headerName: 'username',
      sortable: true,
      width: 200,
    },
    {
      field: 'first_name',
      headerName: 'first_name',
      sortable: true,
      width: 150,
    },
    {
      field: 'last_name',
      headerName: 'last_name',
      sortable: true,
      width: 150,
    },
    {
      field: 'is_active',
      headerName: 'is_active',
      sortable: true,
      width: 150,
    },
    {
      field: 'role',
      headerName: 'role',
      sortable: true,
      width: 150,
    },
    {
      field: 'reset_password',
      headerName: 'reset_password',
      sortable: true,
      width: 150,
    },
    {
      field: 'status',
      headerName: 'status',
      sortable: true,
      width: 150,
      renderCell: (params: any) => {
        return (
          <Grid container justifyContent="center">
            {params.value}
          </Grid>
        );
      },
    },
    {
      field: 'lastActive',
      headerName: 'lastActive',
      sortable: true,
      width: 150,
      renderCell: (params: any) => {
        return (
          <Grid container justifyContent="center">
            {setDateStringToCST(params.value)}
          </Grid>
        );
      },
    },
  ];

  const [columns, setColumns] = useState<typeof defColumns>(
    getLocaleStorageItem('adminUsersGrid', defColumns, renderCells)
  );

  const updateColumns = (columnModel: GridColumnVisibilityModel) => {
    const newColumns = columns;
    newColumns.map((column: { [key: string]: any }) => {
      column.hide = !columnModel[column.field];
      return column;
    });
    setColumns(newColumns);
    setLocaleStorageItem('adminUsersGrid', newColumns);
  };

  const updateColumnOrder = (columnModel: GridColumnOrderChangeParams) => {
    const newColumns = columns;
    const movedColumn = newColumns.splice(columnModel.oldIndex, 1)[0];
    newColumns.splice(columnModel.targetIndex, 0, movedColumn);
    setColumns(newColumns);
    setLocaleStorageItem('adminUsersGrid', newColumns);
  };

  return (
    <GridDisplay
      columns={columns}
      rows={users ?? []}
      isloading={isLoading}
      moduleName={'User'}
      updateColumns={updateColumns}
      updateColumnOrder={updateColumnOrder}
      columnLocalKey="adminUsersGrid"
    />
  );
};

export default UsersDisplay;
