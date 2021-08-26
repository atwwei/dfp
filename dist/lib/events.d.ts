/// <reference types="googletag" />
declare class GptEvent {
    serviceName: string;
    slot: googletag.Slot;
    constructor(event: googletag.events.Event);
}
export declare class ImpressionViewableEvent extends GptEvent {
}
export declare class SlotOnloadEvent extends GptEvent {
}
export declare class SlotRenderEndedEvent extends GptEvent {
    advertiserId?: number;
    campaignId?: number;
    creativeId?: number;
    isEmpty: boolean;
    lineItemId?: number;
    size: googletag.SingleSize;
    sourceAgnosticCreativeId?: number;
    sourceAgnosticLineItemId?: number;
}
export declare class SlotRequestedEvent extends GptEvent {
}
export declare class SlotResponseReceived extends GptEvent {
}
export declare class SlotVisibilityChangedEvent extends GptEvent {
    inViewPercentage: number;
}
export declare type Event = ImpressionViewableEvent | SlotRenderEndedEvent | SlotRequestedEvent | SlotOnloadEvent | SlotResponseReceived | SlotVisibilityChangedEvent;
export {};
