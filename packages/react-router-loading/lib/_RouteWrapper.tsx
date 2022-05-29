/* eslint-disable camelcase */
import React, { useMemo, FC } from 'react';
import { Location, NavigationType, UNSAFE_LocationContext, useRoutes } from 'react-router-dom';
import { LoadingRouteObject } from './utils';

interface RouteWrapperProps {
  routes: LoadingRouteObject[];
  location: Location;
  navigationType: NavigationType;
  hidden?: boolean;
}

export const RouteWrapper: FC<RouteWrapperProps> = ({ routes, location, navigationType, hidden }) => {
  const element = useRoutes(routes, location);

  return <div style={hidden ? { display: 'none' } : undefined}>
    {useMemo(
      () => <UNSAFE_LocationContext.Provider value={{ location, navigationType }}>
        {element}
      </UNSAFE_LocationContext.Provider>,
      [location]
    )}
  </div>;
};
