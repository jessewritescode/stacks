'use client';

import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
// import { ColorModeProvider } from './color-mode';
import React, { ReactNode } from 'react';

interface IProviderProps {
  children: ReactNode;
}

export const Provider: React.FC<IProviderProps> = ({ children }) => {
  return <ChakraProvider value={defaultSystem}>{children}</ChakraProvider>;
};
