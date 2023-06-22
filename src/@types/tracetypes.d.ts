import React from 'react';
import { SetPageState } from '../utils/reducers';

export interface MessageResponse {
  message: string;
}

export default interface DeleteResponse extends MessageResponse {
  in_use: number[];
}

export interface ICertification {
  id: number;
  certification: string;
  description?: string;
}

export interface ICertificationForm {
  id?: number;
  certification: string;
  description?: string;
}

export type CertificationsType = {
  Certifications: ICertification[];
};

export interface IContact {
  id: number;
  name: string;
  address1?: string;
  address2?: string;
  city?: string;
  state?: string;
  zip?: string;
  phone?: string;
  fax?: string;
  email?: string;
  country?: string;
  notes?: string;
  created_at?: Date;
  created_by: number;
  last_updated_at?: Date;
  last_updated_by: number;
  deleted_at?: Date;
  deleted_by?: number;
  cell?: string;
  ext?: string;
}

export interface IContactFormData {
  id?: number;
  name: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  fax: string;
  email: string;
  country: string;
  notes: string;
  cell: string;
  ext: string;
}

export interface IShippingContact {
  company_name: string;
  name: string;
  address1?: string;
  address2?: string;
  city?: string;
  state?: string;
  zip?: string;
  phone?: string;
  fax?: string;
  email?: string;
  cell?: string;
  salesperson: number;
  transport: string | null;
}

export type ContactsType = {
  Contacts: IContact[];
};

export interface ICreditMemoFormData {
  id: number;
  tracking: number;
  customer: string;
  order_date: Date;
  ship_date: Date;
  purchase_order: string | null;
  qty: number;
  grade: string;
  tag_size: string;
  pack_set: number;
  pack_bundle: number;
  credit_weight: number;
  price_in_lbs: number;
  price_per: number;
  credit_amount: number;
  reference_invoice: number | null;
  reference_bol: number | null;
  terms: string | null;
  used: boolean;
  customer_id: number;
}

export interface ICreditMemo {
  id: number;
  tracking: number;
  customer: string;
  order_date: Date;
  ship_date: Date;
  purchase_order: string | null;
  qty: number;
  grade: string;
  tag_size: string;
  pack_set: number;
  pack_bundle: number;
  credit_weight: number;
  price_in_lbs: number;
  price_per: number;
  credit_amount: number;
  reference_invoice: number | null;
  reference_bol: number | null;
  terms: string | null;
  created_at?: Date;
  created_by: number;
  deleted_at?: Date;
  deleted_by: boolean;
  last_updated_at?: Date;
  last_updated_by: number;
}

export type CreditMemosType = {
  CreditMemos: ICreditMemo[];
};

export interface ICustomerData {
  id: number;
  company_name?: string;
  billing_address_data?: IContact;
  shipping_address_data?: IContact;
  shipping_contact_data?: IContact;
  billing_address?: number;
  shipping_address?: number;
  shipping_contact?: number;
  ap_contact?: number;
  ap_contact_data?: IContact;
  purchasing_agent?: number;
  purchasing_agent_data?: IContact;
  salesperson?: number;
  transport?: string;
  transport_cost?: number;
  info_for_trucker?: string;
  certification?: number;
  c_of_a?: string;
  factor?: string;
  terms?: string;
  terms_amount?: number;
  cod_sales: boolean;
  active_disc: boolean;
  discount?: number;
  customer_information?: string;
  loading_instructions?: string;
  additional_contact1?: number;
  additional_contact2?: number;
  additional_contact3?: number;
  additional_contact1_data?: IContact;
  additional_contact2_data?: IContact;
  additional_contact3_data?: IContact;
  created_at?: Date;
  created_by: number;
  last_updated_at?: Date;
  last_updated_by: number;
  deleted_at?: Date;
  deleted_by: boolean;
}

export interface CustomerRow {
  id: number;
  ap_contact: string;
  purchasing_agent: string;
  salesperson: string;
  transport: string;
  transport_cost: string;
  info_for_trucker: string;
  certification: null;
  c_of_a: string;
  factor: string;
  terms: string;
  terms_amount: string;
  fr: boolean;
  cod_sales: string;
  active_disc: string;
  discount: string;
  company_name: string;
}

