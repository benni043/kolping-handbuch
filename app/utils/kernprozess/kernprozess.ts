export interface KernprozessElementLink {
  text: string;
  hasLink: boolean;
  link: string;
}

export interface Kernprozess {
  schrittCount: number;
  vorgabenBlue: KernprozessElementLink[];
  vorlagenBlue: KernprozessElementLink[];
  middleHead: string;
  middleList: { text: string }[];
  aufzeichnungOrange: KernprozessElementLink[];
  verantwortlicherOrange: string;
  informationOrange: string;
  orange: boolean;
}
