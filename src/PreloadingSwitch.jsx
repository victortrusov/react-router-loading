import React, { useState, useContext, useEffect, useMemo, Suspense, Fragment } from 'react';
import { matchPath, __RouterContext as RouterContext, useLocation } from 'react-router';
import { LoadingContext, LoadingGetterContext } from './LoadingContext';
import LoadingMiddleware from './LoadingMiddleware';
import DefaultLoadingScreen from './DefaultLoadingScreen';

const PreloadingSwitchLogic = ({ children, loadingScreen, ...context }) => {
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

        return {
            location,
            context,
            preload: match ? preload : false,
            component: match ? React.cloneElement(element, { location, computedMatch: match }) : null
        }
    };

    const [currentRoute, setCurrentRoute] = useState(() => {
        const firstRoute = findMatchRoute(location);
        //if first page uses preload then show loading screen
        return firstRoute.preload
            ? {
                location: "loading",
                context,
                component: loadingScreen
                    ? <loadingScreen location={location} />
                    : <DefaultLoadingScreen location={location} />
            }
            : firstRoute;
    });
    const [nextRoute, setNextRoute] = useState(currentRoute);

    //when location changed
    useEffect(() => {
        let route = findMatchRoute(location);

        //if not the same route mount it to start loading
        if (route.location.pathname !== nextRoute.location.pathname) {
            setNextRoute(route);
            if (!route.preload) {
                loadingContext.done();
                setCurrentRoute(route);
            } else {
                if (!isLoading) { loadingContext.start(); } else { loadingContext.skip(); }
            }
        }

        //if same as current route stop loading
        if (route.location.pathname === currentRoute.location.pathname) {
            loadingContext.done();
            if (route.location.search !== currentRoute.location.search) { setCurrentRoute(route); }
        }
    }, [location]);

    //when loading ends
    useEffect(() => {
        if (!isLoading && nextRoute.location.pathname !== currentRoute.location.pathname) { setCurrentRoute(nextRoute); }
    }, [isLoading]);

    //memo and current and next components
    return useMemo(() => <Fragment>
        {/* current */}
        <div key={currentRoute.location.pathname}>
            <RouterContext.Provider value={currentRoute.context}>
                <Suspense fallback={null}>
                    {currentRoute.component}
                </Suspense>
            </RouterContext.Provider>
        </div>
        {/* hidden next */}
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

//combine topbar and switch
const PreloadingSwitch = ({ children, loadingScreen }) =>
    <LoadingMiddleware>
        <RouterContext.Consumer>
            {
                context =>
                    <PreloadingSwitchLogic {...context} loadingScreen={loadingScreen}>
                        {children}
                    </PreloadingSwitchLogic>
            }
        </RouterContext.Consumer>
    </LoadingMiddleware>;

export default PreloadingSwitch;
