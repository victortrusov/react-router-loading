import React, { useState, useContext, useEffect, useMemo, Suspense } from 'react';
import { __RouterContext as RouterContext, useLocation } from 'react-router';
import { LoadingContext, LoadingGetterContext } from './LoadingContext';
import LoadingMiddleware from './LoadingMiddleware';
import DefaultLoadingScreen from './DefaultLoadingScreen';
import { isLoadable, findMatchingElement } from './utils';

const Switcher = ({ children, loadingScreen: LoadingScreen, ...routerContext }) => {
    const loadingContext = useContext(LoadingContext);
    const isCurrentlyLoading = useContext(LoadingGetterContext);
    const location = useLocation();

    const [current, setCurrent] = useState(() => {
        const isFirstPageLoadable = isLoadable(location, children);
        // if first page uses loading then show loading screen
        return isFirstPageLoadable
            ? { showLoadingScreen: true }
            : location;
    });
    const [next, setNext] = useState(current);

    // when location changed
    useEffect(() => {
        const isPageLoadable = isLoadable(location, children);

        // if not the same route mount it to start loading
        if (location?.pathname !== next.location?.pathname) {
            setNext({ location, routerContext });

            if (!isPageLoadable) {
                loadingContext.done();
                setCurrent({ location, routerContext });
            } else {
                if (!isCurrentlyLoading)
                    loadingContext.start();
                else
                    loadingContext.skip();
            }
        }

        // if same as current route stop loading
        if (location?.pathname === current.location?.pathname) {
            loadingContext.done();

            if (location.search !== current.location.search)
                setCurrent({ location, routerContext });
        }
    }, [location]);

    // when loading ends
    useEffect(() => {
        if (!isCurrentlyLoading && next.location?.pathname !== current.location?.pathname)
            setCurrent(next);
    }, [isCurrentlyLoading]);

    // memo current and next components
    return useMemo(
        () => <>
            {/* current */}
            {
                !current.showLoadingScreen
                    ? <RouteComponent key={current.location?.pathname} route={current} allRoutes={children} />
                    : LoadingScreen
                        ? <LoadingScreen location={current.location} />
                        : <DefaultLoadingScreen location={current.location} />
            }

            {/* hidden next */}
            {
                next.location?.pathname !== current.location?.pathname &&
                <RouteComponent key={next.location?.pathname} route={next} allRoutes={children} hidden />
            }
        </>,
        [current, next]
    );
};

// necessary wrappings around route.component
const RouteComponent = ({ route, allRoutes, hidden }) =>
    <div style={hidden ? { display: 'none' } : undefined}>
        {useMemo(
            () => <RouterContext.Provider value={route.routerContext}>
                <Suspense fallback={null}>
                    {findMatchingElement(route.location, allRoutes)}
                </Suspense>
            </RouterContext.Provider>,
            [route]
        )}
    </div>;

// combine topbar and switch
const LoadingSwitch = ({ children, loadingScreen }) =>
    <LoadingMiddleware>
        <RouterContext.Consumer>
            {
                context =>
                    <Switcher {...context} loadingScreen={loadingScreen}>
                        {children}
                    </Switcher>
            }
        </RouterContext.Consumer>
    </LoadingMiddleware>;

export default LoadingSwitch;
