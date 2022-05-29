import React, { useEffect, useState, useContext } from 'react';
import { LoadingContext } from 'react-router-loading';
import loadData from './fetchers';

export const Main = () => {
  const [state, setState] = useState();
  const loadingContext = useContext(LoadingContext);

  const loading = async () => {
    // loading some data
    const data = await loadData();
    setState(data);

    // call method to indicate that loading is done
    loadingContext.done();
  };

  useEffect(() => {
    loading();
  }, []);

  return <div>
    <h1>This is main page</h1>
    {state ? 'Loading done!' : 'loading...'}
  </div>;
};
