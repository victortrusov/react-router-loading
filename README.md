# react-router-loading [![npm version](https://badge.fury.io/js/react-router-loading.svg)](https://badge.fury.io/js/react-router-loading)

Wrapper for `react-router` that allows you to load data before switching the screen  

### ‼️ Version `1.x.x` supports React Router 6 only, please use version `0.x.x` for React Router 5 ‼️

\
![](example.gif)

<a href="https://codesandbox.io/s/react-router-loading-demo-sguvm" target="_blank">DEMO</a>

## Requirements

|  |  |  |
| ------------ | ------- | --- |
| react        | >= 16.8 |     |
| react-router | **^5.0.0** |  **Package version 0.x.x**  |
| react-router | **^6.0.0** |  **Package version 1.x.x**  |

This package uses `react-router` (`react-router-dom` or `react-router-native`) as main router so you should implement it in your project first.

## Installation

```console
npm install react-router-loading
## or
yarn add react-router-loading
```
# Usage
## React Router 6 (package version 1.x.x)

In your router section import `Routes` and `Route` from `react-router-loading` instead of `react-router-dom` or `react-router-native`
```js
import { Routes, Route } from "react-router-loading";

<Routes>
    <Route path="/page1" element={<Page1 />} />
    <Route path="/page2" element={<Page2 />} />
    ...
</Routes>
```

Add `loading` prop to every route that needs to be loaded before switching
```js
<Routes>
    // data will be loaded before switching
    <Route path="/page1" element={<Page1 />} loading />

    // instant switch as before
    <Route path="/page2" element={<Page2 />} />
    ...
</Routes>
```

Add `loadingContext.done()` at the end of your initial loading method in components that mentioned in routes with `loading` prop (in this case it's `Page1`)
```js
import { useLoadingContext } from "react-router-loading";
const loadingContext = useLoadingContext();

const loading = async () => {
    // loading some data

    // call method to indicate that loading is done and we are ready to switch
    loadingContext.done();
};
```

## React Router 5 (package version 0.x.x)

In your router section import `Switch` and `Route` from `react-router-loading` instead of `react-router-dom`
```js
import { Switch, Route } from "react-router-loading";

<Switch>
    <Route path="/page1" component={Page1} />
    <Route path="/page2" component={Page2} />
    ...
</Switch>
```

Add `loading` prop to every route that needs to be loaded before switching
```js
<Switch>
    // data will be loaded before switching
    <Route path="/page1" component={Page1} loading />

    // instant switch as before
    <Route path="/page2" component={Page2} />
    ...
</Switch>
```

Add `loadingContext.done()` at the end of your initial loading method in components that mentioned in routes with `loading` prop (in this case it's `Page1`)
```js
import { LoadingContext } from "react-router-loading";
const loadingContext = useContext(LoadingContext);

const loading = async () => {
    // loading some data

    // call method to indicate that loading is done and we are ready to switch
    loadingContext.done();
};
```
## Class components
```js
import { LoadingContext } from "react-router-loading";

class ClassComponent extends React.Component {
    ...
    loading = async () => {
        // loading some data

        // call method from props to indicate that loading is done
        this.props.loadingContext.done();
    };
    ...
};

// we should wrap class component with Context Provider to get access to loading methods
const ClassComponentWrapper = (props) =>
    <LoadingContext.Consumer>
        {loadingContext => <ClassComponent loadingContext={loadingContext} {...props} />}
    </LoadingContext.Consumer>

```

## Config

You can specify loading screen that will be shown at the first loading of your app
```js
const MyLoadingScreen = () => <div>Loading...</div>

<Routes loadingScreen={MyLoadingScreen}> // or <Switch>
...
</Routes>
```

Use `maxLoadingTime` property if you want to limit loading time. Pages will switch if loading takes more time than specified in this property (ms).
```js

<Routes maxLoadingTime={500}> // or <Switch>
...
</Routes>
```

If you want to change LoadingContext globally you can pass `isLoading` property to the `<Routes />` or `<Switch />`. This way you don't need to add extra `loadingContext.done();` in your page components after fetching is done.
```js
import { useIsFetching } from 'react-query';
const isFetching = useIsFetching();

<Routes isLoading={isFetching}> // or <Switch>
...
</Routes>
```

Call `topbar.config()` if you want to change topbar configuration. More info <a href="http://buunguyen.github.io/topbar/" target="_blank">here</a>.
```js
import { topbar } from "react-router-loading";

topbar.config({
    autoRun: false,
    barThickness: 5,
    barColors: {
        0: 'rgba(26,  188, 156, .7)',
        .3: 'rgba(41,  128, 185, .7)',
        1.0: 'rgba(231, 76,  60,  .7)'
    },
    shadowBlur: 5,
    shadowColor: 'red',
    className: 'topbar'
});
```
# Development

Clone repository and run
```sh
# go to lib folder
cd packages/react-router-loading

# restore packages
yarn

# build lib
yarn build

# go to example folder
cd ../../examples/react-router-6

# restore packages
yarn

# run example
yarn dev
```

run `yarn build` in lib folder each time you want to apply changes

## License

[MIT](./LICENSE)
