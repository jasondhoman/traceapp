import { Reducer } from 'react';

export const initial_page_state = {
  tab_id: null,
  tablabel: '',
  disabled: false,
  id: null,
  data: null,
};

export interface IAction {
  type: string;
}
export interface IReducer {
  type: string;
  payload: any;
}

export interface IPageState {
  tab_id?: number | null;
  id?: number | null;
  tablabel?: string;
  disabled?: boolean;
  data?: any | null;
  moduleName?: string;
}

export enum ReducerActionType {
  SET_TAB_ID,
  SET_ID,
  TABLABEL,
  DISABLED,
  SET_DATA,
  SET_ERROR,
  CANCEL,
  CREATEANDSTAY,
}

export type SetPageState = {
  type: ReducerActionType;
  payload: IPageState;
};

export type ReducerAction = SetPageState;

export const pageReducer: Reducer<IPageState, ReducerAction> = (
  state,
  action
) => {
  switch (action.type) {
    case ReducerActionType.SET_TAB_ID:
      return {
        ...state,
        tab_id: action.payload.tab_id,
      };
    case ReducerActionType.SET_ID:
      return {
        ...state,
        id: action.payload.id,
      };
    case ReducerActionType.SET_DATA:
      return {
        ...state,
        tab_id: action.payload.tab_id,
        tablabel: action.payload.tablabel,
        data: action.payload.data,
        disabled: action.payload.disabled,
      };
    case ReducerActionType.SET_ERROR:
      return {
        ...state,
        tab_id: 1,
        tablabel: 'Add New',
        data: null,
        disabled: false,
      };
    case ReducerActionType.DISABLED:
      return { ...state, disabled: state.disabled };
    case ReducerActionType.CANCEL:
      return {
        ...state,
        tab_id: 1,
        tablabel: action.payload.tablabel,
        id: null,
        data: null,
        disabled: false,
      };
    case ReducerActionType.CREATEANDSTAY:
      return {
        ...state,
        tab_id: state.tab_id,
        tablabel: action.payload.tablabel,
        id: null,
        data: null,
        disabled: false,
      };
    default:
      throw new Error();
  }
};
