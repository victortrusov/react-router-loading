import React from 'react';
import { matchPath } from 'react-router';

const findMatchingRoute = (location, routes, callback = (matchingElement) => { }) => {
    let match;

    // We use React.Children.forEach instead of React.Children.toArray().find()
    // here because toArray adds keys to all child elements and we do not want
    // to trigger an unmount/remount for two <Route>s that render the same
    // component at different URLs.
    React.Children.forEach(routes, child => {
        if (match == null && React.isValidElement(child)) {
            const path = child.props.path || child.props.from;
            match = matchPath(location?.pathname, { ...child.props, path });

            if (match)
                callback(child);
        }
    });

    return match;
};

export const isLoadable = (location, routes) => {
    let isLoadable;

    const match = findMatchingRoute(
        location,
        routes,
        (matchingElement) => { isLoadable = matchingElement.props.loading; }
    );

    return match ? isLoadable : false;
};

export const findMatchingElement = (location, routes) => {
    let element;

    const match = findMatchingRoute(
        location,
        routes,
        (matchingElement) => { element = matchingElement; }
    );

    return match
        ? React.cloneElement(element, { location, computedMatch: match })
        : null;
};
