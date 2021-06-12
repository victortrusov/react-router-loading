import React from 'react';
import { matchPath } from 'react-router';

export const findMatchRoute = (routes, routerContext, location) => {
    let element, match, loading;

    // We use React.Children.forEach instead of React.Children.toArray().find()
    // here because toArray adds keys to all child elements and we do not want
    // to trigger an unmount/remount for two <Route>s that render the same
    // component at different URLs.
    React.Children.forEach(routes, child => {
        if (match == null && React.isValidElement(child)) {
            element = child;
            loading = child.props.loading;
            const path = child.props.path || child.props.from;
            match = matchPath(location.pathname, { ...child.props, path });
        }
    });

    return {
        location,
        routerContext,
        loading: match ? loading : false,
        component: match ? React.cloneElement(element, { location, computedMatch: match }) : null
    };
};
