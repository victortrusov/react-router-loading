# react-easy-preload
Custom react router switch with [topbar](https://github.com/buunguyen/topbar) for easy data preloading

![](example.gif)

## Requirements
```
"react": "^16.8.0",
"react-dom": "^16.8.0",
"react-router-dom": "^5.0.0"
```

## Installation

```console
npm install react-easy-preload
## or
yarn add react-easy-preload
```

## Usage

In your router section change react-router-dom's `Switch` to `PreloadingSwitch`
```
import { PreloadingSwitch } from "react-easy-preload";

<PreloadingSwitch>
    <Route />
    <Route />
    ...
</PreloadingSwitch>
```

Add `preload` prop to every route that must be loaded before switching
```
<PreloadingSwitch>
    //data will be loaded before switching
    <Route preload />

    //instant switch as before
    <Route />
    ...
</PreloadingSwitch>
```

Add `loadingContext.done()` at the end of your initial loading method in pages that uses in routes you marked with `preload` prop
```
import { LoadingContext } from "react-easy-preload";
const loadingContext = useContext(LoadingContext);

const loading = async () => {
    //loading some data

    //call method to indicate that loading is done and we are ready to switch
    loadingContext.done();
};
```
or for class components
```
import { LoadingContext } from "react-easy-preload";

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
```
const MyLoadingScreen = () => <div>Loading...</div>

<PreloadingSwitch loadingScreen={MyLoadingScreen}>
...
</PreloadingSwitch>
```

Call `topbar.config()` if you want to change topbar configuration. More info http://buunguyen.github.io/topbar/.
```
import { topbar } from "react-easy-preload";

topbar.config({
    barColors: {
        '0': 'rgba(26,  188, 156, .7)',
        '.3': 'rgba(41,  128, 185, .7)',
        '1.0': 'rgba(231, 76,  60,  .7)'
    },
    shadowBlur: 0
});
```
## License

[MIT](./LICENSE)