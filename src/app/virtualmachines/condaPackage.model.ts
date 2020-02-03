/**
 * Class for packages selected in Conda to represent them in the instance-detail.
 */
export class CondaPackage {

  private _name: string;
  private _version: string;
  private _build: string;

  constructor(name: string, version: string, build: string) {
    this._name = name;
    this._version = version;
    this._build = build;
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  get version(): string {
    return this._version;
  }

  set version(value: string) {
    this._version = value;
  }

  get build(): string {
    return this._build;
  }

  set build(value: string) {
    this._build = value;
  }
}
