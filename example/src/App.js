import React, { Fragment, useEffect, useState, useContext } from 'react';
import { Route, Link } from 'react-router-dom';
import { LoadingContext, PreloadingSwitch } from "../../dist";

const Layout = ({ children }) =>
    <Fragment>
        <Link to='/page1'>Page 1</Link>
        <Link to='/page2'>Page 2</Link>
        <article>
            {children}
        </article>
    </Fragment>;

const Page1 = () => {
    const [state, setState] = useState();
    const loadingContext = useContext(LoadingContext);
    const loading = async () => {
        loadingContext.start();
        await new Promise(r => setTimeout(r, 1000));
        setState('Page1');
        loadingContext.done();
    };

    useEffect(() => { loading() }, []);

    return <div>
        {state}
    </div>;
};

const Page2 = () => {
    const [state, setState] = useState();
    const loadingContext = useContext(LoadingContext);
    const loading = async () => {
        loadingContext.start();
        await new Promise(r => setTimeout(r, 1000));
        setState('Page2');
        loadingContext.done();
    };

    useEffect(() => { loading() }, []);

    return <div>
        {state}
    </div>;
};

const App = () =>
    <Layout>
        <PreloadingSwitch>
            <Route path='/loading' />
            <Route path='/page1' component={Page1} preload />
            <Route path='/page2' component={Page2} preload />
            <Route path='/' />
        </PreloadingSwitch>
    </Layout>;
export default App;
