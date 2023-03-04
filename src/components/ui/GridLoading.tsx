import { Box, Grid, LinearProgress, Paper } from '@mui/material';

import React from 'react';

const GridLoading = () => {
  return (
    <Paper variant="outlined" elevation={0} style={{ width: '100%' }}>
      <Grid
        container
        style={{
          height: '80vh',
        }}
        direction="row"
        justifyContent="center"
        alignItems="center"
      >
        <Box sx={{ width: '70%' }}>
          <LinearProgress />
        </Box>
      </Grid>
    </Paper>
  );
};
export default GridLoading;
