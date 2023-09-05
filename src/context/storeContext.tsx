import React, { PropsWithChildren, createContext, useContext, useRef } from 'react';
import TransactionStore from '../store/TransactionStore';

const StoreContext = createContext(new TransactionStore([]));

export const useStore = () => {
    return useContext(StoreContext);
};

export const StoreProvider: React.FC<PropsWithChildren> = ({children}) => {
    const store = useRef(new TransactionStore([]));
  
    return (
      <StoreContext.Provider value={store.current}>{children}</StoreContext.Provider>
    );
};

