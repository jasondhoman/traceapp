export interface OrderContextType {
  customer_id: number;
  setCustomerID: React.Dispatch<React.SetStateAction<number>>;
  lineCount: number;
  setLineCount: React.Dispatch<React.SetStateAction<number>>;
  formOpen: boolean;
  setFormOpen: React.Dispatch<React.SetStateAction<boolean>>;
  lines: ILineItem[];
  setLines: React.Dispatch<React.SetStateAction<ILineItem[]>>;
  clearStates: () => void;
  isUpdate: boolean;
  setIsUpdate: React.Dispatch<React.SetStateAction<boolean>>;
  updateLine: (updatedLine: ILineItem, index: number) => void;
  setTrackingForLine: (tracking: number, index: number) => void;
  setGradeForLine: (grade: string, index: number) => void;
}

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
