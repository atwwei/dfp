class DfpAction {
  slot: googletag.Slot;
  constructor(slot: googletag.Slot) {
    this.slot = slot;
  }
}

export class DfpAdDisplay extends DfpAction {}

export class DfpAdRefresh extends DfpAction {}

export type Action = DfpAdDisplay | DfpAdRefresh;
