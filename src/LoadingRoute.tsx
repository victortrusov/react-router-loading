import React, { FC } from 'react';
import { Route, RouteProps } from 'react-router-dom';

export type LoadingRouteProps = RouteProps & {
    loading?: boolean;
};

const LoadingRoute: FC<RouteProps> = ({ loading, ...props }) => <Route {...props} />;

export default LoadingRoute;
