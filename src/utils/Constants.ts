import { getOrdersExport } from '../pages/Orders/api/order';
import { getRawMatUsedExport } from '../pages/Rawmaterialsused/api/rawmaterialsused';
import {
  getFinishedInventoryReport,
  getRawMaterialList,
} from '../pages/Reports/api/reporting';
import { formatShortDate } from './helpers';

const today = new Date(Date.now());
export const default_contact = {
  name: '',
  address1: '',
  address2: '',
  city: '',
  state: '',
  zip: '',
  phone: '',
  fax: '',
  email: '',
  country: '',
  notes: '',
  cell: '',
  ext: '',
};

export const default_customer = {
  company_name: '',
  billing_address_data: default_contact,
  shipping_address_data: default_contact,
  shipping_contact_data: default_contact,
  billing_address: 0,
  shipping_address: 0,
  shipping_contact: 0,
  ap_contact: 0,
  ap_contact_data: default_contact,
  purchasing_agent: 0,
  purchasing_agent_data: default_contact,
  salesperson: 0,
  transport: '',
  transport_cost: 0,
  info_for_trucker: '',
  certification: 0,
  c_of_a: 'N',
  factor: 'N',
  terms: '',
  terms_amount: 0,
  cod_sales: false,
  active_disc: false,
  discount: 0,
  fr: false,
  customer_information: '',
  loading_instructions: '',
  num_of_invoices: 0,
  additional_contact1: 0,
  additional_contact2: 0,
  additional_contact3: 0,
  additional_contact1_data: default_contact,
  additional_contact2_data: default_contact,
  additional_contact3_data: default_contact,
};

export const default_raw_mat = {
  description: '',
  qty: 0,
  vendor: '',
  amount_received: 0,
  date_received: new Date(),
  average_weight: 0,
  price: 0,
  notes: '',
  fr_additive: 'N',
};

export const default_salesperson = {
  name: '',
  address1: '',
  address2: '',
  city: '',
  state: '',
  zip: '',
  phone: '',
  email: '',
  commission: 0,
  notes: '',
};

export const default_credit_memo = {
  id: 0,
  tracking: 0,
  customer: '',
  order_date: new Date(),
  ship_date: new Date(),
  purchase_order: '',
  qty: 0,
  grade: '',
  tag_size: '',
  pack_set: 0,
  pack_bundle: 0,
  credit_weight: 0,
  price_in_lbs: 0,
  price_per: 0,
  credit_amount: 0,
  reference_invoice: 0,
  reference_bol: 0,
  terms: '',
  used: false,
  customer_id: 0,
};

export const AdminLinks = [
  {
    href: '/adminpanel/usersdisplay',
    key: 'userdisplay',
    icon: 'personaddicon',
    text: 'View Users',
    errorMessage: '',
  },
  {
    href: '/adminpanel/userform',
    key: 'userformnew',
    icon: 'personaddicon',
    text: 'Add New User',
    errorMessage: '',
  },
  {
    href: '/adminpanel/logviewer',
    key: 'logviewer',
    icon: 'accountcircleicon',
    text: 'Log Viewer Historical',
    errorMessage: '',
  },
  {
    href: '/adminpanel/logviewer/live',
    key: 'logviewerlive',
    icon: 'accountcircleicon',
    text: 'Log Viewer Live',
    errorMessage: '',
  },
];

export const ReportLinks = [
  {
    href: '/reporting/rawmateriallist',
    key: 'raw_material_list',
    icon: 'receipticon',
    text: 'Raw Material List',
    errorMessage: '',
    onClick: getRawMaterialList,
  },
  {
    href: '/reporting/weight',
    key: 'weight_report',
    icon: 'receipticon',
    text: 'Weight Sheet',
    errorMessage: '',
  },
  {
    href: '/reporting/productionrun',
    key: 'production_run_report',
    icon: 'receipticon',
    text: 'Production Run',
    errorMessage: '',
  },
  {
    href: '/reporting/salesorderdocument',
    key: 'sales_order_document',
    icon: 'receipticon',
    text: 'Sales Order Document',
    errorMessage: '',
  },
  {
    href: '/reporting/finishedgoods',
    key: 'finished_goods',
    icon: 'receipticon',
    text: 'Finished Inventory',
    errorMessage: '',
    onClick: getFinishedInventoryReport,
  },
  {
    href: '/reporting/salescommission',
    key: 'sales_commission',
    icon: 'receipticon',
    text: 'Sales Commission Report',
    errorMessage: '',
  },
  {
    href: '/reporting/linter',
    key: 'linter_report',
    icon: 'receipticon',
    text: 'Linter Report',
    errorMessage: '',
  },
  {
    href: '/reporting/invoice',
    key: 'invoice_report',
    icon: 'receipticon',
    text: 'Invoice',
    errorMessage: '',
  },
  {
    href: '/reporting/bol',
    key: 'bill_of_lading_report',
    icon: 'receipticon',
    text: 'Bill of Lading',
    errorMessage: '',
  },
  {
    href: '/reporting/creditmemo',
    key: 'credit_memo_report',
    icon: 'receipticon',
    text: 'Print Credit Memo',
    errorMessage: '',
  },
  {
    href: '/reporting/labels',
    key: 'label_generator',
    icon: 'receipticon',
    text: 'Print Labels',
    errorMessage: '',
  },
];

