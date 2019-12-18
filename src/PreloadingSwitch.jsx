import React, { useState, useContext, useEffect, useMemo, Suspense, Fragment } from 'react';
import { matchPath, __RouterContext as RouterContext, useLocation } from 'react-router';
import { LoadingContext, LoadingGetterContext } from './LoadingContext';
import LoadingMiddleware from './LoadingMiddleware';

const PreloadingSwitchLogic = ({ children, ...context }) => {
    const loadingContext = useContext(LoadingContext);
    const isLoading = useContext(LoadingGetterContext);
    const location = useLocation();

    const findMatchRoute = (location) => {
        let element, match, preload;

        // We use React.Children.forEach instead of React.Children.toArray().find()
        // here because toArray adds keys to all child elements and we do not want
        // to trigger an unmount/remount for two <Route>s that render the same
        // component at different URLs.
        React.Children.forEach(children, child => {
            if (match == null && React.isValidElement(child)) {
                element = child;
                preload = child.props.preload;
                const path = child.props.path || child.props.from;
                match = matchPath(location.pathname, { ...child.props, path });
            }
        });

        return match
            ? {
                location,
                context,
                preload,
                component: React.cloneElement(element, { location, computedMatch: match })
            }
            : {
                location,
                context,
                preload: false,
                component: null
            };
    };

    const [currentRoute, setCurrentRoute] = useState(() => {
        const firstRoute = findMatchRoute(location);
        return firstRoute.preload
            ? findMatchRoute({ pathname: '/loading' })
            : firstRoute;
    });
    const [nextRoute, setNextRoute] = useState(currentRoute);

    useEffect(() => {
        let route = findMatchRoute(location);

        if (route.location.pathname !== nextRoute.location.pathname) {
            setNextRoute(route);
            if (!route.preload) {
                loadingContext.done();
                setCurrentRoute(route);
            } else {
                if (!isLoading) { loadingContext.start(); } else { loadingContext.skip(); }
            }
        }
        if (route.location.pathname === currentRoute.location.pathname) {
            loadingContext.done();
            if (route.location.search !== currentRoute.location.search) { setCurrentRoute(route); }
        }
    }, [location]);

    useEffect(() => {
        if (!isLoading && nextRoute.location.pathname !== currentRoute.location.pathname) { setCurrentRoute(nextRoute); }
    }, [isLoading]);

    return useMemo(() => <Fragment>
        <div key={currentRoute.location.pathname}>
            <RouterContext.Provider value={currentRoute.context}>
                <Suspense fallback={null}>
                    {currentRoute.component}
                </Suspense>
            </RouterContext.Provider>
        </div>
        {
            nextRoute.location.pathname !== currentRoute.location.pathname &&
            <div key={nextRoute.location.pathname} style={{ display: 'none' }}>
                <RouterContext.Provider value={currentRoute.context}>
                    <Suspense fallback={null}>
                        {nextRoute.component}
                    </Suspense>
                </RouterContext.Provider>
            </div>
        }
    </Fragment>, [currentRoute, nextRoute]);
};

const PreloadingSwitch = ({ children }) =>
    <LoadingMiddleware>
        <RouterContext.Consumer>
            {
                context =>
                    <PreloadingSwitchLogic {...context}>
                        {children}
                    </PreloadingSwitchLogic>
            }
        </RouterContext.Consumer>
    </LoadingMiddleware>;

export default PreloadingSwitch;
