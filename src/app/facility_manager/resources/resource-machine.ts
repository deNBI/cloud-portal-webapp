import {ComputecenterComponent} from '../../projectmanagement/computecenter.component';
import {GPUSpecification} from './gpu-specification';

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
  gpu_used: GPUSpecification[] = [];
  public_count: number;
  private_count: number;
  ram: number;
  type: string = 'GENERAL_PURPOSE';
  private UNUSED: string = 'UNUSED'

  constructor(resourceMachine: ResourceMachine | null) {
    if (resourceMachine) {
      this.id = resourceMachine.id;
      this.compute_center = resourceMachine.compute_center;
      this.name = resourceMachine.name;
      this.ram_public_factor = resourceMachine.ram_public_factor = 1;
      this.ram_private_factor = resourceMachine.ram_private_factor = 1;
      this.cores = resourceMachine.cores;
      this.cores_private_factor = resourceMachine.cores_private_factor;
      this.cores_public_factor = resourceMachine.cores_public_factor;
      this.gpu_slots = resourceMachine.gpu_slots;
      this.gpu_used = resourceMachine.gpu_used;
      this.public_count = resourceMachine.public_count;
      this.private_count = resourceMachine.private_count;
      this.ram = resourceMachine.ram;
      this.type = resourceMachine.type;
      if (this.gpu_used.length < this.gpu_slots) {
        while (this.gpu_used.length < this.gpu_slots) {
          const new_gpu: GPUSpecification = new GPUSpecification()
          new_gpu.type = this.UNUSED
          this.gpu_used.push(new_gpu)
        }

      }
    }

  }

  setUnusedGpuSlot(idx: number): void {
    this.gpu_used[idx] = new GPUSpecification()
  }

  changeGpuUsed(): void {

    if (this.gpu_used.length > this.gpu_slots) {
      while (this.gpu_used.length > this.gpu_slots) {
        this.gpu_used.pop()
      }
    } else {
      while (this.gpu_used.length < this.gpu_slots) {
        const new_gpu: GPUSpecification = new GPUSpecification()
        new_gpu.type = this.UNUSED
        this.gpu_used.push(new_gpu)
      }

    }

  }

}

