import {ComputecenterComponent} from '../../projectmanagement/computecenter.component';

/**
 * RamFactor class.
 */
export class RamFactor {
  private _id: string;
  private _factor: number;
  private _ram: number;
  private _compute_center: ComputecenterComponent;
  private _description: string;

  constructor(factor: number, ram: number, compute_center: ComputecenterComponent, description: string) {
    this._factor = factor;
    this._ram = ram;
    this._compute_center = compute_center;
    this._description = description;
  }

  get description(): string {
    return this._description;
  }

  set description(value: string) {
    this._description = value;
  }

  get id(): string {
    return this._id;
  }

  set id(value: string) {
    this._id = value;
  }

  get factor(): number {
    return this._factor;
  }

  set factor(value: number) {
    this._factor = value;
  }

  get ram(): number {
    return this._ram;
  }

  set ram(value: number) {
    this._ram = value;
  }

  get compute_center(): ComputecenterComponent {
    return this._compute_center;
  }

  set compute_center(value: ComputecenterComponent) {
    this._compute_center = value;
  }
}
