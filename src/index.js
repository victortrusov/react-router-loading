import { LoadingContext, LoadingGetterContext } from './LoadingContext';
import PreloadingSwitch from './PreloadingSwitch';
import Route from './PreloadingRoute';

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
    PreloadingSwitch,
    Route
};
