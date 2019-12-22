import React, { Fragment, useEffect, useState, useContext, useMemo } from 'react';
import { Route, Link } from 'react-router-dom';
import { LoadingContext, PreloadingSwitch } from "../../dist";

export const Main = () => {
    const [state, setState] = useState();
    const loadingContext = useContext(LoadingContext);
    const loading = async () => {
        loadingContext.start();
        await new Promise(r => setTimeout(r, 1000));
        setState('done');
        loadingContext.done();
    };

    useEffect(() => { loading() }, []);

    return <div>
        <h1>This is main page</h1>
        {state ? "Loading done!" : "loading..."}
    </div>;
};

export const Page1 = () => {
    const [state, setState] = useState();
    const loadingContext = useContext(LoadingContext);
    const loading = async () => {
        loadingContext.start();
        await new Promise(r => setTimeout(r, 1000));
        setState('done');
        loadingContext.done();
    };

    useEffect(() => { loading() }, []);

    return <div>
        <h1>This is page 1</h1>
        {state ? "Loading done!" : "loading..."}
    </div>;
};

class Page2 extends React.Component {
    state = { data: undefined }

    loading = async () => {
        this.props.loadingContext.start();
        await new Promise(r => setTimeout(r, 1000));
        this.setState({ data: 'done' });
        this.props.loadingContext.done();
    };

    componentDidMount() {
        this.loading();
    }

    render() {
        return (
            <div>
                <h1>This is page 2 - classic component</h1>
                {this.state.data ? "Loading done!" : "loading..."}
            </div>
        );
    }
};
export const Page2Wrapper = (props) => {
    //this is only needed for classic components e.g. Page2
    const loadingContext = useContext(LoadingContext);
    return <Page2 loadingContext={loadingContext} {...props} />;
}