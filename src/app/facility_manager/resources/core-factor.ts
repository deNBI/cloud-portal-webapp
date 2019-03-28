import {ComputecenterComponent} from '../../projectmanagement/computecenter.component';

/**
 * CoreFactor class.
 */
export class CoreFactor {

    private _factor: number;
    private _cores: number;
    private _compute_center: ComputecenterComponent;

    constructor(factor: number, cores: number, compute_center: ComputecenterComponent) {
        this._factor = factor;
        this._cores = cores;
        this._compute_center = compute_center;
    }

    get factor(): number {
        return this._factor;
    }

    set factor(value: number) {
        this._factor = value;
    }

    get cores(): number {
        return this._cores;
    }

    set cores(value: number) {
        this._cores = value;
    }

    get compute_center(): ComputecenterComponent {
        return this._compute_center;
    }

    set compute_center(value: ComputecenterComponent) {
        this._compute_center = value;
    }
}
