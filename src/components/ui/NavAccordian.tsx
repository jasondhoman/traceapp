import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  Tooltip,
  Typography,
} from '@mui/material';
import React, { useContext } from 'react';

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useSnackbar } from 'notistack';
import { Link } from 'react-router-dom';
import { StateContextType } from '../../@types/statecontext';
import { ILink } from '../../@types/tracetypes';
import { StateContext } from '../../context/StateContext';
import { Icon } from './Icon';

interface INavAccordian {
  open: boolean;
  stateChange: (state: boolean) => void;
  title: string;
  links: ILink[];
}

const NavAccordian: React.FC<INavAccordian> = ({
  open,
  stateChange,
  title,
  links,
}) => {
  const { setSelectedLink } = useContext(StateContext) as StateContextType;
  const { enqueueSnackbar } = useSnackbar();

  const handleSelected = (i: string) => {
    setSelectedLink(i);
  };
  const setClasses = (href: string) => {
    const curr_page_arr = window.location.href.split('/');
    const last_index = curr_page_arr[curr_page_arr.length - 1];
    const h = href.replace('/', '');

    return h === last_index;
  };

  const handleOnClick = async (
    onClickFunc?: () => Promise<void | { message: string }>,
    errorMessage?: string
  ) => {
    if (!onClickFunc) return;
    const res = await onClickFunc();
    if (res?.message) {
      enqueueSnackbar(res.message, {
        variant: 'error',
      });
    }
  };

  return (
    <Accordion
      elevation={0}
      expanded={open}
      onChange={(event: React.SyntheticEvent, expanded: boolean) => {
        stateChange(expanded);
      }}
    >
      <AccordionSummary
        expandIcon={
          <Tooltip title={open ? 'Close Menu' : 'Open Menu'} placement="bottom">
            <IconButton size="small">
              <KeyboardArrowDownIcon className="menu-icon" />
            </IconButton>
          </Tooltip>
        }
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Typography>{title}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        {links.map((link, index) => (
          <List
            onClick={() => handleSelected(link.key)}
            className="link-dark-bg"
            key={index}
          >
            {!link.onClick ? (
              <Link to={link.href}>
                <ListItem key={link.key} className="py-1">
                  <ListItemIcon
                    style={{
                      color: setClasses(link.key) ? '#3f51b5' : '',
                    }}
                  >
                    <Icon ico_string={link.icon} />
                  </ListItemIcon>
                  <span
                    className="text-noWrap"
                    style={{
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {link.text}
                  </span>
                  {setClasses(link.key) && (
                    <Icon ico_string="chevronlefticon" />
                  )}
                </ListItem>
              </Link>
            ) : (
              <Link
                to={window.location.href}
                onClick={() => handleOnClick(link.onClick, link.errorMessage)}
              >
                <ListItem key={link.key} className="py-1">
                  <ListItemIcon
                    style={{
                      color: setClasses(link.key) ? '#3f51b5' : '',
                    }}
                  >
                    <Icon ico_string={link.icon} />
                  </ListItemIcon>
                  <span
                    className="text-noWrap"
                    style={{
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {link.text}
                  </span>
                  {setClasses(link.key) && (
                    <Icon ico_string="chevronlefticon" />
                  )}
                </ListItem>
              </Link>
            )}
          </List>
        ))}
      </AccordionDetails>
    </Accordion>
  );
};

export default NavAccordian;
