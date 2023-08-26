export class Event implements googletag.events.Event {
  serviceName!: string;
  slot!: googletag.Slot;
  constructor(event: googletag.events.Event) {
    Object.assign(this, event);
  }
}

export class ImpressionViewableEvent extends Event {}

export class RewardedSlotClosedEvent extends Event {}

export class RewardedSlotGrantedEvent
  extends Event
  implements googletag.events.RewardedSlotGrantedEvent
{
  payload!: googletag.RewardedPayload | null;
}

export class RewardedSlotReadyEvent
  extends Event
  implements googletag.events.RewardedSlotReadyEvent
{
  makeRewardedVisible!: () => void;
}

export class SlotOnloadEvent extends Event {}

export class SlotRenderEndedEvent
  extends Event
  implements googletag.events.SlotRenderEndedEvent
{
  companyIds!: number[] | null;
  creativeTemplateId!: number | null;
  isBackfill!: boolean;
  labelIds!: number[] | null;
  slotContentChanged!: boolean;
  yieldGroupIds!: number[] | null;
  advertiserId!: number | null;
  campaignId!: number | null;
  creativeId!: number | null;
  isEmpty!: boolean;
  lineItemId!: number | null;
  size!: string | number[] | null;
  sourceAgnosticCreativeId!: number | null;
  sourceAgnosticLineItemId!: number | null;
}

export class SlotRequestedEvent extends Event {}

export class SlotResponseReceived extends Event {}

export class SlotVisibilityChangedEvent
  extends Event
  implements googletag.events.SlotVisibilityChangedEvent
{
  inViewPercentage!: number;
}

export const EVENT_TYPES: Array<keyof googletag.events.EventTypeMap> = [
  'impressionViewable',
  'rewardedSlotClosed',
  'rewardedSlotGranted',
  'rewardedSlotReady',
  'slotRequested',
  'slotResponseReceived',
  'slotRenderEnded',
  'slotOnload',
  'slotVisibilityChanged',
];

export function eventFactory(
  type: keyof googletag.events.EventTypeMap,
  event: googletag.events.Event,
): Event {
  switch (type) {
    case 'impressionViewable':
      return new ImpressionViewableEvent(event);
    case 'rewardedSlotClosed':
      return new RewardedSlotClosedEvent(event);
    case 'rewardedSlotGranted':
      return new RewardedSlotGrantedEvent(event);
    case 'rewardedSlotReady':
      return new RewardedSlotReadyEvent(event);
    case 'slotRequested':
      return new SlotRequestedEvent(event);
    case 'slotResponseReceived':
      return new SlotResponseReceived(event);
    case 'slotRenderEnded':
      return new SlotRenderEndedEvent(event);
    case 'slotOnload':
      return new SlotOnloadEvent(event);
    case 'slotVisibilityChanged':
      return new SlotVisibilityChangedEvent(event);
  }
}
