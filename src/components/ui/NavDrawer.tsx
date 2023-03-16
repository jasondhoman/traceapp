import { Grid, Tooltip, useTheme } from '@mui/material';
import React, { Suspense, useCallback, useContext } from 'react';
import { AdminLinks, ArchiveLinks, ReportLinks } from '../../utils/Constants';

import MenuIcon from '@mui/icons-material/Menu';
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { CSSProperties } from '@mui/styled-engine';
import { Container } from '@mui/system';
import { useEffect } from 'react';
import { makeStyles } from 'tss-react/mui';
import { AuthContextType } from '../../@types/authcontext';
import { StateContextType } from '../../@types/statecontext';
import { AuthContext } from '../../context/AuthContext';
import { StateContext } from '../../context/StateContext';
import GridLoading from './GridLoading';
import { Icon } from './Icon';
import NavAccordian from './NavAccordian';
import AccountMenu from './UserOptionMenu';

const useStyles = makeStyles<{ drawerWidth: number; mixins: CSSProperties }>()(
  (theme, { drawerWidth, mixins }) => ({
    root: {
      display: 'flex',
      margin: '0 0 60px 0',
    },
    appBar: {
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    appBarShift: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    hide: {
      display: 'none',
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
    drawerPaper: {
      width: drawerWidth,
      backgroundColor: '#efefef',
    },
    drawerHeader: {
      backgroundColor: '#fff',
      display: 'flex',
      alignItems: 'center',
      padding: theme.spacing(0, 1),
      ...mixins,
      justifyContent: 'flex-end',
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      marginLeft: -drawerWidth,
    },
    contentShift: {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    },
  })
);

interface INavDrawer {
  content: React.PropsWithChildren;
}
const NavDrawer: React.FC<React.PropsWithChildren> = ({ children }) => {
  const drawerWidth = 340;
  const theme = useTheme();
  const mixins = theme.mixins.toolbar;
  const { classes, cx } = useStyles({ drawerWidth, mixins });

  const { authenticated, isAdmin, links, user } = useContext(
    AuthContext
  ) as AuthContextType;
  const {
    navOpen,
    setNavDrawerState,
    setNavLoaded,
    navaccordianopen,
    setNavAccordianOpen,
    navadminexpanded,
    setNavAdminOpen,
    navreportexpanded,
    setNavReportOpen,
    navarchiveexpanded,
    setNavArchiveOpen,
  } = useContext(StateContext) as StateContextType;
  const [open, setOpen] = React.useState(navOpen);

  const handleDrawerOpen = useCallback(() => {
    setNavDrawerState(true);
    setOpen(true);
  }, [setNavDrawerState]);

  const handleDrawerClose = useCallback(() => {
    setNavDrawerState(false);
    setOpen(false);
  }, [setNavDrawerState]);

  useEffect(() => {
    if (navOpen) {
      setNavLoaded(false);
      handleDrawerOpen();
    } else {
      handleDrawerClose();
    }
  }, [handleDrawerClose, handleDrawerOpen, navOpen, setNavLoaded]);

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        color="primary"
        elevation={0}
        className={cx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          {authenticated && (
            <Tooltip title="Open Menu">
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                edge="start"
                className={cx(classes.menuButton, open && classes.hide)}
              >
                <MenuIcon />
              </IconButton>
            </Tooltip>
          )}
          {user && (
            <Grid
              container
              direction="row"
              justifyContent="flex-end"
              alignItems="center"
            >
              <AccountMenu />
            </Grid>
          )}
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}
        onClose={() => setNavLoaded(false)}
      >
        <div className={classes.drawerHeader}>
          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
          >
            <Typography variant="h6" noWrap>
              Trace Industries
            </Typography>
          </Grid>

          <Tooltip title="Close Menu">
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === 'ltr' ? (
                <Icon ico_string="chevronlefticon" />
              ) : (
                <Icon ico_string="chevronrighticon" />
              )}
            </IconButton>
          </Tooltip>
        </div>

        <Divider />
        <NavAccordian
          open={navaccordianopen}
          stateChange={setNavAccordianOpen}
          title="Menu Options"
          links={links}
        />
        <NavAccordian
          open={navreportexpanded}
          stateChange={setNavReportOpen}
          title="Reports"
          links={ReportLinks}
        />
        <NavAccordian
          open={navarchiveexpanded}
          stateChange={setNavArchiveOpen}
          title="Archive"
          links={ArchiveLinks}
        />

        {isAdmin && (
          <NavAccordian
            open={navadminexpanded}
            stateChange={setNavAdminOpen}
            title="Admin"
            links={AdminLinks}
          />
        )}
      </Drawer>

      <main
        className={cx(classes.content, {
          [classes.contentShift]: open,
        })}
      >
        <div
          className={classes.drawerHeader}
          style={{ backgroundColor: '#fff' }}
        />
        <Suspense fallback={<GridLoading />}>
          <Container maxWidth={false}>{children}</Container>
        </Suspense>
      </main>
    </div>
  );
};
export default NavDrawer;
