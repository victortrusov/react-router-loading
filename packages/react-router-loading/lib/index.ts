import { LoadingContext, LoadingGetterContext } from './LoadingContext';
import Switch from './LoadingSwitch';
import Route from './LoadingRoute';

const topbar =
  typeof window === 'undefined'
    ? {
      show: () => { },
      hide: () => { },
      config: () => { }
    }
    : require('topbar');

export {
  topbar,
  LoadingContext,
  LoadingGetterContext,
  Switch,
  Route
};
