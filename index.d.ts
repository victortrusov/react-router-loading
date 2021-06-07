declare module "react-router-loading" {
    import type { RouteProps as RP } from "react-router-dom";
    // React router is a dependency of react-router-dom
    import type { OmitNative, ExtractRouteParams } from "react-router";

    // Respect the generics
    export interface RouteProps<
        Path extends string = string,
        Params extends { [K: string]: string | undefined } = ExtractRouteParams<
            Path,
            string
        >
    > extends RP<Path, Params> {
        loading?: boolean;
    }

    export class Route<
        T extends {} = {},
        Path extends string = string
    > extends React.Component<
        RouteProps<Path> & OmitNative<T, keyof RouteProps>,
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
