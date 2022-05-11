import { createContext } from 'react';

type LoadingContextType = {
    start(): void;
    done(): void;
    restart(): void;
};

const LoadingContext = createContext<LoadingContextType>({
    start: () => {},
    done: () => {},
    restart: () => {},
});
LoadingContext.displayName = 'LoadingSetter';

const LoadingGetterContext = createContext<{ loading: boolean }>({
    loading: false,
});
LoadingGetterContext.displayName = 'LoadingGetter';

export { LoadingContext, LoadingGetterContext };
