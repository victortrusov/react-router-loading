import React, { useState, useMemo } from 'react';
import { LoadingContext, LoadingGetterContext } from './LoadingContext';
import { topbar } from '.';

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
