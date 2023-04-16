import React, { FC } from 'react';
import { Route as OriginalRoute, RouteProps as OriginalRouteProps } from 'react-router';

type RouteProps = OriginalRouteProps & {
  loading?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Route: FC<RouteProps> = ({ loading, ...props }) => <OriginalRoute {...props} />;

export default Route;
