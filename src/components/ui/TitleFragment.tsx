import { Divider } from '@mui/material';
import Grid from '@mui/material/Grid';
import React from 'react';

interface ITitleFragment {
  size: any;
  title: string;
  firstDivider?: boolean;
  thin?: boolean;
}

const TitleFragment: React.FC<ITitleFragment> = ({
  size,
  title,
  firstDivider,
  thin,
}) => {
  const font_weight = thin ? 'font-weight-thin' : 'font-weight-bold';

  return (
    <Grid item xs={16} className="py-2 my-0">
      {firstDivider ?? <Divider className="bg-dark" />}
      <Grid
        item
        xs={16}
        component={size}
        className={'text-center py-2 my-0' + font_weight}
        style={{ whiteSpace: 'nowrap' }}
      >
        {title}
      </Grid>
      <Divider className="bg-dark" />
    </Grid>
  );
};

export default TitleFragment;
