/* eslint-disable camelcase */
import React, { useMemo, Suspense, PropsWithChildren, FC } from 'react';
import { UNSAFE_LocationContext, Route, Routes, NavigationType, Location } from 'react-router-dom';

interface RouteWrapperProps {
  location: Location;
  hidden?: boolean;
}

export const RouteWrapper: FC<PropsWithChildren<RouteWrapperProps>> = ({ location, hidden, children }) =>
  <div style={hidden ? { display: 'none' } : undefined}>
    {useMemo(
      () => <UNSAFE_LocationContext.Provider value={{ location, navigationType: NavigationType.Pop }}>
        <Suspense fallback={null}>
          <Routes>{React.Children.map(children, replaceWithRoutes)}</Routes>
        </Suspense>
      </UNSAFE_LocationContext.Provider>,
      [location]
    )}
  </div>;


const replaceWithRoutes = (element: React.ReactNode) => {
  if (!React.isValidElement(element)) {
    return;
  }

  if (element.type === React.Fragment) {
    return <>{React.Children.map(element.props.children, replaceWithRoutes)}</>;
  }

  if (element.props.children) {
    return <Route {...element.props}>{React.Children.map(element.props.children, replaceWithRoutes)}</Route>;
  }

  return <Route {...element.props} />;
};
