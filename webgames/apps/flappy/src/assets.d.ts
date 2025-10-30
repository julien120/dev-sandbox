export declare const ASSET_PATHS: {
    readonly background: string;
    readonly bird: string;
    readonly pipeTop: string;
    readonly pipeBottom: string;
};
export type GameAssets = {
    [K in keyof typeof ASSET_PATHS]: HTMLImageElement;
};
export declare const loadAssets: () => Promise<GameAssets>;
