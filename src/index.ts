import { LoadingContext, LoadingGetterContext } from './LoadingContext';
import Switch from './LoadingSwitch';
import Route from './LoadingRoute';

export interface TopBarConfig {
    autoRun?: boolean;
    barThickness?: number;
    barColors?: Record<number, string>;
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

export { topbar, LoadingContext, LoadingGetterContext, Switch, Route };
