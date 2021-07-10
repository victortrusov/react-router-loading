import React, { useState, useMemo, useCallback } from 'react';
import { LoadingContext, LoadingGetterContext } from './LoadingContext';
import { topbar } from '.';

const LoadingMiddleware = ({ children }) => {
    const [loading, setLoading] = useState(false);

    const start = useCallback(() => {
        topbar.show();
        setLoading(true);
    }, []);

    const done = useCallback(() => {
        topbar.hide();
        setLoading(false);
    }, []);

    const restart = useCallback(() => {
        topbar.hide();
        topbar.show();
    }, []);

    const loadingProvider = useMemo(
        () => <LoadingContext.Provider value={{ start, done, restart }}>
            {children}
        </LoadingContext.Provider>,
        []
    );

    return (
        <LoadingGetterContext.Provider value={loading}>
            {loadingProvider}
        </LoadingGetterContext.Provider>
    );
};

export default LoadingMiddleware;
