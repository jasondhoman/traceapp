import { Grid, IconButton } from '@mui/material';
import {
  GridColumnOrderChangeParams,
  GridColumnVisibilityModel,
} from '@mui/x-data-grid';
import React, { useContext, useState } from 'react';
import { IDisplay, IWeightsToShipOut } from '../../../@types/tracetypes';
import {
  getLocaleStorageItem,
  setLocaleStorageItem,
} from '../../../utils/Helpers';
import { deleteWeights, getWeights } from '../api/weightstoship';

import EditIcon from '@mui/icons-material/Edit';
import PageviewIcon from '@mui/icons-material/Pageview';
import { blue } from '@mui/material/colors';
import { useQuery } from 'react-query';
import { StateContextType } from '../../../@types/statecontext';
import GridDisplay from '../../../components/ui/GridDisplay';
import { StateContext } from '../../../context/StateContext';
import { ReducerActionType } from '../../../utils/reducers';

const ProductionDataDisplay: React.FC<IDisplay> = ({ reducer }) => {
  const { setViewing } = useContext(StateContext) as StateContextType;
  const { isLoading, data: weightstoship } = useQuery<IWeightsToShipOut[]>(
    'weights',
    getWeights
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
        aria-label="Edit a Production Data Record"
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
        aria-label="View a Production Data Record"
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
      width: 100,
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
      field: 'tracking',
      headerName: 'Tracking',
      sortable: true,
      width: 100,
      align: 'right',
    },
    {
      field: 'company_name',
      headerName: 'Name',
      sortable: true,
      hide: false,
      width: 160,
      align: 'center',
    },
    {
      field: 'grade',
      headerName: 'Grade',
      sortable: true,
      width: 160,
      align: 'center',
    },
    {
      field: 'tag_size',
      headerName: 'Tag Size',
      sortable: true,
      hide: false,
      width: 160,
      align: 'center',
    },
    {
      field: 'qty',
      headerName: 'QTY',
      sortable: true,
      hide: false,
      width: 160,
      align: 'right',
      type: 'number',
    },
  ];

  const [columns, setColumns] = useState<typeof defColumns>(
    getLocaleStorageItem('weightsColumns', defColumns, renderCells)
  );

  const updateColumns = (columnModel: GridColumnVisibilityModel) => {
    const newColumns = columns;
    newColumns.map((column: { [key: string]: any }) => {
      column.hide = !columnModel[column.field];
      return column;
    });
    setColumns(newColumns);
    setLocaleStorageItem('weightsColumns', newColumns);
  };

  const updateColumnOrder = (columnModel: GridColumnOrderChangeParams) => {
    const newColumns = columns;
    const movedColumn = newColumns.splice(columnModel.oldIndex, 1)[0];
    newColumns.splice(columnModel.targetIndex, 0, movedColumn);
    setColumns(newColumns);
    setLocaleStorageItem('weightsColumns', newColumns);
  };

  return (
    <GridDisplay
      columns={columns}
      rows={weightstoship ?? []}
      table="weightstoship"
      isloading={isLoading}
      moduleName="Weights to Ship"
      deleteApi={deleteWeights}
      updateColumns={updateColumns}
      updateColumnOrder={updateColumnOrder}
      columnLocalKey="weightsColumns"
    />
  );
};

export default ProductionDataDisplay;
