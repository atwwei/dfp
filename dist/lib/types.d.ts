/// <reference types="googletag" />
export declare type ScriptOptions = {
    id?: string;
    async?: boolean;
    type?: 'text/javascript';
    src?: string;
    innerHTML?: string;
};
export declare type DfpAd = {
    unitPath: string;
    id?: string;
    size?: googletag.GeneralSize;
    sizeMapping?: googletag.SizeMappingArray;
    categoryExclusion?: string | string[];
    clickUrl?: string;
    collapseEmptyDiv?: boolean | [boolean, boolean];
    forceSafeFrame?: boolean;
    safeFrameConfig?: googletag.SafeFrameConfig;
    targeting?: Record<string, string | string[]>;
    adsense?: Record<string, string>;
    content?: string;
};
