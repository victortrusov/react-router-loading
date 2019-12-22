import React, { Fragment, useContext, useMemo } from 'react';
import { Route, Link } from 'react-router-dom';
import { LoadingContext, PreloadingSwitch } from "../../dist";
import { Main, Page1, Page2Wrapper } from './Pages';

const Layout = ({ children }) =>
    <Fragment>
        <div style={{ display: "flex", flexFlow: "column" }} >
            <Link to='/'>Main</Link>
            <Link to='/page1'>Page 1</Link>
            <Link to='/page2'>Page 2 - classic component</Link>
            <br />
            <Link to='/page1WithoutPreload'>Page 1 without preload</Link>
        </div>
        <article>
            {children}
        </article>
    </Fragment>;


const App = () => {


    return (
        <Layout>
            <PreloadingSwitch>
                {/* func component with state */}
                <Route path='/page1' component={Page1} preload />

                <Route path='/page1WithoutPreload' component={Page1} />

                {/* classic component: have to pass loadingContext in it */}
                <Route path='/page2' component={Page2Wrapper} preload />

                {/* func component with state */}
                <Route path='/' component={Main} preload />
            </PreloadingSwitch>
        </Layout>
    );
}
export default App;