export interface ICustomerFormData {
  id?: number;
  company_name: string;
  billing_address_data: IContactFormData;
  shipping_address_data: IContactFormData;
  shipping_contact_data: IContactFormData;
  billing_address: number;
  shipping_address: number;
  shipping_contact: number;
  ap_contact: number;
  ap_contact_data: IContactFormData;
  purchasing_agent: number;
  purchasing_agent_data: IContactFormData;
  salesperson: number;
  transport: string;
  transport_cost: number;
  info_for_trucker: string;
  certification: number;
  c_of_a: string;
  factor: string;
  terms: string;
  terms_amount: number;
  cod_sales: boolean;
  active_disc: boolean;
  discount: number;
  fr: boolean;
  customer_information: string;
  loading_instructions: string;
  num_of_invoices: number;
  additional_contact1: number;
  additional_contact2: number;
  additional_contact3: number;
  additional_contact1_data: IContactFormData;
  additional_contact2_data: IContactFormData;
  additional_contact3_data: IContactFormData;
}

export interface ICustomerForm {
  setTabState: React.Dispatch<React.SetStateAction<any>>;
  setValue: (event: React.SyntheticEvent | null, index: number) => void;
  id?: number | null;
  reducer: React.Dispatch<SetPageState>;
}

interface ICustomerDisplay {
  id: number;
  as_contact: string;
  purchasing_agent: string;
  salesperson: string;
  transport: string;
  transport_cost: number;
  info_for_trucker: string;
  certification: string;
  c_of_a: string;
  factor: string;
  terms: string;
  terms_amount: number;
  cod_sales: string;
  active_disc: string;
  discount: number;
  company_name: string;
}

export interface ICustomer {
  id: number;
  company_name?: string;
  billing_address?: number;
  shipping_address?: number;
  shipping_contact?: number;
  ap_contact?: number;
  purchasing_agent?: number;
  salesperson?: number;
  transport?: string;
  transport_cost?: number;
  info_for_trucker?: string;
  certification?: number;
  c_of_a?: string;
  factor?: string;
  terms?: string;
  terms_amount?: number;
  cod_sales: boolean;
  active_disc: boolean;
  discount?: number;
  customer_information?: string;
  loading_instructions?: string;
  additional_contact1?: number;
  additional_contact2?: number;
  additional_contact3?: number;
  created_at?: Date;
  created_by: number;
  last_updated_at?: Date;
  last_updated_by: number;
  deleted_at?: Date;
  deleted_by: boolean;
}

export type CustomersType = {
  Customers: ICustomer[];
};

export interface IDetailLookup {
  id: number;
  value: string;
  component_id: number;
  desc: string;
}

export type DetailLookupsType = {
  DetailLookups: IDetailLookup[];
};

export interface ICustomerSize {
  id: number;
  customer_id?: number;
  grade: string;
  grade_mix_id: number;
  stock?: number | undefined;
  tag_size: string;
  pieces_per_pack?: number;
  pack_per_bundle: number;
  run_size: string;
  length?: number;
  run_weight?: number;
  pad_weight?: number;
  special_instructions?: string;
  price_date?: Date;
  price_per_pound?: number;
  price_per_piece?: number;
  extra_cost?: number;
  feed?: string;
  floor_apron?: string;
  stitcher?: string;
  equipment_spec_inst?: string;
  created_at?: Date;
  created_by: number;
  last_updated_at?: Date;
  last_updated_by: number;
  deleted_at?: Date;
  deleted_by?: number;
  avg_bale_weight?: number;
}

export interface ICustomerSizeForm {
  id?: number;
  customer_id: number;
  grade: string;
  stock: number;
  tag_size: string;
  pieces_per_pack: number;
  pack_per_bundle: number;
  run_size: string;
  length: number;
  run_weight: number;
  pad_weight: number;
  special_instructions: string;
  price_date: Date;
  price_per_pound: number;
  price_per_piece: number;
  extra_cost: number;
  feed: string;
  floor_apron: string;
  stitcher: string;
  equipment_spec_inst: string;
  avg_bale_weight: number;
  min_weight: number;
  max_weight: number;
  grade_mix_id: number;
  customer_grade_name: string;
  customer_part_no: string;
}

