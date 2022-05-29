import React, { useMemo, FC } from 'react';
import { Location, useRoutes } from 'react-router-dom';
import { LoadingRouteObject } from './utils';

interface RouteWrapperProps {
  routes: LoadingRouteObject[];
  location: Location;
  hidden?: boolean;
}

export const RouteWrapper: FC<RouteWrapperProps> = ({ routes, location, hidden }) => {
  const element = useRoutes(routes, location);

  return <div style={hidden ? { display: 'none' } : undefined}>
    {useMemo(
      () => element,
      [location]
    )}
  </div>;
};
