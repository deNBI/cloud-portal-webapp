import {Factor} from './factor';

/**
 * Gpu Factor class.
 */
export class GpuFactor extends Factor {

  count: number;

  constructor(gpuFactor: GpuFactor | null) {
    super(gpuFactor)

    if (gpuFactor) {
      this.count = gpuFactor.count;
    }

  }
}