export type CustomerSizesType = {
  CustomerSizes: ICustomerSize[];
};

export interface IGradeMix {
  id: number;
  grade: string;
  gradeMixDetails: IGradeMixDetail[];
  created_at?: Date;
  created_by?: number;
  deleted_at?: Date;
  deleted_by?: number;
  last_updated_at?: Date;
  last_updated_by?: number;
}

export type GradeMixsType = {
  GradeMixs: IGradeMix[];
};

export interface IGradeMixDetail {
  id?: number;
  description: string;
  qty: number;
  cordinal_order?: number;
  created_at?: Date;
  created_by?: number;
  deleted_at?: Date;
  deleted_by?: number;
  last_updated_at?: Date;
  last_updated_by?: number;
  grade_mix_id?: number;
}

export type GradeMixDetailsType = {
  GradeMixDetails: IGradeMixDetail[];
};

export interface IOrder {
  id: number;
  company_name?: string;
  customer_id: number;
  tracking: number;
  purchase_order?: string;
  name: string;
  salesperson: number;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zip: string;
  phone?: string;
  ext?: string;
  fax?: string;
  email?: string;
  certification?: number;
  transport?: string;
  special_instructions?: string;
  order_date: Date;
  ship_date?: Date;
  qty?: number;
  grade_id: number;
  grade?: string;
  tag_size?: string;
  run_size?: string;
  weight?: number;
  stock?: number;
  pieces_per_pack?: number;
  pack_per_bundle?: number;
  length?: number;
  pad_weight?: number;
  avg_bale_weight?: number;
  price_per_pound?: number;
  price_per_piece?: number;
  extra_cost?: number;
  run_weight?: number;
  line?: string;
  total_cost?: number;
  total_weight?: number;
  fob?: number;
  delivery?: number;
  invoice_number?: number;
  bill_ladening?: number;
  liner?: string;
  created_at?: Date;
  created_by: number;
  last_updated_at?: Date;
  last_updated_by: number;
  deleted_at?: Date;
  deleted_by?: number;
}

export interface IOrderFormData {
  id?: number;
  company_name?: string;
  customer_id: number;
  tracking: number;
  purchase_order?: string;
  name: string;
  salesperson: number;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zip: string;
  phone?: string;
  ext?: string;
  fax?: string;
  email?: string;
  certification?: number;
  transport?: string;
  special_instructions?: string;
  order_date: Date;
  ship_date?: Date;
  qty?: number;
  grade_id: number;
  grade?: string;
  grade_mix_id?: number;
  tag_size?: string;
  run_size?: string;
  weight?: number;
  stock?: number;
  pieces_per_pack?: number;
  pack_per_bundle?: number;
  length?: number;
  pad_weight?: number;
  avg_bale_weight?: number;
  price_per_pound?: number;
  price_per_piece?: number;
  extra_cost?: number;
  run_weight?: number;
  line?: string;
  total_cost?: number;
  total_weight?: number;
  fob?: number;
  delivery?: number;
  invoice_number?: number;
  bill_ladening?: number;
  liner?: string;
}

export interface ArchivedOrderFormData {
  id?: number;
  company_name?: string;
  customer_id: number;
  tracking: number;
  purchase_order?: string;
  name: string;
  salesperson: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zip: string;
  phone?: string;
  ext?: string;
  fax?: string;
  email?: string;
  certification?: number;
  transport?: string;
  special_instructions?: string;
  order_date: Date;
  ship_date?: Date;
  qty?: number;
  grade_id: number;
  grade?: string;
  grade_mix_id?: number;
  tag_size?: string;
  run_size?: string;
  weight?: number;
  stock?: number;
  pieces_per_pack?: number;
  pack_per_bundle?: number;
  length?: number;
  pad_weight?: number;
  avg_bale_weight?: number;
  price_per_pound?: number;
  price_per_piece?: number;
  extra_cost?: number;
  run_weight?: number;
  line?: string;
  total_cost?: number;
  total_weight?: number;
  fob?: number;
  delivery?: number;
  invoice_number?: number;
  bill_ladening?: number;
  liner?: string;
  min_weight: number;
  max_weight: number;
  avg_weight: number;
}

