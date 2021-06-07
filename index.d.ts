declare module "react-router-loading" {
    import type { RouteProps as RP } from "react-router-dom";
    // React router is a dependency of react-router-dom
    import type { OmitNative, RouteProps } from "react-router";

    export class Route<
        T extends {} = {},
        Path extends string = string
    > extends React.Component<
        RouteProps<Path> &
            OmitNative<T, keyof RouteProps> & { loading?: boolean },
        any
    > {}

    export const LoadingContext: React.Context<{ done(): void }>;
    // Only for typings
    export { Switch, SwitchProps } from "react-router-dom";

    export interface TopBarConfig {
        autoRun: boolean;
        barThickness: number;
        barColors: Record<number, string>;
        shadowBlur: number;
        shadowColor: string;
        className: string;
    }

    export const topbar: { config: (c: TopBarConfig) => void };
}
