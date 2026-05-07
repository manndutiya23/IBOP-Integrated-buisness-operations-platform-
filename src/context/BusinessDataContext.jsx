/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext } from "react";

const BusinessDataContext = createContext(null);

export function useBusinessData() {
  const context = useContext(BusinessDataContext);

  if (!context) {
    throw new Error("useBusinessData must be used within BusinessDataProvider");
  }

  return context;
}

export { BusinessDataContext };