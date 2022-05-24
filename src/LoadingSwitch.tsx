import React, { useState, useContext, useEffect, useMemo, Suspense, useRef, PropsWithChildren, FC } from 'react';
import { LoadingContext, LoadingGetterContext } from './LoadingContext';
import LoadingMiddleware from './LoadingMiddleware';
import DefaultLoadingScreen, { LoadingScreenProps } from './DefaultLoadingScreen';
import {
    isLoadable,
    isPathsDifferent,
    isPathsEqual,
    isSearchDifferent,
    createRoutesFromChildren,
    replaceWithRoutes,
} from './utils';
import { useLocation, Location, UNSAFE_LocationContext, Routes, NavigationType } from 'react-router-dom';

const LOADING_PATHNAME = '__loading';

type SwitcherProps = PropsWithChildren<{
    loadingScreen?: React.ElementType<LoadingScreenProps>;
    maxLoadingTime?: number;
}>;

const Switcher: FC<SwitcherProps> = ({ children, loadingScreen: LoadingScreen, maxLoadingTime = 0 }) => {
    const location = useLocation();
    const loadingContext = useContext(LoadingContext);
    const isCurrentlyLoading = useContext(LoadingGetterContext);

    const routes = useMemo(() => createRoutesFromChildren(children), []);

    const [current, setCurrent] = useState<Location>(() => {
        const isFirstPageLoadable = isLoadable(location, routes);

        // if first page uses loading then show loading screen
        return isFirstPageLoadable ? { ...location, pathname: LOADING_PATHNAME } : location;
    });
    const [next, setNext] = useState<Location>(current);

    const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);

    // when location changed
    useEffect(() => {
        // if not the same route mount it to start loading
        if (isPathsDifferent(location, next)) {
            const isPageLoadable = isLoadable(location, routes);

            setNext({ ...location });

            if (!isPageLoadable) {
                loadingContext.done();
                setCurrent({ ...location });
            } else {
                if (!isCurrentlyLoading) loadingContext.start();
                else loadingContext.restart();
            }
        }

        // if same as current route stop loading
        if (isPathsEqual(location, current)) {
            loadingContext.done();

            if (isSearchDifferent(location, current)) setCurrent({ ...location });
        }
    }, [location]);

    // when loading ends
    useEffect(() => {
        if (!isCurrentlyLoading && isPathsDifferent(current, next)) setCurrent({ ...next });
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
    return useMemo(
        () => (
            <>
                {/* current */}
                {current.pathname !== LOADING_PATHNAME ? (
                    <RouteComponent key={current?.pathname} location={current}>
                        {children}
                    </RouteComponent>
                ) : LoadingScreen ? (
                    <LoadingScreen location={current} />
                ) : (
                    <DefaultLoadingScreen location={current} />
                )}

                {/* hidden next */}
                {isPathsDifferent(current, next) && (
                    <RouteComponent key={next?.pathname} location={next} hidden>
                        {children}
                    </RouteComponent>
                )}
            </>
        ),
        [current, next]
    );
};

// necessary wrappings around route.component
type RouteComponentProps = PropsWithChildren<{
    location: Location;
    hidden?: boolean;
}>;

const RouteComponent: FC<RouteComponentProps> = ({ location, hidden = false, children }) => (
    <UNSAFE_LocationContext.Provider value={{ location, navigationType: NavigationType.Pop }}>
        <Suspense fallback={null}>
            {!hidden ? (
                <Routes>{React.Children.map(children, replaceWithRoutes)}</Routes>
            ) : (
                <div style={{ display: 'none' }}>
                    <Routes>{React.Children.map(children, replaceWithRoutes)}</Routes>
                </div>
            )}
        </Suspense>
    </UNSAFE_LocationContext.Provider>
);

// combine topbar and switch
type LoadingSwitchProps = PropsWithChildren<SwitcherProps & { isLoading?: boolean }>;

const LoadingSwitch: FC<LoadingSwitchProps> = ({ children, loadingScreen, maxLoadingTime, isLoading }) => (
    <LoadingMiddleware isLoading={isLoading}>
        <Switcher loadingScreen={loadingScreen} maxLoadingTime={maxLoadingTime}>
            {children}
        </Switcher>
    </LoadingMiddleware>
);

export default LoadingSwitch;
