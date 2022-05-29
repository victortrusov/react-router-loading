
import React, { useState, useContext, useEffect, useMemo, useRef, PropsWithChildren, FC } from 'react';
import { useLocation, Location, useNavigationType, NavigationType } from 'react-router-dom';
import { LoadingContext, LoadingGetterContext } from './LoadingContext';
import DefaultLoadingScreen from './_DefaultLoadingScreen';
import { createRoutesFromChildren, isLoadable, isPathsDifferent, isPathsEqual, isSearchDifferent } from './utils';
import { RouteWrapper } from './_RouteWrapper';

interface LoadingRoutesProps {
  loadingScreen?: React.ElementType;
  maxLoadingTime?: number;
}

interface LoadingRoutesState {
  location: Location;
  navigationType: NavigationType;
}

const LOADING_PATHNAME = '__loading';

const LoadingRoutes: FC<PropsWithChildren<LoadingRoutesProps>> = ({
  children,
  loadingScreen: LoadingScreen,
  maxLoadingTime = 0
}) => {

  // 🪝 Hooks
  const location = useLocation();
  const navigationType = useNavigationType();
  const loadingContext = useContext(LoadingContext);
  const isCurrentlyLoading = useContext(LoadingGetterContext);

  // 🗄 State
  const routes = useMemo(
    () => createRoutesFromChildren(children),
    [children]
  );

  const [current, setCurrent] = useState<LoadingRoutesState>(() => {
    const isFirstPageLoadable = isLoadable(location, routes);

    // if first page loadable showing loading screen
    const firstLocation = isFirstPageLoadable
      ? { ...location, pathname: LOADING_PATHNAME }
      : location;

    return {
      location: firstLocation,
      navigationType: navigationType
    };
  });
  const [next, setNext] = useState<LoadingRoutesState>(current);

  const timeout: React.MutableRefObject<NodeJS.Timeout | undefined> = useRef();

  // 🔄 Lifecycle
  // when location was changed
  useEffect(() => {
    // if not the same route mount it to start loading
    if (isPathsDifferent(location, next.location)) {
      const isPageLoadable = isLoadable(location, routes);

      setNext({
        location: { ...location },
        navigationType
      });

      if (!isPageLoadable) {
        loadingContext.done();
        setCurrent({
          location: { ...location },
          navigationType
        });
      } else {
        if (!isCurrentlyLoading)
          loadingContext.start();
        else
          loadingContext.restart();
      }
    }

    // if same as the current location stop loading
    if (isPathsEqual(location, current.location)) {
      loadingContext.done();

      if (isSearchDifferent(location, current.location))
        setCurrent({
          location: { ...location },
          navigationType
        });
    }
  }, [location]);

  // when loading is done
  useEffect(() => {
    if (!isCurrentlyLoading && isPathsDifferent(current.location, next.location))
      setCurrent(next);
  }, [isCurrentlyLoading]);

  // setTimeout if maxLoadingTime is provided
  useEffect(() => {
    if (maxLoadingTime > 0) {
      if (timeout.current) {
        clearTimeout(timeout.current);
        timeout.current = undefined;
      }

      if (isPathsDifferent(current.location, next.location)) {
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
        current.location.pathname !== LOADING_PATHNAME
          ? <RouteWrapper
            key={current.location.pathname}
            routes={routes}
            location={current.location}
            navigationType={current.navigationType}
          />
          : LoadingScreen
            ? <LoadingScreen />
            : <DefaultLoadingScreen />
      }

      {/* hidden next */}
      {
        isPathsDifferent(current.location, next.location) &&
        <RouteWrapper
          key={next.location.pathname}
          routes={routes}
          location={next.location}
          navigationType={next.navigationType}
          hidden
        />
      }
    </>,
    [current, next]
  );
};

export default LoadingRoutes;
