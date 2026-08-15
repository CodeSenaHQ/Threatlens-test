import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';

export interface ScreenEntry {
  screen: string;
  props?: Record<string, unknown>;
}

export interface NavigationContextType {
  currentScreen: string;
  currentProps?: Record<string, unknown>;
  stack: ScreenEntry[];
  canGoBack: boolean;
  push: (screen: string, props?: Record<string, unknown>) => void;
  pop: () => boolean;
  replace: (screen: string, props?: Record<string, unknown>) => void;
  reset: (screen: string, props?: Record<string, unknown>) => void;
}

const NavigationContext = createContext<NavigationContextType | null>(null);

export interface NavigationProviderProps {
  initialScreen?: string;
  initialProps?: Record<string, unknown>;
  children: React.ReactNode;
}

export const NavigationProvider: React.FC<NavigationProviderProps> = ({
  initialScreen = 'home',
  initialProps,
  children,
}) => {
  const [stack, setStack] = useState<ScreenEntry[]>([
    { screen: initialScreen, props: initialProps },
  ]);

  const push = useCallback((screen: string, props?: Record<string, unknown>) => {
    setStack((prev) => [...prev, { screen, props }]);
  }, []);

  const pop = useCallback((): boolean => {
    let popped = false;
    setStack((prev) => {
      if (prev.length > 1) {
        popped = true;
        return prev.slice(0, -1);
      }
      return prev;
    });
    return popped;
  }, []);

  const replace = useCallback((screen: string, props?: Record<string, unknown>) => {
    setStack((prev) => {
      const next = [...prev];
      if (next.length > 0) {
        next[next.length - 1] = { screen, props };
        return next;
      }
      return [{ screen, props }];
    });
  }, []);

  const reset = useCallback((screen: string, props?: Record<string, unknown>) => {
    setStack([{ screen, props }]);
  }, []);

  const current = stack[stack.length - 1] || { screen: initialScreen, props: initialProps };

  const value = useMemo<NavigationContextType>(
    () => ({
      currentScreen: current.screen,
      currentProps: current.props,
      stack,
      canGoBack: stack.length > 1,
      push,
      pop,
      replace,
      reset,
    }),
    [current, stack, push, pop, replace, reset]
  );

  return <NavigationContext.Provider value={value}>{children}</NavigationContext.Provider>;
};

export const useNavigation = (): NavigationContextType => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};
