import React from 'react';
import { Route } from 'react-router';

//Route for typescript
const PreloadingRoute = ({
    location,
    component,
    render,
    children,
    path,
    exact,
    sensitive,
    strict,
    preload
}) =>
    <Route
        location={location}
        component={component}
        render={render}
        children={children}
        path={path}
        exact={exact}
        sensitive={sensitive}
        strict={strict}
    />;

export default PreloadingRoute;
