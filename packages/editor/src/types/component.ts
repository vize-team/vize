import { MaterialsInfo } from "./materials";

export interface MaterialsComponentMeta {
  identityName: string;
  lib: string;
  readonly name: string;
  readonly thumb: string;
  readonly info: MaterialsInfo;
}
