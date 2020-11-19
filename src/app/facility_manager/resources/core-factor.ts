import {Factor} from './factor';

/**
 * CoreFactor class.
 */
export class CoreFactor extends Factor {
  cores: number;
  type: string = 'GENERAL_PURPOSE';

  constructor(coreFactor: CoreFactor | null) {
    super(coreFactor)
    if (coreFactor) {
      this.cores = coreFactor.cores;
      this.type = coreFactor.type;

    }

  }

}
