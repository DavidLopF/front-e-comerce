'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { StoreConfig } from '../types/StoreConfig';
import { useStoreConfig, useTheme, useStoreSEO } from '../hooks/useStoreConfig';

interface StoreConfigContextType {
  config: StoreConfig | null;
  loading: boolean;
  error: Error | null;
  reloadConfig: () => Promise<void>;
}

const StoreConfigContext = createContext<StoreConfigContextType | undefined>(undefined);

interface StoreConfigProviderProps {
  children: ReactNode;
}

/**
 * Provider que proporciona la configuración de la tienda a toda la aplicación
 * Incluye manejo automático de tema y SEO
 */
export function StoreConfigProvider({ children }: StoreConfigProviderProps) {
  const { config, loading, error, reloadConfig } = useStoreConfig();

  // Aplicar tema automáticamente
  useTheme(config);
  
  // Aplicar SEO automáticamente
  useStoreSEO(config);

  return (
    <StoreConfigContext.Provider value={{ config, loading, error, reloadConfig }}>
      {children}
    </StoreConfigContext.Provider>
  );
}

/**
 * Hook para acceder a la configuración de la tienda desde cualquier componente
 */
export function useStoreConfigContext() {
  const context = useContext(StoreConfigContext);
  
  if (context === undefined) {
    throw new Error('useStoreConfigContext debe ser usado dentro de StoreConfigProvider');
  }
  
  return context;
}
