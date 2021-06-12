import React, { useState, useContext, useEffect, useMemo, Suspense, Fragment } from 'react';
import { __RouterContext as RouterContext, useLocation } from 'react-router';
import { LoadingContext, LoadingGetterContext } from './LoadingContext';
import LoadingMiddleware from './LoadingMiddleware';
import DefaultLoadingScreen from './DefaultLoadingScreen';
import { findMatchRoute } from './utils';

const LoadingSwitchLogic = ({ children, loadingScreen: LoadingScreen, ...routerContext }) => {
    const loadingContext = useContext(LoadingContext);
    const isLoading = useContext(LoadingGetterContext);
    const location = useLocation();

    const [currentRoute, setCurrentRoute] = useState(() => {
        const firstRoute = findMatchRoute(children, routerContext, location);
        // if first page uses loading then show loading screen
        return firstRoute.loading
            ? {
                location: 'loading',
                routerContext,
                component: LoadingScreen
                    ? <LoadingScreen location={location} />
                    : <DefaultLoadingScreen location={location} />
            }
            : firstRoute;
    });
    const [nextRoute, setNextRoute] = useState(currentRoute);

    // when location changed
    useEffect(() => {
        const route = findMatchRoute(children, routerContext, location);

        // if not the same route mount it to start loading
        if (route.location.pathname !== nextRoute.location.pathname) {
            setNextRoute(route);
            if (!route.loading) {
                loadingContext.done();
                setCurrentRoute(route);
            } else {
                if (!isLoading) { loadingContext.start(); } else { loadingContext.skip(); }
            }
        }

        // if same as current route stop loading
        if (route.location.pathname === currentRoute.location.pathname) {
            loadingContext.done();
            if (route.location.search !== currentRoute.location.search) { setCurrentRoute(route); }
        }
    }, [location]);

    // when loading ends
    useEffect(() => {
        if (!isLoading && nextRoute.location.pathname !== currentRoute.location.pathname) { setCurrentRoute(nextRoute); }
    }, [isLoading]);

    // memo current and next components
    return useMemo(
        () => <>
            {/* current */}
            <RouteComponent key={currentRoute.location.pathname} route={currentRoute} />
            {/* hidden next */}
            {
                nextRoute.location.pathname !== currentRoute.location.pathname &&
                <RouteComponent key={nextRoute.location.pathname} route={nextRoute} hidden />
            }
        </>,
        [currentRoute, nextRoute]
    );
};

// necessary wrappings around route.component
const RouteComponent = ({ route, hidden }) =>
    <div style={hidden ? { display: 'none' } : undefined}>
        <RouterContext.Provider value={route.routerContext}>
            <Suspense fallback={null}>
                {route.component}
            </Suspense>
        </RouterContext.Provider>
    </div>;

// combine topbar and switch
const LoadingSwitch = ({ children, loadingScreen }) =>
    <LoadingMiddleware>
        <RouterContext.Consumer>
            {
                context =>
                    <LoadingSwitchLogic {...context} loadingScreen={loadingScreen}>
                        {children}
                    </LoadingSwitchLogic>
            }
        </RouterContext.Consumer>
    </LoadingMiddleware>;

export default LoadingSwitch;
