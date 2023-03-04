export interface CustomerSize {
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
}

export type CustomerSizesType = {
  customersizes: CustomerSize[];
};
