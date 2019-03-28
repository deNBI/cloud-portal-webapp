import {ComputecenterComponent} from '../../projectmanagement/computecenter.component';

/**
 * RamFactor class.
 */
export class RamFactor {

    private _factor: number;
    private _ram: number;
    private _compute_center: ComputecenterComponent;

    constructor(factor: number, ram: number, compute_center: ComputecenterComponent) {
        this._factor = factor;
        this._ram = ram;
        this._compute_center = compute_center;
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
