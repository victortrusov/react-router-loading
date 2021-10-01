import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { LoadingContext, LoadingGetterContext } from './LoadingContext';
import { topbar } from '.';

const LoadingMiddleware = ({ children, isLoading = false }) => {
    const [loading, setLoading] = useState(isLoading);
    const isFirstRender = useRef(true);

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

    useEffect(() => {
        if (!isFirstRender.current) {
            // didn't use start() to skip unnecessary topbar triggering
            if (isLoading)
                setLoading(true);
            else
                done();
        } else {
            isFirstRender.current = false;
        }
    }, [isLoading]);

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
