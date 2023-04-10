import { Grid, IconButton } from '@mui/material';
import {
  GridColumnOrderChangeParams,
  GridColumnVisibilityModel,
} from '@mui/x-data-grid-pro';
import React, { useContext, useState } from 'react';
import {
  formatAsCurrency,
  formatShortDate,
  getLocaleStorageItem,
  setLocaleStorageItem,
} from '../../../utils/helpers';
import { deleteCreditMemos, getCreditMemos } from '../api/creditmemo';

import CheckIcon from '@mui/icons-material/Check';
import EditIcon from '@mui/icons-material/Edit';
import PageviewIcon from '@mui/icons-material/Pageview';
import { blue } from '@mui/material/colors';
import { useQuery } from 'react-query';
import { StateContextType } from '../../../@types/statecontext';
import { IDisplay } from '../../../@types/tracetypes';
import GridDisplay from '../../../components/ui/GridDisplay';
import { StateContext } from '../../../context/StateContext';
import { ReducerActionType } from '../../../utils/reducers';

const CreditMemoDisplay: React.FC<IDisplay> = ({ reducer }) => {
  const { setViewing } = useContext(StateContext) as StateContextType;

  const { isLoading, data: creditmemos } = useQuery(
    'creditmemos',
    getCreditMemos
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
        aria-label="Edit a Creditmemo"
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
    used: (params: any) => {
      return (
        <Grid container justifyContent="center">
          {params.value && <CheckIcon />}
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
    price_in_lbs: (params: any) => {
      return (
        <Grid container justifyContent="flex-end">
          {formatAsCurrency(params.value)}
        </Grid>
      );
    },
    price_per: (params: any) => {
      return (
        <Grid container justifyContent="flex-end">
          {formatAsCurrency(params.value)}
        </Grid>
      );
    },
    credit_amount: (params: any) => {
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

    {
      field: 'id',
      headerName: 'Memo #',
      sortable: true,
      hide: false,
      width: 120,
      resizable: true,
      align: 'right',
    },
    {
      field: 'used',
      headerName: 'Credit Used',
      resizeable: true,
      sortable: true,
      width: 120,
      resizable: true,
      align: 'right',
      hide: false,
    },
    {
      field: 'tracking',
      headerName: 'Tracking',
      resizeable: true,
      sortable: true,
      width: 120,
      resizable: true,
      align: 'right',
      hide: false,
    },
    {
      field: 'purchase_order',
      headerName: 'PO',
      sortable: true,
      width: 120,
      resizable: true,
      align: 'center',
      hide: false,
    },
    {
      field: 'customer',
      headerName: 'Name',
      sortable: true,
      width: 220,
      resizable: true,
      align: 'center',
      hide: false,
    },
    {
      field: 'order_date',
      headerName: 'Order Date',
      sortable: true,
      width: 120,
      resizable: true,
      align: 'center',
      hide: false,
    },
    {
      field: 'ship_date',
      headerName: 'Ship Date',
      sortable: true,
      width: 120,
      resizable: true,
      align: 'center',
      hide: false,
    },
    {
      field: 'qty',
      headerName: 'qty',
      sortable: true,
      width: 120,
      resizable: true,
      align: 'right',
      hide: false,
    },
    {
      field: 'grade',
      headerName: 'grade',
      sortable: true,
      width: 120,
      resizable: true,
      align: 'center',
      hide: false,
    },
    {
      field: 'tag_size',
      headerName: 'Tag Size',
      sortable: true,
      width: 120,
      resizable: true,
      align: 'center',
      hide: false,
    },
    {
      field: 'pack_set',
      headerName: 'Pack Set',
      sortable: true,
      width: 120,
      resizable: true,
      align: 'right',
      hide: false,
    },
    {
      field: 'pack_bundle',
      headerName: 'Pack Bundle',
      sortable: true,
      width: 120,
      resizable: true,
      align: 'right',
      hide: false,
    },
    {
      field: 'credit_weight',
      headerName: 'Credit Weight',
      sortable: true,
      width: 120,
      resizable: true,
      align: 'right',
      hide: false,
    },
    {
      field: 'price_in_lbs',
      headerName: 'Price In LBS',
      sortable: true,
      width: 120,
      resizable: true,
      align: 'right',
      hide: false,
    },
    {
      field: 'price_per',
      headerName: 'Price Per',
      sortable: true,
      width: 120,
      resizable: true,
      align: 'center',
      hide: false,
    },
    {
      field: 'credit_amount',
      headerName: 'Credit Amount',
      sortable: true,
      width: 120,
      resizable: true,
      align: 'right',
      hide: false,
    },
    {
      field: 'reference_invoice',
      headerName: 'Reference Invoice',
      sortable: true,
      width: 160,
      resizable: true,
      align: 'right',
      hide: false,
    },
    {
      field: 'reference_bol',
      headerName: 'Reference BOL',
      sortable: true,
      width: 120,
      resizable: true,
      align: 'center',
      hide: false,
    },
    {
      field: 'terms',
      headerName: 'Terms',
      sortable: true,
      width: 120,
      resizable: true,
      align: 'right',
      hide: false,
    },
  ];

  const [columns, setColumns] = useState<typeof defColumns>(
    getLocaleStorageItem('creditMemoColumns', defColumns, renderCells)
  );

  const updateColumns = (columnModel: GridColumnVisibilityModel) => {
    const newColumns = columns;
    newColumns.map((column: { [key: string]: any }) => {
      column.hide = !columnModel[column.field];
      return column;
    });
    setColumns(newColumns);
    setLocaleStorageItem('creditMemoColumns', newColumns);
  };

  const updateColumnOrder = (columnModel: GridColumnOrderChangeParams) => {
    const newColumns = columns;
    const movedColumn = newColumns.splice(columnModel.oldIndex, 1)[0];
    newColumns.splice(columnModel.targetIndex, 0, movedColumn);
    setColumns(newColumns);
    setLocaleStorageItem('creditMemoColumns', newColumns);
  };
  return (
    <GridDisplay
      columns={columns}
      rows={creditmemos ?? []}
      table="creditmemos"
      isloading={isLoading}
      deleteApi={deleteCreditMemos}
      updateColumns={updateColumns}
      updateColumnOrder={updateColumnOrder}
      columnLocalKey="creditMemoColumns"
    />
  );
};

export default CreditMemoDisplay;
