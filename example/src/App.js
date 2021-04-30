import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Switch, Route, topbar } from "../../dist";
import { Main } from "./pages/Main";
import { Page1 } from "./pages/Page1";
import { Page2 } from './pages/Page2';

//config topbar
topbar.config({
    barColors: {
        '0': 'rgba(26,  188, 156, .7)',
        '.3': 'rgba(41,  128, 185, .7)',
        '1.0': 'rgba(231, 76,  60,  .7)'
    },
    shadowBlur: 0
})

const Layout = ({ children }) =>
    <Fragment>
        <div style={{ display: "flex", flexFlow: "column" }} >
            <Link to='/'>Main</Link>
            <Link to='/page1'>Page 1</Link>
            <Link to='/page2'>Page 2</Link>
            <br />
            <Link to='/page1WithoutLoading'>Page 1 without loading</Link>
        </div>
        <hr />
        <article>
            {children}
        </article>
    </Fragment>;

const App = () =>
    <Layout>
        {/* using Switch from react-router-loading */}
        <Switch>
            {/* func component with state */}
            <Route path='/page1' component={Page1} loading />

            {/* same component but without loading prop */}
            <Route path='/page1WithoutLoading' component={Page1} />

            {/* class component: have to pass loadingContext in it */}
            <Route path='/page2' component={Page2} loading />

            <Route path='/' component={Main} loading />
        </Switch>
    </Layout>

export default App;
