import { Grid, IconButton } from '@mui/material';
import {
  GridColumnOrderChangeParams,
  GridColumnVisibilityModel,
} from '@mui/x-data-grid';
import React, { useContext, useState } from 'react';
import { IDisplay, IOrder } from '../../../@types/tracetypes';
import {
  formatAsCurrency,
  formatShortDate,
  getLocaleStorageItem,
  setLocaleStorageItem,
} from '../../../utils/Helpers';

import EditIcon from '@mui/icons-material/Edit';
import PageviewIcon from '@mui/icons-material/Pageview';
import { blue } from '@mui/material/colors';
import { GridPinnedColumns } from '@mui/x-data-grid-pro';
import { useQuery } from 'react-query';
import { StateContextType } from '../../../@types/statecontext';
import GridDisplay from '../../../components/ui/GridDisplay';
import { StateContext } from '../../../context/StateContext';
import { ReducerActionType } from '../../../utils/reducers';
import { getOrders } from '../api/order';

const ProductionDataDisplay: React.FC<IDisplay> = ({ reducer }) => {
  const { setViewing } = useContext(StateContext) as StateContextType;
  const { isLoading, data: orders } = useQuery<IOrder[]>('orders', getOrders);

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
    ship_date: (params: any) => {
      return (
        <Grid container justifyContent="flex-end">
          {formatShortDate(params.value)}
        </Grid>
      );
    },
    total_cost: (params: any) => {
      return (
        <Grid container justifyContent="flex-end">
          {formatAsCurrency(params.value)}
        </Grid>
      );
    },
    price_per_piece: (params: any) => {
      return (
        <Grid container justifyContent="flex-end">
          {formatAsCurrency(params.value)}
        </Grid>
      );
    },
    price_per_pound: (params: any) => {
      return (
        <Grid container justifyContent="flex-end">
          {formatAsCurrency(params.value)}
        </Grid>
      );
    },
    extra_cost: (params: any) => {
      return (
        <Grid container justifyContent="flex-end">
          {formatAsCurrency(params.value)}
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
    { field: 'id', headerName: 'Id', hide: true, sortable: true, width: 160 },
    {
      field: 'company_name',
      headerName: 'Company Name',
      sortable: true,
      width: 260,
      align: 'center',
    },
    {
      field: 'tracking',
      headerName: 'Tracking',
      align: 'center',
      sortable: true,
      width: 160,
    },
    {
      field: 'purchase_order',
      headerName: 'Purchase_order',
      sortable: true,
      align: 'center',
      width: 160,
    },
    {
      field: 'line',
      headerName: 'Line',
      align: 'center',
      sortable: true,
      width: 80,
    },
    {
      field: 'ship_date',
      headerName: 'Ship Date',
      sortable: true,
      width: 120,
    },
    {
      field: 'qty',
      headerName: 'Qty',
      sortable: true,
      width: 160,
      align: 'right',
      type: 'number',
    },
    {
      field: 'grade',
      headerName: 'Grade',
      align: 'center',
      sortable: true,
      width: 160,
    },
    {
      field: 'tag_size',
      headerName: 'Tag Size',
      align: 'center',
      sortable: true,
      width: 160,
    },
    {
      field: 'run_size',
      headerName: 'Run Size',
      align: 'center',
      sortable: true,
      width: 160,
    },
    {
      field: 'weight',
      headerName: 'Weight',
      sortable: true,
      width: 160,
      align: 'right',
      type: 'number',
    },
    {
      field: 'stock',
      headerName: 'Stock',
      sortable: true,
      width: 160,
      align: 'right',
      type: 'number',
    },
    {
      field: 'pieces_per_pack',
      headerName: 'Pieces Per Pack',
      sortable: true,
      width: 160,
      align: 'right',
      type: 'number',
    },
    {
      field: 'pack_per_bundle',
      headerName: 'Pack Per Bundle',
      sortable: true,
      width: 160,
      align: 'right',
      type: 'number',
    },
    {
      field: 'length',
      headerName: 'Length',
      sortable: true,
      width: 160,
      align: 'right',
      type: 'number',
    },
    {
      field: 'pad_weight',
      headerName: 'Pad Weight',
      sortable: true,
      width: 160,
      align: 'right',
      type: 'number',
    },
    {
      field: 'avg_bale_weight',
      headerName: 'Avg Bale Weight',
      sortable: true,
      width: 160,
      align: 'right',
      type: 'number',
    },
    {
      field: 'run_weight',
      headerName: 'Run Weight',
      sortable: true,
      width: 160,
      align: 'right',
      type: 'number',
    },
    {
      field: 'extra_cost',
      headerName: 'Extra Cost',
      sortable: true,
      width: 160,
    },
    {
      field: 'price_per_pound',
      headerName: 'Price Per Pound',
      sortable: true,
      width: 160,
    },
    {
      field: 'price_per_piece',
      headerName: 'Price Per Piece',
      sortable: true,
      width: 160,
    },
    {
      field: 'total_cost',
      headerName: 'Total Cost',
      sortable: true,
      width: 160,
    },
    {
      field: 'total_weight',
      headerName: 'Total Weight',
      sortable: true,
      width: 160,
      align: 'right',
      type: 'number',
    },
  ];

  const [columns, setColumns] = useState<typeof defColumns>(
    getLocaleStorageItem('prodInfoColumns', defColumns, renderCells)
  );

  const updateColumns = (columnModel: GridColumnVisibilityModel) => {
    const newColumns = columns;
    newColumns.map((column: { [key: string]: any }) => {
      column.hide = !columnModel[column.field];
      return column;
    });
    setColumns(newColumns);
    setLocaleStorageItem('prodInfoColumns', newColumns);
  };

  const updateColumnOrder = (columnModel: GridColumnOrderChangeParams) => {
    const newColumns = columns;
    const movedColumn = newColumns.splice(columnModel.oldIndex, 1)[0];
    newColumns.splice(columnModel.targetIndex, 0, movedColumn);
    setColumns(newColumns);
    setLocaleStorageItem('prodInfoColumns', newColumns);
  };

  const updatePinnedColumns = (columnModel: GridPinnedColumns) => {
    const newColumns = columns;
    newColumns.map((column: { [key: string]: any }) => {
      if (columnModel.left?.indexOf(column.field)) {
        column.pinned = 'left';
      } else if (columnModel.right?.indexOf(column.field)) {
        column.pinned = 'right';
      } else {
        column.pinned = '';
      }
      return column;
    });

    setColumns(newColumns);
    setLocaleStorageItem('prodInfoColumns', newColumns);
  };
  return (
    <GridDisplay
      columns={columns}
      rows={orders ?? []}
      table="productioninformation"
      isloading={isLoading}
      updateColumns={updateColumns}
      updateColumnOrder={updateColumnOrder}
      updatePinnedColumns={updatePinnedColumns}
      columnLocalKey="prodInfoColumns"
    />
  );
};

export default ProductionDataDisplay;
