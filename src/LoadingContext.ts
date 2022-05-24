import { createContext } from 'react';

export type LoadingContextType = {
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

const LoadingGetterContext = createContext<boolean>(false);
LoadingGetterContext.displayName = 'LoadingGetter';

export { LoadingContext, LoadingGetterContext };
