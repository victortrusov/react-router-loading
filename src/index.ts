import { LoadingContext, LoadingGetterContext } from './LoadingContext';
import Routes from './LoadingSwitch';
import Route from './LoadingRoute';

export interface TopBarConfig {
    autoRun?: boolean;
    barThickness?: number;
    barColors?: Record<string, string>;
    shadowBlur?: number;
    shadowColor?: string;
    className?: string;
}

type Topbar = {
    show: () => void;
    hide: () => void;
    config: (c: TopBarConfig) => void;
};

const topbar: Topbar =
    typeof window === 'undefined'
        ? {
              show: () => {},
              hide: () => {},
              config: () => {},
          }
        : require('topbar');

export { topbar, LoadingContext, LoadingGetterContext, Routes, Route };
