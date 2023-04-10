import { Grid, Link, Tooltip } from '@mui/material';
import {
  GridColumnOrderChangeParams,
  GridColumnVisibilityModel,
} from '@mui/x-data-grid-pro';
import React, { useContext, useState } from 'react';
import {
  formatAsCurrency,
  getLocaleStorageItem,
  setLocaleStorageItem,
} from '../../../utils/helpers';
import { deleteCustomers, getCustomers } from '../api/customer';

import CheckIcon from '@mui/icons-material/Check';
import EditIcon from '@mui/icons-material/Edit';
import PageviewIcon from '@mui/icons-material/Pageview';
import { IconButton } from '@mui/material';
import { blue } from '@mui/material/colors';
import { useQuery } from 'react-query';
import { StateContextType } from '../../../@types/statecontext';
import { IDisplay } from '../../../@types/tracetypes';
import GridDisplay from '../../../components/ui/GridDisplay';
import { StateContext } from '../../../context/StateContext';
import { ReducerActionType } from '../../../utils/reducers';

const CustomerDisplay: React.FC<IDisplay> = ({ reducer }) => {
  const { setViewing } = useContext(StateContext) as StateContextType;
  const { isLoading, data: customers } = useQuery('customers', getCustomers);

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
        aria-label="Edit a Customer"
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
        aria-label="View a Customer"
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
    salesperson: (params: any) => {
      let id = null;
      let display_name = '';
      if (params.value) {
        const parts = params.value.split('-');
        id = parts.shift();
        display_name = parts.join('-');
      }
      return (
        <Grid container justifyContent="center">
          <Tooltip title="View Salesperson" placement="top">
            {id ? (
              <Link href={`/salesperson/${id}`} target="new">
                {display_name}
              </Link>
            ) : (
              <Link>{display_name}</Link>
            )}
          </Tooltip>
        </Grid>
      );
    },
    transport_cost: (params: any) => {
      return (
        <Grid container justifyContent="flex-end">
          {formatAsCurrency(params.value)}
        </Grid>
      );
    },
    certification: (params: any) => {
      let id = null;
      let display_name = '';
      if (params.value) {
        const parts = params.value.split('-');
        id = parts.shift();
        display_name = parts.join('-');
      }
      return (
        <Grid container justifyContent="center">
          <Tooltip title="View Certificate" placement="top">
            {id ? (
              <Link href={`/certifications/${id}`} target="new">
                {display_name}
              </Link>
            ) : (
              <Link>{display_name}</Link>
            )}
          </Tooltip>
        </Grid>
      );
    },
    c_of_a: (params: any) => {
      return (
        <Grid container justifyContent="center">
          {params.value === 'Y' && <CheckIcon />}
        </Grid>
      );
    },
    factor: (params: any) => {
      return (
        <Grid container justifyContent="center">
          {params.value === 'Y' && <CheckIcon />}
        </Grid>
      );
    },

    cod_sales: (params: any) => {
      return (
        <Grid container justifyContent="center">
          {params.value === 'Y' && <CheckIcon />}
        </Grid>
      );
    },
    active_disc: (params: any) => {
      return (
        <Grid container justifyContent="center">
          {params.value === 'Y' && <CheckIcon />}
        </Grid>
      );
    },
    discount: (params: any) => {
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
      width: 120,
    },
    {
      field: 'id',
      headerName: 'Id',
      description: 'This column has a value getter and is not sortable.',
      sortable: true,
      width: 20,
      resizable: true,
      hide: true,
    },
    {
      field: 'company_name',
      headerName: 'Name',
      sortable: true,
      width: 160,
      resizable: true,
    },
    {
      field: 'ap_contact',
      headerName: 'AP Contact',
      sortable: true,
      width: 160,
      resizable: true,
    },
    {
      field: 'purchasing_agent',
      headerName: 'Purchasing Agent',
      sortable: true,
      width: 160,
      resizable: true,
    },
    {
      field: 'salesperson',
      headerName: 'Salesperson',
      sortable: true,
      width: 160,
      resizable: true,
    },
    {
      field: 'transport',
      headerName: 'Transport',
      sortable: true,
      width: 160,
      resizable: true,
    },
    {
      field: 'transport_cost',
      headerName: 'Transport Cost',
      sortable: true,
      width: 160,
      resizable: true,
    },
    {
      field: 'certification',
      headerName: 'Certification',
      sortable: true,
      width: 160,
      resizable: true,
    },
    {
      field: 'c_of_a',
      headerName: 'C OF A',
      sortable: true,
      width: 160,
      resizable: true,
      renderCell: (params: any) => {
        return (
          <Grid container justifyContent="center">
            {params.value === 'Y' && <CheckIcon />}
          </Grid>
        );
      },
    },
    {
      field: 'factor',
      headerName: 'Factor',
      sortable: true,
      width: 160,
      resizable: true,
      renderCell: (params: any) => {
        return (
          <Grid container justifyContent="center">
            {params.value === 'Y' && <CheckIcon />}
          </Grid>
        );
      },
    },
    {
      field: 'terms',
      headerName: 'Terms',
      sortable: true,
      width: 160,
      resizable: true,
    },
    {
      field: 'cod_sales',
      headerName: 'COD Sales',
      sortable: true,
      width: 160,
      resizable: true,
      renderCell: (params: any) => {
        return (
          <Grid container justifyContent="center">
            {params.value === 'Y' && <CheckIcon />}
          </Grid>
        );
      },
    },
    {
      field: 'active_disc',
      headerName: 'Active Discount',
      sortable: true,
      width: 160,
      resizable: true,
      renderCell: (params: any) => {
        return (
          <Grid container justifyContent="center">
            {params.value === 'Y' && <CheckIcon />}
          </Grid>
        );
      },
    },
    {
      field: 'discount',
      headerName: 'Discount',
      sortable: true,
      width: 160,
      resizable: true,
      renderCell: (params: any) => {
        return (
          <Grid container justifyContent="flex-end">
            {formatAsCurrency(params.value)}
          </Grid>
        );
      },
    },
  ];
  const [columns, setColumns] = useState<typeof defColumns>(
    getLocaleStorageItem('customerColumns', defColumns, renderCells)
  );

  const updateColumns = (columnModel: GridColumnVisibilityModel) => {
    const newColumns = columns;
    newColumns.map((column: { [key: string]: any }) => {
      column.hide = !columnModel[column.field];
      return column;
    });
    setColumns(newColumns);
    setLocaleStorageItem('customerColumns', newColumns);
  };

  const updateColumnOrder = (columnModel: GridColumnOrderChangeParams) => {
    const newColumns = columns;
    const movedColumn = newColumns.splice(columnModel.oldIndex, 1)[0];
    newColumns.splice(columnModel.targetIndex, 0, movedColumn);
    setColumns(newColumns);
    setLocaleStorageItem('customerColumns', newColumns);
  };

  return (
    <GridDisplay
      columns={columns}
      rows={customers ?? []}
      table="customers"
      isloading={isLoading}
      moduleName="Customers"
      deleteApi={deleteCustomers}
      updateColumns={updateColumns}
      updateColumnOrder={updateColumnOrder}
      columnLocalKey="customerColumns"
    />
  );
};

export default CustomerDisplay;