export type OrdersType = {
  Orders: IOrder[];
};

export interface IRawMaterialFormData {
  id?: number;
  description: string;
  qty: number;
  vendor: string;
  amount_received: number;
  date_received: Date;
  average_weight: number;
  price: number;
  notes: string;
  fr_additive: string;
}

export interface IRawMaterials {
  id: number;
  description?: string;
  qty?: number;
  stock?: number;
  vendor?: string;
  amount_received?: number;
  date_received?: Date;
  average_weight?: number;
  price?: number;
  notes?: string;
  available_amt?: number;
  fr_additive: string;
  created_at?: Date;
  created_by: number;
  last_updated_at?: Date;
  last_updated_by: number;
  deleted_at?: Date;
  deleted_by?: number;
}

export type RawMaterialsType = {
  RawMaterialss: IRawMaterials[];
};

export interface IRawMaterialsUsed {
  id: number;
  description: number;
  stock?: number;
  production_line?: string;
  linter_report?: string;
  qty?: number;
  average_weight?: number;
  price?: number;
  cost?: number;
  date_received?: Date;
  created_at?: Date;
  created_by: number;
  last_updated_at?: Date;
  last_updated_by: number;
  deleted_at?: Date;
  deleted_by?: number;
}

export interface IRawMaterialsUsedFormData {
  id?: number;
  description: number;
  stock: number;
  production_line: string;
  linter_report: string;
  qty: number;
  average_weight: number;
  price: number;
  cost: number;
  date_received: Date;
  fr_additive: string;
}

export interface IRawMaterialsUsedSubmitData extends IRawMaterialsUsedFormData {
  rawmaterialsused_id?: number | null;
}

export type RawMaterialsUsedsType = {
  RawMaterialsUseds: IRawMaterialsUsed[];
};

export interface ISalesPerson {
  id: number;
  name?: string;
  address1?: string;
  address2?: string;
  city?: string;
  state?: string;
  zip?: string;
  phone?: string;
  email?: string;
  commission?: number;
  notes?: string;
  created_at?: Date;
  created_by: number;
  last_updated_at?: Date;
  last_updated_by: number;
  deleted_at?: Date;
  deleted_by?: number;
}

export interface ISalesPersonFormData {
  id?: number;
  name: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  email: string;
  commission: number;
  notes: string;
}

export type SalesPersonsType = {
  SalesPersons: ISalesPerson[];
};

export interface ITraceUserChallenges {
  id: number;
  user_id: number;
  challenge_answer?: string;
  challenge_question?: string;
  created_at?: Date;
  created_by: number;
  deleted_at?: Date;
  deleted_by?: number;
  last_updated_at?: Date;
  last_updated_by: number;
}

export type TraceUserChallengessType = {
  TraceUserChallengess: ITraceUserChallenges[];
};

export interface ITraceUsers {
  id: number;
  username: string;
  password?: string;
  role: number;
  first_name?: string;
  last_name?: string;
  title?: number;
  is_active: boolean;
  reset_password: boolean;
  created_at?: Date;
  created_by: number;
  deleted_at?: Date;
  deleted_by?: number;
  last_updated_at?: Date;
  last_updated_by: number;
}

export interface ITraceUserFormData {
  id?: number;
  username: string;
  password?: string;
  role: number;
  first_name?: string;
  last_name?: string;
  title?: number;
  is_active: boolean;
  reset_password: boolean;
  created_at: Date;
  created_by: number;
  deleted_at: Date;
  deleted_by: number;
  last_updated_at: Date;
  last_updated_by: number;
}

export type TraceUserssType = {
  TraceUserss: ITraceUsers[];
};

export interface IWeightsToShipOut {
  id?: number;
  tracking: number;
  company_name: string;
  grade: string;
  tag_size: string;
  ship_date: string;
  total_weight: number;
  qty: number;
  weights: number[];
  min: number;
  max: number;
}

export type WeightsToShipOutsType = {
  WeightsToShipOuts: IWeightsToShipOut[];
};

