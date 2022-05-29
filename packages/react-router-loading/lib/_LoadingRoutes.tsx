
import React, { useState, useContext, useEffect, useMemo, useRef, PropsWithChildren, FC } from 'react';
import { useLocation, Location } from 'react-router-dom';
import { LoadingContext, LoadingGetterContext } from './LoadingContext';
import DefaultLoadingScreen from './_DefaultLoadingScreen';
import { createRoutesFromChildren, isLoadable, isPathsDifferent, isPathsEqual, isSearchDifferent } from './utils';
import { RouteWrapper } from './_RouteWrapper';

interface LoadingRoutesProps {
  loadingScreen?: React.ElementType;
  maxLoadingTime?: number;
}

const LOADING_PATHNAME = '__loading';

const LoadingRoutes: FC<PropsWithChildren<LoadingRoutesProps>> = ({
  children,
  loadingScreen: LoadingScreen,
  maxLoadingTime = 0
}) => {

  // 🪝 Hooks
  const location = useLocation();
  const loadingContext = useContext(LoadingContext);
  const isCurrentlyLoading = useContext(LoadingGetterContext);

  // 🗄 State
  const routes = useMemo(
    () => createRoutesFromChildren(children),
    [children]
  );

  const [current, setCurrent] = useState<Location>(() => {
    const isFirstPageLoadable = isLoadable(location, routes);

    // if first page loadable showing loading screen
    return isFirstPageLoadable
      ? { ...location, pathname: LOADING_PATHNAME }
      : location;
  });
  const [next, setNext] = useState<Location>(current);

  const timeout: React.MutableRefObject<NodeJS.Timeout | undefined> = useRef();

  // 🔄 Lifecycle
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
        if (!isCurrentlyLoading)
          loadingContext.start();
        else
          loadingContext.restart();
      }
    }

    // if same as current route stop loading
    if (isPathsEqual(location, current)) {
      loadingContext.done();

      if (isSearchDifferent(location, current))
        setCurrent({ ...location });
    }
  }, [location]);

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
        current.pathname !== LOADING_PATHNAME
          ? <RouteWrapper key={current.pathname} routes={routes} location={current} />
          : LoadingScreen
            ? <LoadingScreen />
            : <DefaultLoadingScreen />
      }

      {/* hidden next */}
      {
        isPathsDifferent(current, next) &&
        <RouteWrapper key={next.pathname} routes={routes} location={next} hidden />
      }
    </>,
    [current, next]
  );
};

export default LoadingRoutes;
