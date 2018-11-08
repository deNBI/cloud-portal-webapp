import {FlavorType} from "./flavorType";

export class Flavor {
    id: string;
    name: string;
    vcpus: number;
    ram: number;
    rootdisk: number;
    gpu: number;
    epheremal_disk: number;
    type: FlavorType;

}





