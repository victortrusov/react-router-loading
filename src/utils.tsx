import React from 'react';
import { matchPath, RouteObject, Location, Route } from 'react-router-dom';

export default function invariant(expr: any, msg: string): asserts expr {
    if (!expr) {
        throw new Error(msg);
    }
}

export const isPathsDifferent = (first: Location, second: Location) => first.pathname !== second.pathname;
export const isPathsEqual = (first: Location, second: Location) => !isPathsDifferent(first, second);
export const isSearchDifferent = (first: Location, second: Location) => first.search !== second.search;

export type LoadingRouteObject = RouteObject & {
    loading?: boolean;
};

// adapted from original createRoutesFromChildren
export function createRoutesFromChildren(children: React.ReactNode): LoadingRouteObject[] {
    let routes: LoadingRouteObject[] = [];

    React.Children.forEach(children, element => {
        if (!React.isValidElement(element)) {
            // Ignore non-elements. This allows people to more easily inline
            // conditionals in their route config.
            return;
        }

        if (element.type === React.Fragment) {
            // Transparently support React.Fragment and its children.
            routes.push.apply(routes, createRoutesFromChildren(element.props.children));
            return;
        }

        let route: LoadingRouteObject = {
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
const findMatchingRoute = (
    location: Location,
    routes: LoadingRouteObject[],
    pathParts: string[] = []
): LoadingRouteObject | null => {
    for (let route of routes) {
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

export const replaceWithRoutes = element => {
    if (!React.isValidElement(element)) {
        return;
    }

    if (element.type === React.Fragment) {
        return <>{React.Children.map(element.props.children, replaceWithRoutes)}</>;
    }

    const { loading, ...routeProps } = element.props;

    if (element.props.children) {
        return <Route {...routeProps}>{React.Children.map(element.props.children, replaceWithRoutes)}</Route>;
    }

    return <Route {...routeProps} />;
};

export const isLoadable = (location: Location, routes: LoadingRouteObject[]) =>
    !!findMatchingRoute(location, routes)?.loading;
