export interface ILineItem {
  tracking: number;
  grade_id: number;
  grade: string;
  grade_mix_id: number;
  tag_size?: string;
  qty?: number;
  stock?: number;
  pieces_per_pack?: number;
  pack_per_bundle?: number;
  special_instructions?: string;
  run_weight?: number;
}
