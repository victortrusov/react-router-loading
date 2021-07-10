declare module "react-router-loading" {
    import type { RouteProps, SwitchProps, Switch } from "react-router-dom";
    // React router is a dependency of react-router-dom
    import type { OmitNative } from "react-router";

    export class Switch extends React.Component<
        SwitchProps
        & OmitNative<T, keyof SwitchProps>
        & {
            loadingScreen?: React.Component,
            maxLoadingTime?: number
        },
        any
    > { }

    export class Route<
        T extends {} = {},
        Path extends string = string
    > extends React.Component<
        RouteProps<Path>
        & OmitNative<T, keyof RouteProps>
        & { loading?: boolean },
        any
    > {}

    export const LoadingContext: React.Context<{
        start(): void,
        done(): void,
        restart(): void
    }>;

    export interface TopBarConfig {
        autoRun?: boolean;
        barThickness?: number;
        barColors?: Record<number, string>;
        shadowBlur?: number;
        shadowColor?: string;
        className?: string;
    }

    export const topbar: { config: (c: TopBarConfig) => void };
}
