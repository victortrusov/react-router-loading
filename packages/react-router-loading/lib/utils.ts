import React, { ReactElement } from 'react';
import { matchPath, RouteComponentProps } from 'react-router';

export const isPathsDifferent = (first: RouteComponentProps, second: RouteComponentProps) =>
  first.location?.pathname !== second.location?.pathname;

export const isPathsEqual = (first: RouteComponentProps, second: RouteComponentProps) =>
  first.location?.pathname === second.location?.pathname;

export const isSearchDifferent = (first: RouteComponentProps, second: RouteComponentProps) =>
  first.location?.search !== second.location?.search;

const findMatchingRoute = (
  context: RouteComponentProps,
  routes: React.ReactNode,
  callback: (matchingElement: ReactElement) => void
) => {
  let match;

  // We use React.Children.forEach instead of React.Children.toArray().find()
  // here because toArray adds keys to all child elements and we do not want
  // to trigger an unmount/remount for two <Route>s that render the same
  // component at different URLs.
  React.Children.forEach(routes, child => {
    if (match == null && React.isValidElement(child)) {
      const path = child.props.path || child.props.from;

      match = path
        ? matchPath(context.location?.pathname, { ...child.props, path })
        : context?.match;

      if (match)
        callback(child);
    }
  });

  return match;
};

export const isLoadable = (context: RouteComponentProps, routes: React.ReactNode) => {
  let isLoadable: boolean;

  const match = findMatchingRoute(
    context,
    routes,
    (matchingElement) => { isLoadable = matchingElement.props.loading; }
  );

  return match ? isLoadable : false;
};

export const findMatchingElement = (context: RouteComponentProps, routes: React.ReactNode) => {
  let element: ReactElement;

  const match = findMatchingRoute(
    context,
    routes,
    (matchingElement) => { element = matchingElement; }
  );

  return match
    ? React.cloneElement(element, { location: context.location, computedMatch: match })
    : null;
};
