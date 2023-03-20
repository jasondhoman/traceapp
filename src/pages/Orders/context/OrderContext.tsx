import React, { createContext, useCallback, useState } from 'react';
import { ILineItem } from '../@types/OrderTypes';

import { default_line } from '../../../utils/Constants';

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
  updateLines: () => void;
}

export const OrderContext = createContext<OrderContextType | null>(null);

const OrderProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [customer_id, setCustomerID] = useState(0);
  const [lineCount, setLineCount] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [lines, setLines] = useState<ILineItem[]>([]);
  const [isUpdate, setIsUpdate] = useState(false);

  const clearStates = () => {
    setCustomerID(0);
    setLineCount(1);
    setFormOpen(false);
    setLines([default_line]);
    setIsUpdate(false);
  };

  const updateLine = (updatedLine: ILineItem, index: number) => {
    const updatedLines = lines.map((line, i) => {
      if (i === index) {
        return {
          ...line,
          ...updatedLine,
        };
      } else {
        return {
          ...line,
        };
      }
    });
    setLines(updatedLines);
  };

  const setGradeForLine = (grade: string, index: number) => {
    const updatedLines = lines.map((line, i) => {
      if (i === index) {
        return {
          ...line,
          grade: grade,
        };
      } else {
        return {
          ...line,
        };
      }
    });
    setLines(() => updatedLines);
  };

  const updateLines = useCallback(() => {
    console.log('updateLines called');
    if (lines.length === 0) {
      setLines([default_line]);
    }

    const line_def: ILineItem[] = [];
    if (customer_id === 0) {
      setLines([default_line]);
    }
    if (lineCount === undefined) {
      for (let i = 0; i < 1; i++) {
        if (lines[i]) {
          line_def.push(lines[i]);
        } else {
          line_def.push(default_line);
        }
      }
    } else {
      let copyLine = default_line;
      if (lines.length > 0) {
        copyLine = {
          ...lines[0],
          qty: lines[0].qty ?? 0,
          stock: lines[0].stock ?? 0,
          pieces_per_pack: lines[0].pieces_per_pack ?? 0,
          pack_per_bundle: lines[0].pack_per_bundle ?? 0,
          special_instructions: lines[0].special_instructions ?? '',
          tag_size: lines[0].tag_size ?? '',
        };
      }
      for (let i = 0; i < lineCount; i++) {
        if (lines[i]) {
          line_def.push(lines[i]);
        } else {
          line_def.push(copyLine);
        }
      }
    }
    setLines(line_def);
  }, [customer_id, lineCount, lines]);

  const setTrackingForLine = useCallback(
    (tracking: number, index: number) => {
      const updatedLines = lines.map((line, i) => {
        if (i === index) {
          return {
            ...line,
            tracking: tracking,
          };
        } else {
          return {
            ...line,
          };
        }
      });
      setLines(updatedLines);
    },
    [lines]
  );

  const context_data = {
    customer_id: customer_id,
    setCustomerID: setCustomerID,
    lineCount: lineCount,
    setLineCount: setLineCount,
    formOpen: formOpen,
    setFormOpen: setFormOpen,
    lines: lines,
    setLines: setLines,
    clearStates: clearStates,
    isUpdate: isUpdate,
    setIsUpdate: setIsUpdate,
    updateLine: updateLine,
    setTrackingForLine: setTrackingForLine,
    setGradeForLine: setGradeForLine,
    updateLines: updateLines,
  };

  return (
    <OrderContext.Provider value={context_data}>
      {children}
    </OrderContext.Provider>
  );
};
export default OrderProvider;

// throw new Error('No provider for OrderContext found');
export const useOrderContext = () => {
  const context = React.useContext(OrderContext) as OrderContextType;
  if (context === undefined) {
    throw new Error('useOrderContext must be used within a OrderProvider');
  }
  return context;
};
