
import React, { useState, useContext, useEffect, useMemo, useRef, PropsWithChildren, FC } from 'react';
import { RouteComponentProps, __RouterContext as RouterContext } from 'react-router';
import { LoadingContext, LoadingGetterContext } from './LoadingContext';
import DefaultLoadingScreen from './_DefaultLoadingScreen';
import { isLoadable, isPathsDifferent, isPathsEqual, isSearchDifferent } from './utils';
import { RouteWrapper } from './_RouteWrapper';

interface LoadingSwitchProps {
  loadingScreen?: React.ElementType;
  maxLoadingTime?: number;
}

const LOADING_PATHNAME = '__loading';

const LoadingSwitch: FC<PropsWithChildren<LoadingSwitchProps>> = ({
  children,
  loadingScreen: LoadingScreen,
  maxLoadingTime = 0
}) => {
  const context = useContext(RouterContext);
  const loadingContext = useContext(LoadingContext);
  const isCurrentlyLoading = useContext(LoadingGetterContext);

  const [current, setCurrent] = useState<RouteComponentProps>(() => {
    const isFirstPageLoadable = isLoadable(context, children);

    // if first page uses loading then show loading screen
    return isFirstPageLoadable
      ? {
        ...context,
        location: { ...context.location, pathname: LOADING_PATHNAME }
      }
      : context;
  });
  const [next, setNext] = useState(current);

  const timeout: React.MutableRefObject<NodeJS.Timeout | undefined> = useRef();

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
        current.location.pathname !== LOADING_PATHNAME
          ? <RouteWrapper key={current.location?.pathname} context={current}>
            {children}
          </RouteWrapper>
          : LoadingScreen
            ? <LoadingScreen />
            : <DefaultLoadingScreen />
      }

      {/* hidden next */}
      {
        isPathsDifferent(current, next) &&
        <RouteWrapper key={next.location?.pathname} context={next} hidden>
          {children}
        </RouteWrapper>
      }
    </>,
    [current, next]
  );
};

export default LoadingSwitch;
