import {ComputecenterComponent} from '../../projectmanagement/computecenter.component';

/**
 * ResourceMachine class.
 */

export class ResourceMachine {
  id: string;

  compute_center: ComputecenterComponent;
  name: string;
  ram_factor: number = 1;
  cores: number;
  cores_factor: number = 1;
  gpus: number = 0;
  gpu_type: string;
  public_count: number;
  private_count: number;
  ram: number;
  type: string = 'GENERAL_PURPOSE';

}
