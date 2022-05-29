import { default as _topbar } from 'topbar';
export { LoadingContext, LoadingGetterContext } from './LoadingContext';
export { default as Route } from './Route';
export { default as Switch } from './Switch';

export interface TopBarConfig {
  autoRun?: boolean;
  barThickness?: number;
  barColors?: Record<number, string>;
  shadowBlur?: number;
  shadowColor?: string;
  className?: string;
}

export interface TopBar {
  show: () => void;
  hide: () => void;
  config: (conf: TopBarConfig) => void;
}

const topbar: TopBar = _topbar;

export { topbar };
