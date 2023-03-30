import { Grid, IconButton } from '@mui/material';
import {
  GridColumnOrderChangeParams,
  GridColumnVisibilityModel,
} from '@mui/x-data-grid-pro';
import React, { useContext, useState } from 'react';
import { IDisplay, ISalesPerson } from '../../../@types/tracetypes';
import {
  getLocaleStorageItem,
  setLocaleStorageItem,
} from '../../../utils/Helpers';
import { deleteSalepersons, getSalespersons } from '../api/salesperson';

import EditIcon from '@mui/icons-material/Edit';
import PageviewIcon from '@mui/icons-material/Pageview';
import { blue } from '@mui/material/colors';
import { useQuery } from 'react-query';
import { StateContextType } from '../../../@types/statecontext';
import GridDisplay from '../../../components/ui/GridDisplay';
import { StateContext } from '../../../context/StateContext';
import { ReducerActionType } from '../../../utils/reducers';

const SalespersonDisplay: React.FC<IDisplay> = ({ reducer }) => {
  const { setViewing } = useContext(StateContext) as StateContextType;
  const { isLoading, data: salespersons } = useQuery<ISalesPerson[]>(
    'salespersons',
    getSalespersons
  );

  const MatEdit = (index: any) => {
    const handleEditClick = () => {
      // some action
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
        aria-label="Edit a Salesman"
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
        aria-label="View a Salesman"
        onClick={handleClick}
      >
        <PageviewIcon style={{ color: blue[500] }} />
      </IconButton>
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
  };

  const defColumns = [
    {
      field: 'actions',
      headerName: 'Actions',
      align: 'center',
      sortable: false,
      width: 120,
      disableColumnMenu: true,
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
      field: 'name',
      headerName: 'Name',
      sortable: true,
      width: 160,
    },
    {
      field: 'commission',
      headerName: 'Commission',
      sortable: true,
      width: 160,
    },
    {
      field: 'city',
      headerName: 'City',
      sortable: true,
      width: 160,
    },
    {
      field: 'state',
      headerName: 'State',
      sortable: true,
      width: 160,
    },
  ];
  const [columns, setColumns] = useState<typeof defColumns>(
    getLocaleStorageItem('salesPersonsColumns', defColumns, renderCells)
  );

  const updateColumns = (columnModel: GridColumnVisibilityModel) => {
    const newColumns = columns;
    newColumns.map((column: { [key: string]: any }) => {
      column.hide = !columnModel[column.field];
      return column;
    });
    setColumns(newColumns);
    setLocaleStorageItem('salesPersonsColumns', newColumns);
  };

  const updateColumnOrder = (columnModel: GridColumnOrderChangeParams) => {
    const newColumns = columns;
    const movedColumn = newColumns.splice(columnModel.oldIndex, 1)[0];
    newColumns.splice(columnModel.targetIndex, 0, movedColumn);

    setColumns(newColumns);
    setLocaleStorageItem('salesPersonsColumns', newColumns);
  };

  return (
    <GridDisplay
      columns={columns}
      rows={salespersons ?? []}
      table="salespersons"
      isloading={isLoading}
      deleteApi={deleteSalepersons}
      moduleName="Salespersons"
      updateColumns={updateColumns}
      updateColumnOrder={updateColumnOrder}
      columnLocalKey="salesPersonsColumns"
    />
  );
};

export default SalespersonDisplay;
