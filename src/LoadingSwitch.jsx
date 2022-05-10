import React, { useState, useContext, useEffect, useMemo, Suspense, useRef } from 'react';
import { __RouterContext as RouterContext } from 'react-router-dom';
import { LoadingContext, LoadingGetterContext } from './LoadingContext';
import LoadingMiddleware from './LoadingMiddleware';
import DefaultLoadingScreen from './DefaultLoadingScreen';
import { isLoadable, findMatchingElement, isPathsDifferent, isPathsEqual, isSearchDifferent } from './utils';

const loadingPathname = '__loading';

const Switcher = ({
    children,
    loadingScreen: LoadingScreen,
    maxLoadingTime = 0
}) => {
    const context = useContext(RouterContext);
    const loadingContext = useContext(LoadingContext);
    const isCurrentlyLoading = useContext(LoadingGetterContext);

    const [current, setCurrent] = useState(() => {
        const isFirstPageLoadable = isLoadable(context, children);

        // if first page uses loading then show loading screen
        return isFirstPageLoadable
            ? { ...context, location: { pathname: loadingPathname } }
            : context;
    });
    const [next, setNext] = useState(current);

    const timeout = useRef();

    // when location changed
    useEffect(() => {
        // if not the same route mount it to start loading
        if (isPathsDifferent(context, next)) {
            const isPageLoadable = isLoadable(context, children);

            setNext({ ...context });

            if (!isPageLoadable) {
                loadingContext.done();
                setCurrent({ ...context });
            } else {
                if (!isCurrentlyLoading)
                    loadingContext.start();
                else
                    loadingContext.restart();
            }
        }

        // if same as current route stop loading
        if (isPathsEqual(context, current)) {
            loadingContext.done();

            if (isSearchDifferent(context, current))
                setCurrent({ ...context });
        }
    }, [context]);

    // when loading ends
    useEffect(() => {
        if (!isCurrentlyLoading && isPathsDifferent(current, next))
            setCurrent(next);
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
        () => <>
            {/* current */}
            {
                current.location.pathname !== loadingPathname
                    ? <RouteComponent key={current.location?.pathname} context={current} allRoutes={children} />
                    : LoadingScreen
                        ? <LoadingScreen location={current.location} />
                        : <DefaultLoadingScreen location={current.location} />
            }

            {/* hidden next */}
            {
                isPathsDifferent(current, next) &&
                <RouteComponent key={next.location?.pathname} context={next} allRoutes={children} hidden />
            }
        </>,
        [current, next]
    );
};

// necessary wrappings around route.component
const RouteComponent = ({ context, allRoutes, hidden }) =>
    <div style={hidden ? { display: 'none' } : undefined}>
        {useMemo(
            () => <RouterContext.Provider value={context}>
                <Suspense fallback={null}>
                    {findMatchingElement(context, allRoutes)}
                </Suspense>
            </RouterContext.Provider>,
            [context]
        )}
    </div>;

// combine topbar and switch
const LoadingSwitch = ({ children, loadingScreen, maxLoadingTime, isLoading }) =>
    <LoadingMiddleware isLoading={isLoading}>
        <Switcher loadingScreen={loadingScreen} maxLoadingTime={maxLoadingTime}>
            {children}
        </Switcher>
    </LoadingMiddleware>;

export default LoadingSwitch;
