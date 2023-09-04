import React, { createContext, useContext } from 'react';
import TransactionStore from '../store/TransactionsSrote';

interface SomeComponentProps {
  children: React.ReactNode; 
}

const StoreContext = createContext({
    transactionStore: new TransactionStore([]),
});

export const useStore = () => {
    return useContext(StoreContext);
};

export const StoreProvider: React.FC<SomeComponentProps> = ({children}) => {
    const store = {
      transactionStore: new TransactionStore([]), 
    };
  
    return (
      <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
    );
};

