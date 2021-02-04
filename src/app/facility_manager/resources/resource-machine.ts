import {ComputecenterComponent} from '../../projectmanagement/computecenter.component';
import {GPUSpecification} from "./gpu-specification";

/**
 * ResourceMachine class.
 */

export class ResourceMachine {
  id: string;
  compute_center: ComputecenterComponent;
  name: string;
  ram_public_factor: number = 1;
  ram_private_factor: number = 1;
  cores: number;
  cores_private_factor: number = 1;
  cores_public_factor: number = 1;
  gpu_slots: number = 0;
  gpu_used: GPUSpecification[];
  public_count: number;
  private_count: number;
  ram: number;
  type: string = 'GENERAL_PURPOSE';

}
