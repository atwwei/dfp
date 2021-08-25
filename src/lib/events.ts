class GptEvent {
  serviceName!: string;
  slot!: googletag.Slot;
  constructor(event: googletag.events.Event) {
    Object.assign(this, event);
  }
}

export class ImpressionViewableEvent extends GptEvent {}

export class SlotOnloadEvent extends GptEvent {}

export class SlotRenderEndedEvent extends GptEvent {
  advertiserId?: number;
  campaignId?: number;
  creativeId?: number;
  isEmpty!: boolean;
  lineItemId?: number;
  size!: googletag.SingleSize;
  sourceAgnosticCreativeId?: number;
  sourceAgnosticLineItemId?: number;
}

export class SlotRequestedEvent extends GptEvent {}

export class SlotResponseReceived extends GptEvent {}

export class SlotVisibilityChangedEvent extends GptEvent {
  inViewPercentage!: number;
}

export type Event =
  | ImpressionViewableEvent
  | SlotRenderEndedEvent
  | SlotRequestedEvent
  | SlotOnloadEvent
  | SlotResponseReceived
  | SlotVisibilityChangedEvent;
