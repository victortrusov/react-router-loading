import React, { ElementType, FC, ReactNode } from 'react';
import LoadingRoutes from './_LoadingRoutes';
import LoadingMiddleware from './_LoadingMiddleware';

interface RoutesProps {
  children: ReactNode;
  loadingScreen?: ElementType;
  maxLoadingTime?: number;
  isLoading?: boolean;
}

// combine topbar and switcher
const Routes: FC<RoutesProps> = ({ children, loadingScreen, maxLoadingTime, isLoading }) =>
  <LoadingMiddleware isLoading={isLoading}>
    <LoadingRoutes loadingScreen={loadingScreen} maxLoadingTime={maxLoadingTime}>
      {children}
    </LoadingRoutes>
  </LoadingMiddleware>;

export default Routes;
