import { Grid, IconButton } from '@mui/material';
import {
  GridColumnOrderChangeParams,
  GridColumnVisibilityModel,
} from '@mui/x-data-grid-pro';
import React, { useContext, useState } from 'react';
import {
  getLocaleStorageItem,
  setLocaleStorageItem,
} from '../../../utils/Helpers';
import { deleteCertificates, getCertificates } from '../api/certifications';

import EditIcon from '@mui/icons-material/Edit';
import PageviewIcon from '@mui/icons-material/Pageview';
import { blue } from '@mui/material/colors';
import Tooltip from '@mui/material/Tooltip';
import { useQuery } from 'react-query';
import { StateContextType } from '../../../@types/statecontext';
import { IDisplay } from '../../../@types/tracetypes';
import GridDisplay from '../../../components/ui/GridDisplay';
import { StateContext } from '../../../context/StateContext';
import { ReducerActionType } from '../../../utils/reducers';

const CertificationDisplay: React.FC<IDisplay> = ({ reducer }) => {
  const { setViewing } = useContext(StateContext) as StateContextType;

  const { isLoading, data: certificatons } = useQuery(
    'certifications',
    getCertificates
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
      hide: true,
      width: 20,
    },
    {
      field: 'certification',
      headerName: 'Certification',
      sortable: true,
      width: 160,
      hide: false,
    },
    {
      field: 'description',
      headerName: 'Description',
      sortable: true,
      width: 450,
      hide: false,
    },
  ];

  const [columns, setColumns] = useState<typeof defColumns>(
    getLocaleStorageItem('certificationsColumns', defColumns, renderCells)
  );

  const updateColumns = (columnModel: GridColumnVisibilityModel) => {
    const newColumns = columns;
    newColumns.map((column: { [key: string]: any }) => {
      column.hide = !columnModel[column.field];
      return column;
    });
    setColumns(newColumns);
    setLocaleStorageItem('certificationsColumns', newColumns);
  };

  const updateColumnOrder = (columnModel: GridColumnOrderChangeParams) => {
    const newColumns = columns;
    const movedColumn = newColumns.splice(columnModel.oldIndex, 1)[0];
    newColumns.splice(columnModel.targetIndex, 0, movedColumn);
    setColumns(newColumns);
    setLocaleStorageItem('certificationsColumns', newColumns);
  };

  return (
    <GridDisplay
      columns={columns}
      rows={certificatons ?? []}
      table="certifications"
      isloading={isLoading}
      deleteApi={deleteCertificates}
      moduleName={'Certifications'}
      updateColumns={updateColumns}
      updateColumnOrder={updateColumnOrder}
      columnLocalKey="certificationsColumns"
    />
  );
};

export default CertificationDisplay;
