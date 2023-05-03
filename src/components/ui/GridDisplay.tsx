import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
} from '@mui/material';
import {
  DataGridPro,
  GRID_CHECKBOX_SELECTION_COL_DEF,
  GridColumnOrderChangeParams,
  GridColumnResizeParams,
  GridColumnVisibilityModel,
  GridPinnedColumns,
  GridRowId,
  GridSelectionModel,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarExport,
  GridToolbarFilterButton,
  GridToolbarQuickFilter,
} from '@mui/x-data-grid-pro';
import React, { useEffect, useState } from 'react';

import ArchiveIcon from '@mui/icons-material/Archive';
import DeleteIcon from '@mui/icons-material/Delete';
import Settings from '@mui/icons-material/Settings';
import LoadingButton from '@mui/lab/LoadingButton';
import LinearProgress from '@mui/material/LinearProgress';
import Paper from '@mui/material/Paper';
import { LicenseInfo } from '@mui/x-license-pro';
import { AxiosResponse } from 'axios';
import { useSnackbar } from 'notistack';
import CustomNoRowsOverlay from './CustomerNoRowsOverlay';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
LicenseInfo.setLicenseKey(`${import.meta.env.VITE_DATA_TOKEN}`);

interface IGridDisplay {
  className?: string;
  columns: any;
  rows: any;
  isloading?: boolean;
  table?: string;
  moduleName?: string;
  deleteApi?: (
    ids: Set<GridRowId>
  ) => Promise<AxiosResponse<any, any> | undefined>;
  archiveApi?: (
    ids: Set<GridRowId>
  ) => Promise<AxiosResponse<any, any> | undefined>;
  updateColumns?: (columnModel: GridColumnVisibilityModel) => void;
  updateColumnOrder?: (params: GridColumnOrderChangeParams) => void;
  updatePinnedColumns?: (params: GridPinnedColumns) => void;
  updateColumnSize?: (params: GridColumnResizeParams) => void;
  columnLocalKey?: string;
  hideToolbar?: boolean;
  density?: 'compact' | 'standard' | 'comfortable';
}

