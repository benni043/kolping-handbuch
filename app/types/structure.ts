export interface Structure {
  uuid: string;
  id: string;
  name: string;
  children: ChildStructure[];
}

export interface ChildStructure {
  uuid: string;
  id: string;
  name: string;
}
