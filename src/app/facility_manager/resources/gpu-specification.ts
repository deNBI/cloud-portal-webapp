/**
 * GPU Specification class.
 */

export class GPUSpecification {
  id: string;
  type: string;
  ram: number;
  cores: number;

  constructor(undefined_str: string | null) {
    if (undefined_str) {
      this.type = undefined_str;
      this.ram = 0;
      this.cores = 0;
    }
  }
}