export interface ICertificationAudit {
  audit_id: number;
  id: number;
  certification: string;
  description?: string;
  created_at?: Date;
  created_by: number;
  deleted_at?: Date;
  deleted_by?: number;
  last_updated_at?: Date;
  last_updated_by: number;
  change_time: Date;
  op_code: string;
}

export type CertificationAuditsType = {
  CertificationAudits: ICertificationAudit[];
};

export interface IContactAudit {
  audit_id: number;
  id: number;
  name: string;
  address1?: string;
  address2?: string;
  city?: string;
  state?: string;
  zip?: string;
  phone?: string;
  fax?: string;
  email?: string;
  country?: string;
  notes?: string;
  created_at?: Date;
  created_by: number;
  last_updated_at?: Date;
  last_updated_by: number;
  deleted_at?: Date;
  deleted_by?: number;
  cell?: string;
  ext?: string;
  change_time: Date;
  op_code: string;
}

export type ContactAuditsType = {
  ContactAudits: IContactAudit[];
};

export interface ICreditMemoAudit {
  audit_id: number;
  id: number;
  tracking: number;
  name: string;
  sale_person?: number;
  order_date: Date;
  ship_date: Date;
  po_number?: string;
  transport?: string;
  qty: number;
  grade: string;
  grade_no: number;
  law_label?: string;
  tag_size?: string;
  run_size?: string;
  weight?: number;
  stock?: number;
  pack_set?: number;
  pack_bundle?: number;
  spec_inst?: string;
  length?: number;
  pad_weight?: number;
  avg_bail?: string;
  price_pound?: number;
  price_each?: number;
  fob?: number;
  delivery?: number;
  ext_cost?: number;
  total_charge?: number;
  total_weight?: number;
  inv_no?: number;
  run_weight?: number;
  each_weight?: number;
  bill_lad?: number;
  line?: string;
  liner?: string;
  credit?: string;
  created_at?: Date;
  created_by: number;
  deleted_at?: Date;
  deleted_by: boolean;
  last_updated_at?: Date;
  last_updated_by: number;
  address: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
  change_time: Date;
  op_code: string;
}

export type CreditMemoAuditsType = {
  CreditMemoAudits: ICreditMemoAudit[];
};

export interface ICustomerAudit {
  audit_id: number;
  id: number;
  company_name?: string;
  billing_address?: number;
  shipping_address?: number;
  shipping_contact?: number;
  ap_contact?: number;
  purchasing_agent?: number;
  salesperson?: number;
  transport?: string;
  transport_cost?: number;
  info_for_trucker?: string;
  certification?: number;
  c_of_a?: string;
  factor?: string;
  terms?: string;
  terms_amount?: number;
  cod_sales: boolean;
  active_disc: boolean;
  discount?: number;
  customer_information?: string;
  loading_instructions?: string;
  additional_contact1?: number;
  additional_contact2?: number;
  additional_contact3?: number;
  created_at?: Date;
  created_by: number;
  last_updated_at?: Date;
  last_updated_by: number;
  deleted_at?: Date;
  deleted_by: boolean;
  change_time: Date;
  op_code: string;
}

export type CustomerAuditsType = {
  CustomerAudits: ICustomerAudit[];
};

export interface IDetailLookupAudit {
  audit_id: number;
  id: number;
  value: string;
  component_id: number;
  desc: string;
  change_time: Date;
  op_code: string;
}

export type DetailLookupAuditsType = {
  DetailLookupAudits: IDetailLookupAudit[];
};

export interface ICustomerSizeAudit {
  audit_id: number;
  id: number;
  customer_id?: number;
  grade: string;
  stock?: number;
  tag_size: string;
  pieces_per_pack?: number;
  pack_per_bundle: number;
  run_size: string;
  length?: number;
  run_weight?: number;
  pad_weight?: number;
  special_instructions?: string;
  price_date?: Date;
  price_per_pound?: number;
  price_per_piece?: number;
  extra_cost?: number;
  feed?: string;
  floor_apron?: string;
  stitcher?: string;
  equipment_spec_inst?: string;
  created_at?: Date;
  created_by: number;
  last_updated_at?: Date;
  last_updated_by: number;
  deleted_at?: Date;
  deleted_by?: number;
  avg_bale_weight?: number;
  change_time: Date;
  op_code: string;
}

