export type ScriptOptions = {
  id?: string;
  async?: boolean;
  type?: 'text/javascript';
  src?: string;
  innerHTML?: string;
};

export type DfpAd = {
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
  adsense?: Partial<Record<googletag.adsense.AttributeName, string>>;
};
