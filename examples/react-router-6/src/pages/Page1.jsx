import React, { useEffect, useState } from 'react';
import { useLoadingContext } from 'react-router-loading';
import loadData from './fetchers';

export const Page1 = () => {
  const [state, setState] = useState();
  const loadingContext = useLoadingContext();

  const loading = async () => {
    // loading some data
    const data = await loadData();
    setState(data);

    // call method to indicate that loading is done
    loadingContext.done();
  };

  useEffect(() => { loading(); }, []);
  return <div>
    <h1>This is page 1</h1>
    {state ? 'Loading done!' : 'loading...'}
  </div>;
};
