import { Grid, IconButton } from '@mui/material';
import {
  GridColumnOrderChangeParams,
  GridColumnResizeParams,
  GridColumnVisibilityModel,
} from '@mui/x-data-grid-pro';
import React, { useContext, useState } from 'react';
import { IDisplay, IOrder } from '../../../@types/tracetypes';
import {
  formatAsCurrency,
  formatShortDate,
  getLocaleStorageItem,
  setLocaleStorageItem,
} from '../../../utils/Helpers';
import { archiveOrders, deleteOrders, getOrders } from '../api/order';

import EditIcon from '@mui/icons-material/Edit';
import PageviewIcon from '@mui/icons-material/Pageview';
import { blue } from '@mui/material/colors';
import { GridPinnedColumns } from '@mui/x-data-grid-pro';
import { useQuery } from 'react-query';
import { StateContextType } from '../../../@types/statecontext';
import GridDisplay from '../../../components/ui/GridDisplay';
import { StateContext } from '../../../context/StateContext';
import { ReducerActionType } from '../../../utils/reducers';
import { useOrderContext } from '../context/OrderContext';

const OrdersDisplay: React.FC<IDisplay> = ({ reducer }) => {
  const { setViewing } = useContext(StateContext) as StateContextType;
  const { setIsUpdate } = useOrderContext();
  const { isLoading, data: orders } = useQuery<IOrder[]>('orders', getOrders);

  const MatEdit = (index: any) => {
    const handleEditClick = () => {
      setViewing(false);
      setIsUpdate(true);
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
        aria-label="Edit a Order"
        onClick={() => handleEditClick()}
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
        aria-label="View a Order"
        onClick={() => handleClick()}
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
    tracking: (params: any) => {
      return (
        <Grid container justifyContent="center">
          {params.value}
        </Grid>
      );
    },
    qty: (params: any) => {
      return (
        <Grid container justifyContent="center">
          {params.value}
        </Grid>
      );
    },
    invoice_number: (params: any) => {
      return (
        <Grid container justifyContent="center">
          {params.value}
        </Grid>
      );
    },
    bill_ladening: (params: any) => {
      return (
        <Grid container justifyContent="center">
          {params.value}
        </Grid>
      );
    },
    order_date: (params: any) => {
      return (
        <Grid container justifyContent="center">
          {formatShortDate(params.value)}
        </Grid>
      );
    },
    ship_date: (params: any) => {
      return (
        <Grid container justifyContent="center">
          {formatShortDate(params.value)}
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
    total_cost: (params: any) => {
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
      pinned: 'right',
      resizeable: false,
    },
    {
      field: 'id',
      headerName: 'Id',
      sortable: true,
      width: 160,
      hide: true,
      pinned: '',
    },
    {
      field: 'company_name',
      headerName: 'Company Name',
      sortable: true,
      width: 160,
      align: 'center',
      pinned: '',
    },
    {
      field: 'tracking',
      headerName: 'Tracking',
      sortable: true,
      width: 160,
      align: 'right',
      pinned: '',
      type: 'number',
      comma: false,
    },
    {
      field: 'purchase_order',
      headerName: 'Purchase Order',
      sortable: true,
      width: 160,
      align: 'right',
      pinned: '',
    },
    {
      field: 'name',
      headerName: 'Name',
      sortable: true,
      width: 160,
      hide: true,
      pinned: '',
    },
    {
      field: 'transport',
      headerName: 'Transport',
      sortable: true,
      width: 160,
      pinned: '',
      hide: true,
    },
    {
      field: 'order_date',
      headerName: 'Order',
      sortable: true,
      width: 160,
      pinned: '',
      hide: true,
      type: 'date',
    },
    {
      field: 'ship_date',
      headerName: 'Ship',
      sortable: true,
      width: 160,
      pinned: '',
      type: 'date',
    },
    {
      field: 'qty',
      headerName: 'Qty',
      sortable: true,
      width: 160,
      type: 'number',
      align: 'right',
      pinned: '',
    },
    {
      field: 'grade',
      headerName: 'Grade',
      sortable: true,
      width: 160,
      pinned: '',
    },
    {
      field: 'tag_size',
      headerName: 'Tag Size',
      sortable: true,
      width: 160,
      pinned: '',
    },
    {
      field: 'run_weight',
      headerName: 'Run Weight',
      sortable: true,
      width: 160,
      type: 'number',
      align: 'right',
      pinned: '',
      hide: true,
    },
    {
      field: 'line',
      headerName: 'Line',
      sortable: true,
      width: 100,
      align: 'center',
      pinned: '',
      hide: true,
    },
    {
      field: 'extra_cost',
      headerName: 'Extra Cost',
      sortable: true,
      width: 160,
      pinned: '',
      hide: true,
    },
    {
      field: 'total_cost',
      headerName: 'Total Cost',
      sortable: true,
      width: 160,
      pinned: '',
    },
    {
      field: 'total_weight',
      headerName: 'Total Weight',
      sortable: true,
      width: 160,
      type: 'number',
      align: 'right',
      pinned: '',
    },

    {
      field: 'fob',
      headerName: 'FOB',
      sortable: true,
      width: 160,
      pinned: '',
      hide: true,
    },
    {
      field: 'delivery',
      headerName: 'Delivery',
      sortable: true,
      width: 160,
      pinned: '',
      hide: true,
    },
    {
      field: 'linter_report',
      headerName: 'Linter',
      sortable: true,
      width: 160,
      pinned: '',
      hide: true,
    },
    {
      field: 'invoice_number',
      headerName: 'Invoice Number',
      sortable: true,
      width: 160,
      pinned: '',
      type: 'number',
    },
    {
      field: 'bill_ladening',
      headerName: 'BOL',
      sortable: true,
      width: 160,
      pinned: '',
      type: 'number',
    },
  ];

  const [columns, setColumns] = useState<typeof defColumns>(
    getLocaleStorageItem('orderColumns', defColumns, renderCells)
  );

  const updateColumns = (columnModel: GridColumnVisibilityModel) => {
    const newColumns = columns;
    newColumns.map((column: { [key: string]: any }) => {
      column.hide = !columnModel[column.field];
      return column;
    });
    setColumns(newColumns);
    setLocaleStorageItem('orderColumns', newColumns);
  };

  const updateColumnOrder = (columnModel: GridColumnOrderChangeParams) => {
    const newColumns = columns;
    const movedColumn = newColumns.splice(columnModel.oldIndex, 1)[0];
    newColumns.splice(columnModel.targetIndex, 0, movedColumn);
    setColumns(newColumns);
    setLocaleStorageItem('orderColumns', newColumns);
  };

  const updatePinnedColumns = (columnModel: GridPinnedColumns) => {
    const newColumns = columns;
    newColumns.map((column: { [key: string]: any }) => {
      if (columnModel.left && columnModel.left?.indexOf(column.field) > -1) {
        column.pinned = 'left';
      } else if (
        columnModel.right &&
        columnModel.right?.indexOf(column.field) > -1
      ) {
        column.pinned = 'right';
      } else {
        column.pinned = '';
      }
      return column;
    });

    setColumns(newColumns);
    setLocaleStorageItem('orderColumns', newColumns);
  };

  const updateSizeColumns = (columnModel: GridColumnResizeParams) => {
    const newColumns = columns;
    newColumns.map((column: { [key: string]: any }) => {
      if (column.field === columnModel.colDef.field) {
        column.width = columnModel.colDef.width;
      }
      return column;
    });
    setColumns(newColumns);
    setLocaleStorageItem('orderColumns', newColumns);
  };

  return (
    <GridDisplay
      columns={columns}
      rows={orders ?? []}
      table="orders"
      isloading={isLoading}
      archiveApi={archiveOrders}
      deleteApi={deleteOrders}
      updateColumns={updateColumns}
      updateColumnOrder={updateColumnOrder}
      updatePinnedColumns={updatePinnedColumns}
      updateColumnSize={updateSizeColumns}
      columnLocalKey="orderColumns"
    />
  );
};

export default OrdersDisplay;
