declare module 'topbar' {
  export interface TopBarConfig {
    autoRun?: boolean;
    barThickness?: number;
    barColors?: Record<number, string>;
    shadowBlur?: number;
    shadowColor?: string;
    className?: string;
  }

  export function show(): void;
  export function hide(): void;
  export function config(configuration: TopBarConfig): void;
  export function progress(value: number | string): void;
}
