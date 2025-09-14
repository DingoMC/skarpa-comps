'use client';

import { AppStore, makeStore } from '@/store/store';
import { setupListeners } from '@reduxjs/toolkit/query';
import { ReactNode, useEffect, useRef } from 'react';
import { Provider } from 'react-redux';
import { type Persistor, persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';

interface Props {
  readonly children: ReactNode;
}

export const StoreProvider = ({ children }: Props) => {
  const storeRef = useRef<AppStore | null>(null);
  const persistorRef = useRef<Persistor>({} as Persistor);

  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore();
    persistorRef.current = persistStore(storeRef.current);
  }

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (storeRef.current !== null) {
      // configure listeners using the provided defaults
      // optional, but required for `refetchOnFocus`/`refetchOnReconnect` behaviors
      const unsubscribe = setupListeners(storeRef.current.dispatch);
      return unsubscribe;
    }
  }, []);

  return (
    <Provider store={storeRef.current}>
      <PersistGate loading={null} persistor={persistorRef.current}>
        {children}
      </PersistGate>
    </Provider>
  );
};
