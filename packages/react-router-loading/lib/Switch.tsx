import React, { ElementType, FC, ReactNode } from 'react';
import LoadingSwitch from './_LoadingSwitch';
import LoadingMiddleware from './_LoadingMiddleware';

interface SwitchProps {
  children: ReactNode;
  loadingScreen?: ElementType;
  maxLoadingTime?: number;
  isLoading?: boolean;
}

// combine topbar and loading switch
const Switch: FC<SwitchProps> = ({ children, loadingScreen, maxLoadingTime, isLoading }) =>
  <LoadingMiddleware isLoading={isLoading}>
    <LoadingSwitch loadingScreen={loadingScreen} maxLoadingTime={maxLoadingTime}>
      {children}
    </LoadingSwitch>
  </LoadingMiddleware>;

export default Switch;