export type CustomerSizeAuditsType = {
  CustomerSizeAudits: ICustomerSizeAudit[];
};

export interface IGradeMixAudit {
  audit_id: number;
  id: number;
  grade: string;
  created_at?: Date;
  created_by: number;
  deleted_at?: Date;
  deleted_by?: number;
  last_updated_at?: Date;
  last_updated_by: number;
  change_time: Date;
  op_code: string;
}

export type GradeMixAuditsType = {
  GradeMixAudits: IGradeMixAudit[];
};

export interface IGradeMixDetailAudit {
  audit_id: number;
  id: number;
  description: string;
  qty: number;
  cordinal_order?: number;
  created_at?: Date;
  created_by: number;
  deleted_at?: Date;
  deleted_by?: number;
  last_updated_at?: Date;
  last_updated_by: number;
  grade_mix_id: number;
  change_time: Date;
  op_code: string;
}

export type GradeMixDetailAuditsType = {
  GradeMixDetailAudits: IGradeMixDetailAudit[];
};

export interface IOrderAudit {
  audit_id: number;
  id: number;
  company_name?: string;
  customer_id: number;
  tracking: number;
  purchase_order?: string;
  name: string;
  salesperson: number;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zip: string;
  phone?: string;
  ext?: string;
  fax?: string;
  email?: string;
  certification?: number;
  transport?: string;
  special_instructions?: string;
  order_date: Date;
  ship_date?: Date;
  qty?: number;
  grade_id: number;
  grade?: string;
  tag_size?: string;
  run_size?: string;
  weight?: number;
  stock?: number;
  pieces_per_pack?: number;
  pack_per_bundle?: number;
  length?: number;
  pad_weight?: number;
  avg_bale_weight?: number;
  price_per_pound?: number;
  price_per_piece?: number;
  extra_cost?: number;
  run_weight?: number;
  line?: string;
  total_cost?: number;
  total_weight?: number;
  fob?: number;
  delivery?: number;
  invoice_number?: number;
  bill_ladening?: number;
  liner?: string;
  lnumberer_report?: string;
  created_at?: Date;
  created_by: number;
  last_updated_at?: Date;
  last_updated_by: number;
  deleted_at?: Date;
  deleted_by?: number;
  change_time: Date;
  op_code: string;
}

export type OrderAuditsType = {
  OrderAudits: IOrderAudit[];
};

export interface IRawMaterialsAudit {
  audit_id: number;
  id: number;
  description?: string;
  qty?: number;
  vendor?: string;
  amount_received?: number;
  date_received?: Date;
  average_weight?: number;
  price?: number;
  notes?: string;
  available_amt?: number;
  created_at?: Date;
  created_by: number;
  last_updated_at?: Date;
  last_updated_by: number;
  deleted_at?: Date;
  deleted_by?: number;
  change_time: Date;
  op_code: string;
}

export type RawMaterialsAuditsType = {
  RawMaterialsAudits: IRawMaterialsAudit[];
};

export interface IRawMaterialsUsedAudit {
  audit_id: number;
  id: number;
  description: number;
  stock?: number;
  production_line?: string;
  lnumberer_report?: string;
  qty?: number;
  average_weight?: number;
  price?: number;
  cost?: number;
  date_received?: Date;
  created_at?: Date;
  created_by: number;
  last_updated_at?: Date;
  last_updated_by: number;
  deleted_at?: Date;
  deleted_by?: number;
  change_time: Date;
  op_code: string;
}

export type RawMaterialsUsedAuditsType = {
  RawMaterialsUsedAudits: IRawMaterialsUsedAudit[];
};

export interface ISalesPersonAudit {
  audit_id: number;
  id: number;
  name?: string;
  address1?: string;
  address2?: string;
  city?: string;
  state?: string;
  zip?: string;
  phone?: string;
  email?: string;
  commission?: number;
  notes?: string;
  created_at?: Date;
  created_by: number;
  last_updated_at?: Date;
  last_updated_by: number;
  deleted_at?: Date;
  deleted_by?: number;
  change_time: Date;
  op_code: string;
}

