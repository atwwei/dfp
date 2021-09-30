class SlotRequest {
  slot: googletag.Slot;
  constructor(slot: googletag.Slot) {
    this.slot = slot;
  }
}

export class DisplaySlot extends SlotRequest {}

export class RefreshSlot extends SlotRequest {}

export type Request = DisplaySlot | RefreshSlot;
