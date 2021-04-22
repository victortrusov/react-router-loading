import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { PreloadingSwitch, topbar, Route } from "../../dist";
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
            <Link to='/page1WithoutPreload'>Page 1 without preload</Link>
        </div>
        <hr />
        <article>
            {children}
        </article>
    </Fragment>;

const App = () =>
    <Layout>
        {/* using PreloadingSwitch to do preload */}
        <PreloadingSwitch>
            {/* func component with state */}
            <Route path='/page1' component={Page1} preload />

            {/* same component but with preload off */}
            <Route path='/page1WithoutPreload' component={Page1} />

            {/* class component: have to pass loadingContext in it */}
            <Route path='/page2' component={Page2} preload />

            <Route path='/' component={Main} preload />
        </PreloadingSwitch>
    </Layout>

export default App;