export type SalesPersonAuditsType = {
  SalesPersonAudits: ISalesPersonAudit[];
};

export interface ITraceUserChallengesAudit {
  audit_id: number;
  id: number;
  user_id: number;
  challenge_answer?: string;
  challenge_question?: string;
  created_at?: Date;
  created_by: number;
  deleted_at?: Date;
  deleted_by?: number;
  last_updated_at?: Date;
  last_updated_by: number;
  change_time: Date;
  op_code: string;
}

export type TraceUserChallengesAuditsType = {
  TraceUserChallengesAudits: ITraceUserChallengesAudit[];
};

export interface ITraceUsersAudit {
  audit_id: number;
  id: number;
  username: string;
  password?: string;
  role: number;
  first_name?: string;
  last_name?: string;
  title?: number;
  is_active: boolean;
  reset_password: boolean;
  created_at?: Date;
  created_by: number;
  deleted_at?: Date;
  deleted_by?: number;
  last_updated_at?: Date;
  last_updated_by: number;
  change_time: Date;
  op_code: string;
}

export type TraceUsersAuditsType = {
  TraceUsersAudits: ITraceUsersAudit[];
};

export interface IWeightsToShipOutAudit {
  audit_id: number;
  id: number;
  tracking: number;
  company_name?: string;
  grade?: string;
  tag_size?: string;
  shipping_date?: Date;
  total_weight: number;
  qty: number;
  weights: number[];
  created_at?: Date;
  created_by: number;
  deleted_at?: Date;
  deleted_by?: number;
  last_updated_at?: Date;
  last_updated_by: number;
  change_time: Date;
  op_code: string;
}

export type WeightsToShipOutAuditsType = {
  WeightsToShipOutAudits: IWeightsToShipOutAudit[];
};

export interface ISettings {
  id: number;
  userid: number;
  component_id: number;
  settings: string;
}

export type SettingssType = {
  Settingss: ISettings[];
};

export interface ILink {
  href: string;
  key: string;
  icon: string;
  text: string;
  onClick?: () => Promise<void | { message: string }>;
  errorMessage?: string;
}

export type Links = {
  links: ILink[];
};

export interface IPage {
  name?: string;
}

export interface IDisplay {
  setID?: React.Dispatch<React.SetStateAction<number>>;
  data?: any;
  reducer?: React.Dispatch<SetPageState>;
}

export type PageState = {
  id: number;
  tab: number;
  disabled: boolean;
  component: React.FC | null;
};

export interface IProductionFormData {
  missing_weight_sheet: boolean;
  id: number;
  tracking: number;
  company_name: string;
  line: string;
  linter_report: 'Y' | 'N';
  shippingName: string;
  purchaseOrder: string;
  customer_id: number;
  gradeId: number;
  grade: string;
  tag_size: string;
  pieces_per_pack: number;
  pack_per_bundle: number;
  price_per_piece: number;
  qty: number;
  run_weight: number;
  weight: number;
  price_per_pound: number;
  order_date: Date;
  ship_date: Date;
  purchase_order: string;
  total_weight: number;
  total_cost: number;
  use_weight_for_total: boolean;
}

export interface IProductionInformationForm {
  prop_order?: IProductionFormData;
  reducer: React.Dispatch<SetPageState>;
  getOrder: (id: number) => Promise<IProductionFormData | null | undefined>;
}

interface IOrdersForm {
  id?: number;
  reducer: React.Dispatch<SetPageState>;
  prop_order?: IOrderFormData;
}

export interface IResponse<T> {
  status: number | string | undefined;
  message: string | null;
  data: T | null;
}

export interface LogMessage {
  id: string;
  server: string;
  level: string;
  timestamp: string;
  method?: string;
  status?: number;
  response?: number;
  api?: string;
  payload_size?: number;
  end_point?: string;
  message: string[];
}

export interface AutoComplete {
  id: number;
  label: string | undefined;
}

export interface ErrorMessage {
  message: string;
  status: number;
}
