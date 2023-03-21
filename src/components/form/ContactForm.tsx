//React
import React, { useContext } from 'react';

//UI Components
import { Grid } from '@mui/material';
import GridField from '../ui/GridField';
//Context
import { StateContext } from '../../context/StateContext';
//Types
import { StateContextType } from '../../@types/statecontext';
import StateSelect from './StateSelect';

interface IContactForm {
  state: any;
  setter: React.Dispatch<React.SetStateAction<any>>;
  contactType: string;
  className?: string;
  address?: boolean;
  cell?: boolean;
  phone?: boolean;
  email?: boolean;
  fax?: boolean;
  ext?: boolean;
}

/**
 * Contact form
 * @param {IContactForm} state State for component this is expected to be an IContactForm interface
 * @param {Function} setter Setter associated with state
 * @param {string} contactType string that is used to generate an id`${contactType}...`
 * @param {string} className string of classnames
 * @param {number} size column width of grid
 */
const ContactForm: React.FC<IContactForm> = ({
  className,
  state,
  setter,
  contactType,
  address,
  cell,
  phone,
  email,
  fax,
  ext,
}) => {
  const { handleChange } = useContext(StateContext) as StateContextType;
  const changeHandler = (e: React.SyntheticEvent) => {
    handleChange(e, setter);
  };

  return (
    <Grid
      container
      className={className ?? ''}
      direction="row"
      justifyContent="space-center"
      alignItems="center"
      columnSpacing={2}
      rowSpacing={1}
    >
      <Grid container direction="row" wrap="nowrap">
        <GridField
          size={16}
          id={`${contactType}Name`}
          label="Name"
          name="name"
          inputProps={{ maxLength: 55 }}
          onChange={changeHandler}
          value={state.name}
          fullWidth
        />
      </Grid>
      {address && (
        <Grid container direction="row" wrap="nowrap">
          <GridField
            size={16}
            id={`${contactType}Address1`}
            label="Address"
            name="address1"
            inputProps={{ maxLength: 40 }}
            onChange={(e: React.SyntheticEvent) => handleChange(e, setter)}
            value={state.address1}
            fullWidth
          />
        </Grid>
      )}
      {address && (
        <Grid container direction="row" wrap="nowrap">
          <GridField
            size={16}
            id={`${contactType}Address2`}
            label="Address"
            name="address2"
            inputProps={{ maxLength: 40 }}
            onChange={(e: React.SyntheticEvent) => handleChange(e, setter)}
            value={state.address2}
            fullWidth
          />
        </Grid>
      )}
      {address && (
        <Grid
          container
          direction="row"
          wrap="nowrap"
          justifyContent="space-evenly"
          alignItems="center"
          columnSpacing={1}
        >
          <GridField
            size={6}
            id={`${contactType}City`}
            label="City"
            name="city"
            inputProps={{ maxLength: 40 }}
            onChange={(e: React.SyntheticEvent) => handleChange(e, setter)}
            value={state.city}
            fullWidth
          />
          <Grid
            item
            xs={3}
            justifyContent="center"
            alignContent="center"
            className="mt-2"
          >
            <StateSelect
              name="state"
              state={state.state}
              changeState={(id) => {
                setter((prevState: any) => {
                  return {
                    ...prevState,
                    state: id,
                  };
                });
              }}
            />
          </Grid>
          <GridField
            size={3}
            id={`${contactType}Zip`}
            label="Zip"
            name="zip"
            inputProps={{ maxLength: 10 }}
            onChange={(e: React.SyntheticEvent) => handleChange(e, setter)}
            value={state.zip}
            fullWidth
          />
        </Grid>
      )}
      {phone && (
        <Grid
          container
          direction="row"
          wrap="nowrap"
          justifyContent="flext-start"
          alignItems="flex-end"
          columnSpacing={1}
        >
          <GridField
            size={ext ? 10 : 16}
            id={`${contactType}Phone`}
            label="Phone"
            name="phone"
            mask="   -   -    "
            inputProps={{ maxLength: 12 }}
            setter={setter}
            value={state.phone}
            fullWidth
            numeric
          />
          {ext && (
            <GridField
              size={3}
              id={`${contactType}Ext`}
              label="Ext"
              name="ext"
              inputProps={{ maxLength: 10 }}
              onChange={(e: React.SyntheticEvent) => handleChange(e, setter)}
              value={state.ext}
            />
          )}
        </Grid>
      )}
      {fax && (
        <Grid
          container
          direction="row"
          wrap="nowrap"
          justifyContent="flext-start"
          alignItems="flex-end"
          columnSpacing={2}
        >
          <GridField
            size={16}
            id={`${contactType}Fax`}
            label="Fax"
            name="fax"
            mask="   -   -    "
            inputProps={{ maxLength: 12 }}
            setter={setter}
            value={state.fax}
            fullWidth
            numeric
          />
        </Grid>
      )}
      {cell && (
        <Grid
          container
          direction="row"
          wrap="nowrap"
          justifyContent="flext-start"
          alignItems="flex-end"
          columnSpacing={2}
        >
          <GridField
            size={16}
            id={`${contactType}Cell`}
            label="Cell"
            name="cell"
            mask="   -   -    "
            inputProps={{ maxLength: 12 }}
            setter={setter}
            value={state.cell}
            fullWidth
            numeric
          />
        </Grid>
      )}
      {email && (
        <Grid
          container
          direction="row"
          wrap="nowrap"
          justifyContent="flext-start"
          alignItems="flex-end"
          columnSpacing={2}
        >
          <GridField
            size={16}
            id={`${contactType}Email`}
            label="Email"
            name="email"
            inputProps={{ type: 'email', maxLength: 320 }}
            onChange={(e: React.SyntheticEvent) => handleChange(e, setter)}
            value={state.email}
            fullWidth
          />
        </Grid>
      )}
    </Grid>
  );
};

export default ContactForm;
