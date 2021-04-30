# react-router-loading

### Custom react router switch that allows you to load data before switching the screen
\
[![npm version](https://badge.fury.io/js/react-router-loading.svg)](https://badge.fury.io/js/react-router-loading)

\
![](example.gif)

[DEMO](https://codesandbox.io/s/react-router-loading-demo-sguvm)

## Requirements
```js
"react": "^16.8.0 || ^17.0.0",
"react-dom": "^16.8.0 || ^17.0.0",
"react-router-dom": "^5.0.0"
```

## Installation

```console
npm install react-router-loading
## or
yarn add react-router-loading
```

## Usage

In your router section import `Switch` and `Route` from `react-router-loading` instead of `react-router-dom`
```js
import { Switch, Route } from "react-router-loading";

<Switch>
    <Route />
    <Route />
    ...
</Switch>
```

Add `loading` prop to every route that must be loaded before switching
```js
<Switch>
    //data will be loaded before switching
    <Route loading />

    //instant switch as before
    <Route />
    ...
</Switch>
```

Add `loadingContext.done()` at the end of your initial loading method in pages that uses in routes you marked with `loading` prop
```js
import { LoadingContext } from "react-router-loading";
const loadingContext = useContext(LoadingContext);

const loading = async () => {
    //loading some data

    //call method to indicate that loading is done and we are ready to switch
    loadingContext.done();
};
```
or for class components
```js
import { LoadingContext } from "react-router-loading";

class ClassComponent extends React.Component {
    ...
    loading = async () => {
        //loading some data

        //call method from props to indicate that loading is done
        this.props.loadingContext.done();
    };
    ...
};

//we should wrap class component with Context Provider to get access to loading methods
const ClassComponentWrapper = (props) =>
    <LoadingContext.Consumer>
        {loadingContext => <ClassComponent loadingContext={loadingContext} {...props} />}
    </LoadingContext.Consumer>

```

## Config

You can specify loading screen that would be shown at first loading of your app
```js
const MyLoadingScreen = () => <div>Loading...</div>

<Switch loadingScreen={MyLoadingScreen}>
...
</Switch>
```

Call `topbar.config()` if you want to change topbar configuration. More info http://buunguyen.github.io/topbar/.
```js
import { topbar } from "react-router-loading";

topbar.config({
    barColors: {
        '0': 'rgba(26,  188, 156, .7)',
        '.3': 'rgba(41,  128, 185, .7)',
        '1.0': 'rgba(231, 76,  60,  .7)'
    },
    shadowBlur: 0
});
```
## Example

Clone repository and run
```
yarn build && yarn start
```

## License

[MIT](./LICENSE)
