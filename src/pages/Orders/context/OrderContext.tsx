import React, { createContext, useState } from 'react';
import { ILineItem, OrderContextType } from '../@types/OrderTypes';

import { default_line } from '../../../utils/Constants';

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

  const setTrackingForLine = (tracking: number, index: number) => {
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
  };

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
  };

  return (
    <OrderContext.Provider value={context_data}>
      {children}
    </OrderContext.Provider>
  );
};
export default OrderProvider;
