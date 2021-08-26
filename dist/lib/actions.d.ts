/// <reference types="googletag" />
declare class DfpAction {
    slot: googletag.Slot;
    constructor(slot: googletag.Slot);
}
export declare class DfpAdDisplay extends DfpAction {
}
export declare class DfpAdRefresh extends DfpAction {
}
export declare type Action = DfpAdDisplay | DfpAdRefresh;
export {};
