import { createContext } from 'react';

const LoadingContext = createContext({
    start: () => { },
    done: () => { },
    skip: () => { }
});
LoadingContext.displayName = 'LoadingSetter';

const LoadingGetterContext = createContext({
    loading: false
});
LoadingGetterContext.displayName = 'LoadingGetter';

export {
    LoadingContext,
    LoadingGetterContext
};