const GridDisplay: React.FC<IGridDisplay> = ({
  className,
  columns,
  rows,
  isloading,
  table = '',
  deleteApi,
  archiveApi,
  updateColumns,
  updateColumnOrder,
  updateColumnSize,
  updatePinnedColumns: udpatePinnedColumns,
  moduleName,
  columnLocalKey,
  density,
  hideToolbar,
}) => {
  interface IRow {
    id: number;
  }
  const [grid_rows, setRows] = useState(rows);
  const [selectionModel, setSelectionModel] = useState<GridSelectionModel>([]);
  const [pageSize, setPageSize] = useState(50);
  const [left] = useState<string[]>(() => {
    if (columns) {
      return [
        GRID_CHECKBOX_SELECTION_COL_DEF.field,
        ...columns
          // eslint-disable-next-line array-callback-return
          .filter((c: any) => {
            if (c.pinned === 'left') {
              return c;
            }
          })
          .map((c: any) => c.field),
      ];
    }
    return [];
  });
  const [right] = useState<string[]>(() => {
    if (columns) {
      const rightArr = [
        ...columns
          // eslint-disable-next-line array-callback-return
          .filter((c: any) => {
            if (c.pinned === 'right' && c.field !== 'actions') {
              return c;
            }
          })
          .map((c: any) => c.field),
      ];
      rightArr.push('actions');
      return rightArr;
    }
    return ['actions'];
  });
  const [opened, setOpened] = useState('');

  const [deleteEnabled, setEnabled] = useState(true);
  const [open, setOpen] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDeleteArchive = () => {
    if (opened === 'Delete') {
      deleteRows();
    } else if (opened === 'Archive') {
      archiveRows();
    }
  };

  const deleteRows = async () => {
    const selectedIDs = new Set(selectionModel);
    // you can call an API to delete the selected IDs
    // and get the latest results after the deletion
    // then call setRows() to update the data locally here

    setOpen(false);
    if (deleteApi) {
      interface IReturn {
        in_use: number[];
        message?: string;
      }
      const res: AxiosResponse | undefined = await deleteApi(selectedIDs);
      if (res) {
        const return_list: IReturn = res.data;
        if (selectedIDs.size - return_list.in_use.length > 0) {
          enqueueSnackbar(
            res.status === 200
              ? `${
                  selectedIDs.size - return_list.in_use.length
                } - Records Successfully Deleted`
              : 'Error Deleting',
            {
              variant: res.status === 200 ? `success` : `error`,
            }
          );
        }
        // Only remove if we get a good response
        if (res.status === 200) {
          if (return_list.in_use.length > 0) {
            enqueueSnackbar(
              `${return_list.in_use.length} - ${
                return_list.message ??
                "Records were in use and couldn't be deleted"
              }`,
              {
                variant: `info`,
              }
            );
          }
          return_list.in_use.forEach((e) => selectedIDs.delete(e));
          setRows((r: IRow[]) => r.filter((x) => !selectedIDs.has(x.id)));
        }

        if (res.status !== 200) {
          enqueueSnackbar('Error Deleting ' + res.status + ' return code', {
            variant: `error`,
          });
        }
      }
    }
  };

  const archiveRows = async () => {
    const selectedIDs = new Set(selectionModel);
    // you can call an API to delete the selected IDs
    // and get the latest results after the deletion
    // then call setRows() to update the data locally here

    setOpen(false);
    if (archiveApi) {
      interface IReturn {
        in_use: number[];
        message?: string;
      }
      const res: AxiosResponse | undefined = await archiveApi(selectedIDs);
      if (res) {
        const return_list: IReturn = res.data;
        if (selectedIDs.size - return_list.in_use.length > 0) {
          enqueueSnackbar(
            res.status === 200
              ? `${
                  selectedIDs.size - return_list.in_use.length
                } - Records Successfully Archived`
              : 'Error Deleting',
            {
              variant: res.status === 200 ? `success` : `error`,
            }
          );
        }
        // Only remove if we get a good response
        if (res.status === 200) {
          if (return_list.in_use.length > 0) {
            enqueueSnackbar(
              `${return_list.in_use.length} - ${
                return_list.message ??
                "Records were not invoiced and couldn't be archived"
              }`,
              {
                variant: `info`,
              }
            );
          }
          return_list.in_use.forEach((e) => selectedIDs.delete(e));
          setRows((r: IRow[]) => r.filter((x) => !selectedIDs.has(x.id)));
        }

        if (res.status !== 200) {
          enqueueSnackbar('Error Archiving ' + res.status + ' return code', {
            variant: `error`,
          });
        }
      }
    }
  };

  function CustomToolbar() {
    return (
      <GridToolbarContainer className="px-3 py-2">
        {hideToolbar ?? (
          <Grid
            container
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Grid item>
              <GridToolbarQuickFilter />
            </Grid>
            <Grid>
              {archiveApi && (
                <LoadingButton
                  disabled={deleteEnabled}
                  size="small"
                  startIcon={<ArchiveIcon />}
                  variant="text"
                  color="error"
                  style={{ boxShadow: 'none' }}
                  onClick={() => {
                    setOpened('Archive');
                    handleClickOpen();
                  }}
                >
                  Archive Selected
                </LoadingButton>
              )}
              {deleteApi && (
                <LoadingButton
                  disabled={deleteEnabled}
                  size="small"
                  startIcon={<DeleteIcon />}
                  variant="text"
                  color="error"
                  style={{ boxShadow: 'none' }}
                  onClick={() => {
                    setOpened('Delete');
                    handleClickOpen();
                  }}
                >
                  Delete Selected
                </LoadingButton>
              )}
              {columnLocalKey && (
                <LoadingButton
                  size="small"
                  startIcon={<Settings />}
                  variant="text"
                  style={{ boxShadow: 'none' }}
                  onClick={() => setResetOpen(true)}
                >
                  Reset Grid
                </LoadingButton>
              )}
              <GridToolbarColumnsButton />
              <GridToolbarFilterButton />
              <GridToolbarDensitySelector />
              <GridToolbarExport />
            </Grid>
          </Grid>
        )}
      </GridToolbarContainer>
    );
  }

  const handleGridReset = () => {
    setResetOpen(false);
    localStorage.removeItem(columnLocalKey ?? '');
    window.location.reload();
  };

  useEffect(() => {
    setRows(rows);
  }, [rows]);

  return (
    <Paper
      component="div"
      elevation={0}
      style={{ height: '80vh', width: '100%' }}
    >
      <Dialog
        open={resetOpen}
        onClose={() => setResetOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {`Reset Selected ${moduleName ?? ''}`}
          <Divider className="bg-dark" />
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {`This action will reset grid back default for selected ${moduleName}`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setResetOpen(false)} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={handleGridReset}
            variant="contained"
            style={{ boxShadow: 'none' }}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {`${opened} Selected ${moduleName ?? ''}`}
          <Divider className="bg-dark" />
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {`This action will mark all selected ${
              moduleName ?? 'records'
            } as ${opened.toLowerCase()}d.`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={handleDeleteArchive}
            variant="contained"
            style={{ boxShadow: 'none' }}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      <DataGridPro
        className={className}
        density={density ?? 'standard'}
        initialState={{
          pinnedColumns: {
            left: left,
            right: right,
          },
        }}
        // pinnedColumns={{
        //   left: left,
        //   right: right,
        // }}
        rows={grid_rows}
        columns={columns}
        // pageSize={10}
        rowsPerPageOptions={[10, 25, 50, 100, 500]}
        pageSize={pageSize}
        onPageSizeChange={(newPage) => setPageSize(newPage)}
        pagination
        checkboxSelection
        onColumnVisibilityModelChange={(
          model: GridColumnVisibilityModel
          // details: GridCallbackDetails
        ) => {
          if (!updateColumns) return;
          updateColumns(model);
        }}
        disableSelectionOnClick
        loading={isloading}
        componentsProps={{
          toolbar: { showQuickFilter: true },
        }}
        onSelectionModelChange={(newSelectionModel) => {
          setEnabled(newSelectionModel.length === 0);
          setSelectionModel(newSelectionModel);
        }}
        selectionModel={selectionModel}
        getRowClassName={(params) =>
          params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
        }
        onColumnOrderChange={(
          params: GridColumnOrderChangeParams
          // event: MuiEvent<any>,
          // details: GridCallbackDetails
        ) => {
          if (!updateColumnOrder) return;
          updateColumnOrder(params);
        }}
        onPinnedColumnsChange={(
          pinnedColumns: GridPinnedColumns
          // details: GridCallbackDetails<any>
        ) => {
          if (!udpatePinnedColumns) return;
          udpatePinnedColumns(pinnedColumns);
        }}
        onColumnResize={(params: GridColumnResizeParams) => {
          if (!updateColumnSize) return;
          updateColumnSize(params);
        }}
        components={{
          Toolbar: CustomToolbar,
          NoRowsOverlay: CustomNoRowsOverlay,
          LoadingOverlay: LinearProgress,
        }}
      />
    </Paper>
  );
};

export default GridDisplay;
