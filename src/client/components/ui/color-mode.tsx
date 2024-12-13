'use client';

import { ClientOnly, IconButton, Skeleton } from '@chakra-ui/react';
import { ThemeProvider, useTheme } from 'next-themes';

import * as React from 'react';
import { LuMoon, LuSun } from 'react-icons/lu';

interface IColorModeProviderProps {
  children: React.ReactNode;
}

export function ColorModeProvider(props: IColorModeProviderProps) {
  return <ThemeProvider attribute='class' disableTransitionOnChange {...props} />;
}

export function useColorMode() {
  const { resolvedTheme, setTheme } = useTheme();
  const toggleColorMode = () => {
    setTheme(resolvedTheme === 'light' ? 'dark' : 'light');
  };
  return {
    colorMode: resolvedTheme as 'light' | 'dark' | undefined,
    setColorMode: setTheme,
    toggleColorMode,
  };
}

export function useColorModeValue<T>(light: T, dark: T): T {
  const { colorMode } = useColorMode();
  return colorMode === 'light' ? light : dark;
}

export function ColorModeIcon() {
  const { colorMode } = useColorMode();
  return colorMode === 'light' ? <LuSun /> : <LuMoon />;
}

type ColorModeButtonProps = React.ComponentPropsWithoutRef<'button'>;

export const ColorModeButton = React.forwardRef<HTMLButtonElement, ColorModeButtonProps>(
  function ColorModeButton(props, ref) {
    const { toggleColorMode } = useColorMode();
    return (
      <ClientOnly fallback={<Skeleton boxSize='8' />}>
        <IconButton
          onClick={toggleColorMode}
          variant='ghost'
          aria-label='Toggle color mode'
          size='sm'
          ref={ref}
          {...props}
          css={{
            _icon: {
              width: '5',
              height: '5',
            },
          }}
        >
          <ColorModeIcon />
        </IconButton>
      </ClientOnly>
    );
  },
);
