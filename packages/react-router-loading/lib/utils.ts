import React from 'react';
import { matchPath } from 'react-router';

export const isPathsDifferent = (first, second) =>
  first.location?.pathname !== second.location?.pathname;

export const isPathsEqual = (first, second) =>
  first.location?.pathname === second.location?.pathname;

export const isSearchDifferent = (first, second) =>
  first.location?.search !== second.location?.search;

const findMatchingRoute = (context, routes, callback = (matchingElement) => { }) => {
  let match;

  // We use React.Children.forEach instead of React.Children.toArray().find()
  // here because toArray adds keys to all child elements and we do not want
  // to trigger an unmount/remount for two <Route>s that render the same
  // component at different URLs.
  React.Children.forEach(routes, child => {
    if (match == null && React.isValidElement(child)) {
      const path = (child.props as any).path || (child.props as any).from;

      match = path
        ? matchPath(context.location?.pathname, { ...(child.props as any), path })
        : context?.match;

      if (match)
        callback(child);
    }
  });

  return match;
};

export const isLoadable = (context, routes) => {
  let isLoadable;

  const match = findMatchingRoute(
    context,
    routes,
    (matchingElement) => { isLoadable = matchingElement.props.loading; }
  );

  return match ? isLoadable : false;
};

export const findMatchingElement = (context, routes) => {
  let element;

  const match = findMatchingRoute(
    context,
    routes,
    (matchingElement) => { element = matchingElement; }
  );

  return match
    ? React.cloneElement(element, { location: context.location, computedMatch: match })
    : null;
};
