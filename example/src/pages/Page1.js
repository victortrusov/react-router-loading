import React, { useEffect, useState, useContext } from 'react';
import { LoadingContext } from "../../../dist";
import loadData from './fetchers';

export const Page1 = () => {
    const [state, setState] = useState();
    const loadingContext = useContext(LoadingContext);

    const loading = async () => {
        //loading some data
        const data = await loadData();
        setState(data);

        //call method to indicate that loading is done
        loadingContext.done();
    };

    useEffect(() => { loading(); }, []);
    return <div>
        <h1>This is page 1</h1>
        {state ? "Loading done!" : "loading..."}
    </div>;
};
