export interface Structure {
  id: string;
  title: string;
  children: ChildStructure[];
}

export interface ChildStructure {
  id: string;
  title: string;
  kernprozessCount: number;
}