export const ArchiveLinks = [
  {
    href: '/archive/deleteorders',
    key: 'delete_orders',
    icon: 'receipticon',
    text: 'Delete Order By Tracking',
    errorMessage: '',
  },
  {
    href: '/archive/exportorders',
    key: 'export_orders',
    icon: 'receipticon',
    text: 'Export Invoiced Active Orders',
    errorMessage: '',
    onClick: getOrdersExport,
  },
  {
    href: '/archive/exportarchivedorders',
    key: 'export_orders',
    icon: 'receipticon',
    text: 'Export Archived Orders',
    errorMessage: '',
  },
  {
    href: '/archive/rawmaterialsused',
    key: 'export_raw_materials_used',
    icon: 'receipticon',
    text: 'Export Raw Materials Used',
    errorMessage: '',
    onClick: getRawMatUsedExport,
  },
  {
    href: '/archive/bulkarchive',
    key: 'export_orders',
    icon: 'receipticon',
    text: 'Archive Orders by Ship Date',
    errorMessage: '',
  },
];
export const DashboardLinks = [
  {
    href: '',
    key: 'none',
    icon: '',
    text: 'Placeholder',
    errorMessage: '',
  },
];

export const default_user = {
  username: '',
  password: '',
  role: 0,
  first_name: '',
  last_name: '',
  title: 0,
  is_active: false,
  reset_password: false,
  created_at: new Date(),
  created_by: 0,
  deleted_at: new Date(),
  deleted_by: 0,
  last_updated_at: new Date(),
  last_updated_by: 0,
};

export const default_order = {
  company_name: '',
  name: '',
  address1: '',
  address2: '',
  city: '',
  state: '',
  zip: '',
  phone: '',
  ext: '',
  fax: '',
  salesperson: 0,
  transport: '',
  purchase_order: '',
  customer_id: 0,
  grade: '',
  grade_id: 0,
  stock: 0,
  tag_size: '',
  pieces_per_pack: 0,
  pack_per_bundle: 0,
  qty: 0,
  order_date: today,
  ship_date: today,
  special_instructions: '',
  tracking: 0,
};

export const default_archived_order = {
  ...default_order,
  min_weight: 0,
  max_weight: 0,
  avg_weight: 0,
  salesperson: '',
  total_cost: 0,
  total_weight: 0,
};

export const default_prod_info = {
  tracking: 0,
  company_name: '',
  line: '',
  linter_report: 'N',
  shippingName: '',
  purchaseOrder: '',
  customer_id: 0,
  gradeId: 0,
  grade: '',
  tag_size: '',
  pieces_per_pack: 0,
  pack_per_bundle: 0,
  price_per_piece: 0,
  qty: 0,
  run_weight: 0,
  weight: 0,
  price_per_pound: 0,
  order_date: today,
  ship_date: today,
  purchase_order: '',
  total_weight: 0,
  total_cost: 0,
  use_weight_for_total: false,
};

export const default_size = {
  customer_id: 0,
  grade: '',
  stock: 0,
  tag_size: '',
  pieces_per_pack: 0,
  pack_per_bundle: 0,
  run_size: '',
  length: 0,
  run_weight: 0,
  pad_weight: 0,
  special_instructions: '',
  price_date: today,
  price_per_pound: 0,
  price_per_piece: 0,
  extra_cost: 0,
  feed: '',
  floor_apron: '',
  stitcher: '',
  equipment_spec_inst: '',
  avg_bale_weight: 0,
  min_weight: 0,
  max_weight: 0,
  grade_mix_id: 0,
  customer_grade_name: '',
  customer_part_no: '',
};

export const default_line = {
  tracking: 0,
  grade_id: 0,
  grade: '',
  grade_mix_id: 0,
  tag_size: '',
  qty: 0,
  stock: 0,
  pieces_per_pack: 0,
  pack_per_bundle: 0,
  special_instructions: '',
};

//test
export const default_weights_to_ship = {
  tracking: 0,
  company_name: '',
  grade: '',
  tag_size: '',
  ship_date: formatShortDate(new Date()),
  total_weight: 0,
  qty: 0,
  min: 0,
  max: 99999999,
  weights: [],
};

export const navpoints = [
  {
    href: '/orders',
    key: 'orders',
    icon: 'storeicon',
    text: 'Orders',
    errorMessage: '',
  },
  {
    href: '/customers',
    key: 'customers',
    icon: 'accountcircleicon',
    text: 'Customers',
    errorMessage: '',
  },
  {
    href: '/certifications',
    key: 'certifications',
    icon: 'descriptionicon',
    text: 'Certifications',
    errorMessage: '',
  },
  {
    href: '/rawmaterials',
    key: 'rawmaterials',
    icon: 'settingsicon',
    text: 'Raw Materials',
    errorMessage: '',
  },
  {
    href: '/rawmaterialsused',
    key: 'rawmaterialsused',
    icon: 'settingsicon',
    text: 'Raw Materials Used',
    errorMessage: '',
  },
  {
    href: '/customersize',
    key: 'customersize',
    icon: 'adjusticon',
    text: 'Customer Size',
    errorMessage: '',
  },
  {
    href: '/grademix',
    key: 'grademix',
    icon: 'adjusticon',
    text: 'Grade Mix',
    errorMessage: '',
  },
  {
    href: '/salepersons',
    key: 'salepersons',
    icon: 'attachmoneyicon',
    text: 'Salespersons',
    errorMessage: '',
  },
  {
    href: '/productioninformation',
    key: 'productioninformation',
    icon: 'businessicon',
    text: 'Production Information',
    errorMessage: '',
  },
  {
    href: '/weightstoship',
    key: 'weightstoship',
    icon: 'localshippingicon',
    text: 'Weights to Ship',
    errorMessage: '',
  },
  {
    href: '/creditmemo',
    key: 'creditmemo',
    icon: 'receipticon',
    text: 'Credit Memo',
    errorMessage: '',
  },
  {
    href: '/archivedisplay',
    key: 'archivedisplay',
    icon: 'storeicon',
    text: 'Archive Display',
    errorMessage: '',
  },
];
