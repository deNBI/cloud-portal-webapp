import {FlavorType} from './flavorType';

/**
 * Flavor Class.
 */
export class Flavor {
  private _id: string;
  private _name: string;
  private _vcpus: number;
  private _ram: number;
  private _rootdisk: number;
  private _gpu: number;
  private _ephemeral_disk: number;
  private _type: FlavorType;
  private _simple_vm: boolean;
  private _comment: string;
  private _counter: number;

  get counter(): number {
    return this._counter;
  }

  set counter(value: number) {
    this._counter = value;
  }

  get id(): string {
    return this._id;
  }

  set id(value: string) {
    this._id = value;
  }

  get comment(): string {
    return this._comment;
  }

  set comment(value: string) {
    this._comment = value;
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  get vcpus(): number {
    return this._vcpus;
  }

  set vcpus(value: number) {
    this._vcpus = value;
  }

  get ram(): number {
    return this._ram;
  }

  set ram(value: number) {
    this._ram = value;
  }

  get rootdisk(): number {
    return this._rootdisk;
  }

  set rootdisk(value: number) {
    this._rootdisk = value;
  }

  get gpu(): number {
    return this._gpu;
  }

  set gpu(value: number) {
    this._gpu = value;
  }

  get ephemeral_disk(): number {
    return this._ephemeral_disk;
  }

  set ephemeral_disk(value: number) {
    this._ephemeral_disk = value;
  }

  get type(): FlavorType {
    return this._type;
  }

  set type(value: FlavorType) {
    this._type = value;
  }

  get simple_vm(): boolean {
    return this._simple_vm;
  }

  set simple_vm(value: boolean) {
    this._simple_vm = value;
  }

}
