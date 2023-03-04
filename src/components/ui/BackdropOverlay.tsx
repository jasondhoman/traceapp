import React, { useContext } from 'react';

import Backdrop from '@mui/material/Backdrop';
import { StateContextType } from '../../@types/statecontext';
import { StateContext } from '../../context/StateContext';

export default function BackdropOverlay() {
  const { isLoading } = useContext(StateContext) as StateContextType;

  return (
    <div>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        {/* <Fade
          in={isLoading}
          style={{
            transitionDelay: isLoading ? "800ms" : "0ms",
          }}
          unmountOnExit
        >
          <CircularProgress color="inherit" />
        </Fade> */}
      </Backdrop>
    </div>
  );
}
