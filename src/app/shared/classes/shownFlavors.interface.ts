import { Flavor } from "app/virtualmachines/virtualmachinemodels/flavor";

export interface ShownFlavors {
    [flavorType: string]: {
      [flavorName: string]: Flavor[];
    };
  }