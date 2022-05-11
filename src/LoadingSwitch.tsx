import React, { useState, useContext, useEffect, useMemo, PropsWithChildren, useRef, FC } from 'react';
import { LoadingContext, LoadingGetterContext } from './LoadingContext';
import LoadingMiddleware from './LoadingMiddleware';
import DefaultLoadingScreen from './DefaultLoadingScreen';
import {
    isLoadable,
    isPathsDifferent,
    isPathsEqual,
    isSearchDifferent,
    createRoutesFromChildren,
    replaceWithRoutes,
} from './utils';
import { Routes, useLocation } from 'react-router-dom';

const LOADING_PATHNAME = '__loading';

type SwitcherProps = PropsWithChildren<{
    loadingScreen?: React.ReactNode;
    maxLoadingTime?: number;
}>;

const Switcher: FC<SwitcherProps> = ({ children, loadingScreen: LoadingScreen, maxLoadingTime = 0 }) => {
    const location = useLocation();
    const loadingContext = useContext(LoadingContext);
    const isCurrentlyLoading = useContext(LoadingGetterContext);

    const routes = createRoutesFromChildren(children);

    const [current, setCurrent] = useState<Location>(() => {
        const isFirstPageLoadable = isLoadable(location, routes);

        // if first page uses loading then show loading screen
        return isFirstPageLoadable ? { ...location, location: { pathname: LOADING_PATHNAME } } : location;
    });

    const [next, setNext] = useState<Location>(current);

    const timeout = useRef();

    // when location changed
    useEffect(() => {
        // if not the same route mount it to start loading
        if (isPathsDifferent(location, next)) {
            const isPageLoadable = isLoadable(location, routes);

            setNext(location);

            if (!isPageLoadable) {
                loadingContext.done();
                setCurrent(location);
            } else {
                if (!isCurrentlyLoading) loadingContext.start();
                else loadingContext.restart();
            }
        }

        // if same as current route stop loading
        if (isPathsEqual(location, current)) {
            loadingContext.done();

            if (isSearchDifferent(location, current)) setCurrent(location);
        }
    }, [location]);

    // when loading ends
    useEffect(() => {
        if (!isCurrentlyLoading && isPathsDifferent(current, next)) setCurrent(next);
    }, [isCurrentlyLoading]);

    // setTimeout if maxLoadingTime is provided
    useEffect(() => {
        if (maxLoadingTime > 0) {
            if (timeout.current) {
                clearTimeout(timeout.current);
                timeout.current = undefined;
            }

            if (isPathsDifferent(current, next)) {
                timeout.current = setTimeout(() => {
                    loadingContext.done();
                }, maxLoadingTime);
            }
        }
    }, [current, next]);

    // memo current and next components
    return useMemo(() => {
        if (current.pathname === LOADING_PATHNAME) {
            return LoadingScreen ? <LoadingScreen location={current} /> : <DefaultLoadingScreen location={current} />;
        } else {
            return (
                <Routes location={isPathsDifferent(current, next) ? next : current}>
                    {React.Children.map(children, replaceWithRoutes)}
                </Routes>
            );
        }
    }, [current, next]);
};

// combine topbar and switch
const LoadingSwitch = ({ children, loadingScreen, maxLoadingTime, isLoading }) => (
    <LoadingMiddleware isLoading={isLoading}>
        <Switcher loadingScreen={loadingScreen} maxLoadingTime={maxLoadingTime}>
            {children}
        </Switcher>
    </LoadingMiddleware>
);

export default LoadingSwitch;
