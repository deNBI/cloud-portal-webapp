import {Factor} from './factor';

/**
 * CoreFactor class.
 */
export class CoreFactor extends Factor {
  cores: number;

  constructor(coreFactor: CoreFactor) {
    super(coreFactor)

    this.cores = coreFactor.cores;

  }

}
