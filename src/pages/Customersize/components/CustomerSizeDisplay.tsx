import { Grid, IconButton } from '@mui/material';
import {
  GridColumnOrderChangeParams,
  GridColumnVisibilityModel,
} from '@mui/x-data-grid';
import React, { useContext, useState } from 'react';
import { ICustomerSize, IDisplay } from '../../../@types/tracetypes';
import {
  formatAsCurrency,
  formatShortDate,
  getLocaleStorageItem,
  setLocaleStorageItem,
} from '../../../utils/Helpers';
import { deleteCustomersizes, getCustomerSizes } from '../api/customersize';

import EditIcon from '@mui/icons-material/Edit';
import PageviewIcon from '@mui/icons-material/Pageview';
import { blue } from '@mui/material/colors';
import { useQuery } from 'react-query';
import { StateContextType } from '../../../@types/statecontext';
import GridDisplay from '../../../components/ui/GridDisplay';
import { StateContext } from '../../../context/StateContext';
import { ReducerActionType } from '../../../utils/reducers';

const CustomerSizeDisplay: React.FC<IDisplay> = ({ reducer }) => {
  const { setViewing } = useContext(StateContext) as StateContextType;

  const { isLoading, data: customersizes } = useQuery<ICustomerSize[]>(
    'customersizes',
    getCustomerSizes
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
        aria-label="Edit a Customer Size"
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
        aria-label="View a Customer Size"
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
    price_per_pound: (params: any) => {
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
    price_date: (params: any) => {
      return (
        <Grid container justifyContent="flex-end">
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
      width: 200,
    },
    {
      field: 'grade',
      headerName: 'Grade',
      sortable: true,
      width: 160,
    },
    {
      field: 'tag_size',
      headerName: 'Tag Size',
      sortable: true,
      width: 160,
    },
    {
      field: 'stock',
      headerName: 'Stock',
      sortable: true,
      width: 160,
      type: 'number',
      align: 'right',
    },
    {
      field: 'pieces_per_pack',
      headerName: 'Pieces Per Pack',
      sortable: true,
      width: 160,
      type: 'number',
      align: 'right',
    },
    {
      field: 'pack_per_bundle',
      headerName: 'Pieces Per Bundle',
      sortable: true,
      width: 160,
      type: 'number',
      align: 'right',
    },
    {
      field: 'run_size',
      headerName: 'Run Size',
      sortable: true,
      width: 160,
      type: 'number',
      align: 'right',
    },
    {
      field: 'run_weight',
      headerName: 'Run Weight',
      sortable: true,
      width: 160,
      type: 'number',
      align: 'right',
    },
    {
      field: 'length',
      headerName: 'Length',
      sortable: true,
      width: 160,
      type: 'number',
      align: 'right',
    },
    {
      field: 'pad_weight',
      headerName: 'Pad Weight',
      sortable: true,
      width: 160,
      type: 'number',
      align: 'right',
    },
    {
      field: 'avg_bale_weight',
      headerName: 'Avg Bale Weight',
      sortable: true,
      width: 160,
      type: 'number',
      align: 'right',
    },
    {
      field: 'min_weight',
      headerName: 'Min Weight',
      sortable: true,
      width: 160,
      type: 'number',
      align: 'right',
    },
    {
      field: 'max_weight',
      headerName: 'Max Weight',
      sortable: true,
      width: 160,
      type: 'number',
      align: 'right',
    },
    {
      field: 'special_instructions',
      headerName: 'Special Instructions',
      sortable: true,
      width: 160,
    },
    {
      field: 'price_per_pound',
      headerName: 'Price Per Pound',
      sortable: true,
      width: 160,
      type: 'number',
      align: 'right',
      renderCell: (params: any) => {
        return (
          <Grid container justifyContent="flex-end">
            {formatAsCurrency(params.value, 4)}
          </Grid>
        );
      },
    },
    {
      field: 'price_per_piece',
      headerName: 'Price Each',
      sortable: true,
      width: 160,
      type: 'number',
      align: 'right',
      renderCell: (params: any) => {
        return (
          <Grid container justifyContent="flex-end">
            {formatAsCurrency(params.value, 4)}
          </Grid>
        );
      },
    },
    {
      field: 'price_date',
      headerName: 'Price Date',
      sortable: true,
      width: 160,
      renderCell: (params: any) => {
        return (
          <Grid container justifyContent="flex-end">
            {formatShortDate(params.value)}
          </Grid>
        );
      },
    },
    {
      field: 'extra_cost',
      headerName: 'Extra Cost',
      sortable: true,
      width: 160,
      renderCell: (params: any) => {
        return (
          <Grid container justifyContent="flex-end">
            {formatAsCurrency(params.value)}
          </Grid>
        );
      },
    },
    {
      field: 'floor_apron',
      headerName: 'Floor Apron',
      sortable: true,
      width: 160,
    },
    {
      field: 'feed',
      headerName: 'Feed',
      sortable: true,
      width: 160,
    },
    {
      field: 'stitcher',
      headerName: 'Stitcher',
      sortable: true,
      width: 160,
    },
  ];
  const [columns, setColumns] = useState<typeof defColumns>(
    getLocaleStorageItem('customerSizeColumns', defColumns, renderCells)
  );

  const updateColumns = (columnModel: GridColumnVisibilityModel) => {
    const newColumns = columns;
    newColumns.map((column: { [key: string]: any }) => {
      column.hide = !columnModel[column.field];
      return column;
    });
    setColumns(newColumns);
    setLocaleStorageItem('customerSizeColumns', newColumns);
  };

  const updateColumnOrder = (columnModel: GridColumnOrderChangeParams) => {
    const newColumns = columns;
    const movedColumn = newColumns.splice(columnModel.oldIndex, 1)[0];
    newColumns.splice(columnModel.targetIndex, 0, movedColumn);
    setColumns(newColumns);
    setLocaleStorageItem('customerSizeColumns', newColumns);
  };

  return (
    <GridDisplay
      columns={columns}
      rows={customersizes ?? []}
      table="customersizes"
      isloading={isLoading}
      moduleName="Customer Size"
      deleteApi={deleteCustomersizes}
      updateColumns={updateColumns}
      updateColumnOrder={updateColumnOrder}
      columnLocalKey="customerSizeColumns"
    />
  );
};

export default CustomerSizeDisplay;
