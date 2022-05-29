import React, { useMemo, Suspense, PropsWithChildren, FC } from 'react';
import { RouteComponentProps, __RouterContext as RouterContext } from 'react-router';
import { findMatchingElement } from './utils';

interface RouteWrapperProps {
  context: RouteComponentProps;
  hidden?: boolean;
}
export const RouteWrapper: FC<PropsWithChildren<RouteWrapperProps>> = ({ context, hidden, children }) =>
  <div style={hidden ? { display: 'none' } : undefined}>
    {useMemo(
      () => <RouterContext.Provider value={context}>
        <Suspense fallback={null}>
          {findMatchingElement(context, children)}
        </Suspense>
      </RouterContext.Provider>,
      [context]
    )}
  </div>;
