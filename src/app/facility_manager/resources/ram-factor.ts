import {Factor} from './factor';

/**
 * RamFactor class.
 */
export class RamFactor extends Factor {

  ram: number;
  type: string;

  constructor(ramFactor: RamFactor | null) {
    super(ramFactor)

    if (ramFactor) {
      this.ram = ramFactor.ram;
      this.type = ramFactor.type;
    }

  }

}
