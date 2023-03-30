import { useSnackbar } from 'notistack';
import React, { FC, useEffect } from 'react';

const ScreenLessReport: FC<{
  fireFunction: boolean;
  reportFunction: () => void | null;
  errorMessage: string;
}> = ({ fireFunction, reportFunction, errorMessage }) => {
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (fireFunction) {
      const res = reportFunction();
      if (!res) {
        enqueueSnackbar(errorMessage, {
          variant: 'error',
        });
      }
    }
  }, [enqueueSnackbar, errorMessage, fireFunction, reportFunction]);

  return <></>;
};

export default ScreenLessReport;
