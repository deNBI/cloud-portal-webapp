import {ComputecenterComponent} from '../../projectmanagement/computecenter.component';



/**
 * Base class for Factors.
 */
export abstract class Factor {
  id: string;
  factor: number;
  compute_center: ComputecenterComponent;
  description: string;
  public: boolean;

  constructor(factor: Factor) {
    this.id = factor.id;
    this.factor = factor.factor;
    this.compute_center = factor.compute_center;
    this.description = factor.description;
    this.public = factor.public;
  }
}
