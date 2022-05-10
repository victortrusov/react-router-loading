import React from 'react';
import { Route } from 'react-router-dom';

// Route for typescript
const LoadingRoute = ({
    location,
    component,
    render,
    children,
    path,
    exact,
    sensitive,
    strict,
    loading
}) =>
    <Route
        location={location}
        component={component}
        render={render}
        path={path}
        exact={exact}
        sensitive={sensitive}
        strict={strict}
    >
        {children}
    </Route>;

export default LoadingRoute;
