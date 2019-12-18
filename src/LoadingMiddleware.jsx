import React, { useState, useMemo } from 'react';
import { LoadingContext, LoadingGetterContext } from './LoadingContext';

const topbar =
    typeof window === 'undefined'
        ? {
            show: () => { },
            hide: () => { },
            config: () => { }
        }
        : require('topbar');

topbar.config({
    barColors: {
        '0': 'rgba(26,  188, 156, .7)',
        '.3': 'rgba(41,  128, 185, .7)',
        '1.0': 'rgba(231, 76,  60,  .7)'
    },
    shadowBlur: 0
});

const LoadingMiddleware = ({ children }) => {
    const [loading, setLoading] = useState(false);

    const start = () => {
        topbar.show();
        setLoading(true);
    };

    const done = () => {
        topbar.hide();
        setLoading(false);
    };

    const skip = () => {
        topbar.hide();
        topbar.show();
    };

    return (
        <LoadingGetterContext.Provider value={loading}>
            {useMemo(() => <LoadingContext.Provider
                value={{
                    start,
                    done,
                    skip
                }}
            >
                {children}
            </LoadingContext.Provider>, [])}
        </LoadingGetterContext.Provider>
    );
};

export default LoadingMiddleware;
