import {
  GridColumnOrderChangeParams,
  GridColumnVisibilityModel,
} from '@mui/x-data-grid';
import React, { useContext, useState } from 'react';
import { IDisplay, IRawMaterialsUsed } from '../../../@types/tracetypes';
import {
  formatAsCurrency,
  getLocaleStorageItem,
  setLocaleStorageItem,
} from '../../../utils/Helpers';
import {
  deleteRawMatsUsed,
  getRawMaterialsUsed,
} from '../api/rawmaterialsused';

import EditIcon from '@mui/icons-material/Edit';
import PageviewIcon from '@mui/icons-material/Pageview';
import { Grid, IconButton } from '@mui/material';
import { blue } from '@mui/material/colors';
import { useQuery } from 'react-query';
import { StateContextType } from '../../../@types/statecontext';
import GridDisplay from '../../../components/ui/GridDisplay';
import { StateContext } from '../../../context/StateContext';
import { ReducerActionType } from '../../../utils/reducers';

const RawMaterialsUsedDisplay: React.FC<IDisplay> = ({ reducer }) => {
  const { setViewing } = useContext(StateContext) as StateContextType;
  const { isLoading, data: rawusedmaterials } = useQuery<IRawMaterialsUsed[]>(
    'rawmaterialsused',
    getRawMaterialsUsed
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
        aria-label="add an raw materials used"
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
    price: (params: any) => {
      return (
        <Grid container justifyContent="flex-end">
          {formatAsCurrency(params.value)}
        </Grid>
      );
    },
    cost: (params: any) => {
      return (
        <Grid container justifyContent="flex-end">
          {formatAsCurrency(params.value)}
        </Grid>
      );
    },
  };

  const valueGetters = {
    description: (params: any) => {
      let result: string[] = [];
      if (params.row.RawMaterials) {
        if (params.row.RawMaterials.description) {
          result.push(params.row.RawMaterials.description);
        }
      } else {
        result = ['Unknown'];
      }
      return result.join(', ');
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
      sortable: true,
      width: 20,
      hide: true,
    },
    {
      field: 'description',
      headerName: 'Description',
      sortable: true,
      width: 160,
    },
    {
      field: 'stock',
      headerName: 'Stock',
      sortable: true,
      hide: false,
      width: 100,
      type: 'number',
      align: 'right',
    },
    {
      field: 'production_line',
      headerName: 'Line',
      sortable: true,
      hide: false,
      width: 80,
      align: 'center',
    },
    {
      field: 'linter_report',
      headerName: 'Linter',
      sortable: true,
      hide: false,
      width: 80,
      align: 'center',
    },
    {
      field: 'qty',
      headerName: 'Qty',
      sortable: true,
      hide: false,
      width: 160,
      type: 'number',
      align: 'right',
    },
    {
      field: 'average_weight',
      headerName: 'AVG Weight',
      sortable: true,
      hide: false,
      width: 160,
      type: 'number',
      align: 'right',
    },
    {
      field: 'price',
      headerName: 'Price',
      sortable: true,
      hide: false,
      width: 100,
    },
    {
      field: 'cost',
      headerName: 'Cost',
      sortable: true,
      hide: false,
      width: 100,
    },
  ];
  const [columns, setColumns] = useState<typeof defColumns>(
    getLocaleStorageItem(
      'rawMatsUsedColumns',
      defColumns,
      renderCells,
      valueGetters
    )
  );

  const updateColumns = (columnModel: GridColumnVisibilityModel) => {
    const newColumns = columns;
    newColumns.map((column: { [key: string]: any }) => {
      column.hide = !columnModel[column.field];
      return column;
    });
    setColumns(newColumns);
    setLocaleStorageItem('rawMatsUsedColumns', newColumns);
  };

  const updateColumnOrder = (columnModel: GridColumnOrderChangeParams) => {
    const newColumns = columns;
    const movedColumn = newColumns.splice(columnModel.oldIndex, 1)[0];
    newColumns.splice(columnModel.targetIndex, 0, movedColumn);
    setColumns(newColumns);
    setLocaleStorageItem('rawMatsUsedColumns', newColumns);
  };

  return (
    <GridDisplay
      columns={columns}
      rows={rawusedmaterials ?? []}
      table="rawusedmaterials"
      isloading={isLoading}
      moduleName="Raw Materials Used"
      deleteApi={deleteRawMatsUsed}
      updateColumns={updateColumns}
      updateColumnOrder={updateColumnOrder}
      columnLocalKey="rawMatsUsedColumns"
    />
  );
};

export default RawMaterialsUsedDisplay;
