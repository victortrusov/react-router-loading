import React from 'react';
import { matchPath, RouteObject, Location } from 'react-router-dom';

export type LoadingRouteObject = RouteObject & {
  loading?: boolean;
};

// adapted from original createRoutesFromChildren
// https://github.com/remix-run/react-router/blob/0f9435a8134b2b5dddfd716a18d17aefe4461fe1/packages/react-router/lib/components.tsx
export function createRoutesFromChildren(children: React.ReactNode): LoadingRouteObject[] {
  const routes: LoadingRouteObject[] = [];

  React.Children.forEach(children, element => {
    if (!React.isValidElement(element)) {
      // Ignore non-elements. This allows people to more easily inline
      // conditionals in their route config.
      return;
    }

    if (element.type === React.Fragment) {
      // Transparently support React.Fragment and its children.
      // eslint-disable-next-line prefer-spread
      routes.push.apply(routes, createRoutesFromChildren(element.props.children));
      return;
    }

    const route: LoadingRouteObject = {
      caseSensitive: element.props.caseSensitive,
      element: element.props.element,
      index: element.props.index,
      path: element.props.path,
      loading: element.props.loading,
    };

    if (element.props.children) {
      route.children = createRoutesFromChildren(element.props.children);
    }

    routes.push(route);
  });

  return routes;
}

export const isPathsDifferent = (first: Location, second: Location) =>
  first.pathname !== second.pathname;

export const isPathsEqual = (first: Location, second: Location) =>
  first.pathname === second.pathname;

export const isSearchDifferent = (first: Location, second: Location) =>
  first.search !== second.search;

const findMatchingRoute = (
  location: Location,
  routes: LoadingRouteObject[],
  pathParts: string[] = []
): LoadingRouteObject | null => {
  for (const route of routes) {
    const allParts = [...pathParts, route.path];
    if (matchPath(location.pathname, allParts.join(''))) {
      return route;
    }
    if (route.children?.length) {
      return findMatchingRoute(location, route.children, allParts);
    }
  }

  return null;
};

export const isLoadable = (location: Location, routes: LoadingRouteObject[]) =>
  !!findMatchingRoute(location, routes)?.loading;
