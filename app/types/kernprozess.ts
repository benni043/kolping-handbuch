export interface TestLink {
  text: string;
  hasLink: boolean;
  link: string;
}

export interface Kernprozess {
  schrittCount: number;
  vorgabenBlue: TestLink[];
  vorlagenBlue: TestLink[];
  middleHead: string;
  middleList: TestLink[];
  aufzeichnungOrange: TestLink[];
  verantwortlicherOrange: string;
  informationOrange: string;
}
