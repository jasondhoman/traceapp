import { Grid, IconButton } from '@mui/material';
import {
  GridColumnOrderChangeParams,
  GridColumnVisibilityModel,
} from '@mui/x-data-grid-pro';
//Helper Imports
import React, { useContext, useState } from 'react';
import { IDisplay, IRawMaterials } from '../../../@types/tracetypes';
import {
  formatAsCurrency,
  formatShortDate,
  getLocaleStorageItem,
  setLocaleStorageItem,
} from '../../../utils/helpers';
import { deleteRawMaterials, getRawMaterials } from '../api/rawmaterial';

import EditIcon from '@mui/icons-material/Edit';
import PageviewIcon from '@mui/icons-material/Pageview';
import { blue } from '@mui/material/colors';
import { useQuery } from 'react-query';
import { StateContextType } from '../../../@types/statecontext';
import GridDisplay from '../../../components/ui/GridDisplay';
import { StateContext } from '../../../context/StateContext';
import { ReducerActionType } from '../../../utils/reducers';

const RawMaterialDisplay: React.FC<IDisplay> = ({ reducer }) => {
  const { setViewing } = useContext(StateContext) as StateContextType;
  const { isLoading, data: rawmaterials } = useQuery<IRawMaterials[]>(
    'rawmaterials',
    getRawMaterials
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
        aria-label="add an alarm"
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
    date_received: (params: any) => {
      return (
        <Grid container justifyContent="center">
          {formatShortDate(params.value)}
        </Grid>
      );
    },
    price: (params: any) => {
      return (
        <Grid container justifyContent="flex-end">
          {formatAsCurrency(params.value, 4)}
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
      width: 20,
      hide: true,
    },
    {
      field: 'description',
      headerName: 'Grade',
      sortable: true,
      width: 160,
    },
    {
      field: 'qty',
      headerName: 'Qty',
      sortable: true,
      width: 160,
      type: 'number',
      align: 'right',
    },
    {
      field: 'vendor',
      headerName: 'Vendor',
      sortable: true,
      width: 160,
    },
    {
      field: 'amount_received',
      headerName: 'Amt Received',
      sortable: true,
      width: 160,
      type: 'number',
      align: 'right',
    },
    {
      field: 'date_received',
      headerName: 'Date Received',
      sortable: true,
      width: 160,
    },
    {
      field: 'average_weight',
      headerName: 'AVG Weight',
      sortable: true,
      width: 160,
      type: 'number',
      align: 'right',
    },
    {
      field: 'price',
      headerName: 'Price',
      sortable: true,
      width: 160,
    },
  ];

  const [columns, setColumns] = useState<typeof defColumns>(
    getLocaleStorageItem('rawMatsColumns', defColumns, renderCells)
  );

  const updateColumns = (columnModel: GridColumnVisibilityModel) => {
    const newColumns = columns;
    newColumns.map((column: { [key: string]: any }) => {
      column.hide = !columnModel[column.field];
      return column;
    });
    setColumns(newColumns);
    setLocaleStorageItem('rawMatsColumns', newColumns);
  };

  const updateColumnOrder = (columnModel: GridColumnOrderChangeParams) => {
    const newColumns = columns;
    const movedColumn = newColumns.splice(columnModel.oldIndex, 1)[0];
    newColumns.splice(columnModel.targetIndex, 0, movedColumn);
    setColumns(newColumns);
    setLocaleStorageItem('rawMatsColumns', newColumns);
  };

  return (
    <GridDisplay
      columns={columns}
      rows={rawmaterials ?? []}
      table="rawmaterials"
      isloading={isLoading}
      moduleName="Raw Materials"
      deleteApi={deleteRawMaterials}
      updateColumns={updateColumns}
      updateColumnOrder={updateColumnOrder}
      columnLocalKey="rawMatsColumns"
    />
  );
};

export default RawMaterialDisplay;
