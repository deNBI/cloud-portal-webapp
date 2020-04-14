/**
 * Clientclass
 */
export class Client {

  private _id: string;
  private _host: string;
  private _status: string;
  private _port: string;
  private _version: string;
  private _features: string[];
  private _maxVolumes: number;
  private _assignedVolumes: number;
  private _maxVMs: number;
  private _assignedVMs: number;
  private _location: string;
  private _maxVolumeLimit: number;
  private _assignedVolumesStorage: number;
  private _newVolumes: number;
  private _newVms: number;
  private _newVolumeLimit: number;
  private _activated: boolean;
  private _forc_url: string;

  constructor(host: string, port: string, location: string, id: string) {
    this._host = host;
    this._port = port;
    this._location = location;
    this._id = id;
  }

  get newVolumes(): number {
    return this._newVolumes;
  }

  set newVolumes(value: number) {
    this._newVolumes = value;
  }

  get newVms(): number {
    return this._newVms;
  }

  set newVms(value: number) {
    this._newVms = value;
  }

  get newVolumeLimit(): number {
    return this._newVolumeLimit;
  }

  set newVolumeLimit(value: number) {
    this._newVolumeLimit = value;
  }

  get id(): string {
    return this._id;
  }

  set id(value: string) {
    this._id = value;
  }

  get host(): string {
    return this._host;
  }

  set host(value: string) {
    this._host = value;
  }

  get status(): string {
    return this._status;
  }

  set status(value: string) {
    this._status = value;
  }

  get port(): string {
    return this._port;
  }

  set port(value: string) {
    this._port = value;
  }

  get version(): string {
    return this._version;
  }

  set version(value: string) {
    this._version = value;
  }

  get features(): string[] {
    return this._features;
  }

  set features(value: string[]) {
    this._features = value;
  }

  get maxVolumes(): number {
    return this._maxVolumes;
  }

  set maxVolumes(value: number) {
    this._maxVolumes = value;
  }

  get assignedVolumes(): number {
    return this._assignedVolumes;
  }

  set assignedVolumes(value: number) {
    this._assignedVolumes = value;
  }

  get maxVMs(): number {
    return this._maxVMs;
  }

  set maxVMs(value: number) {
    this._maxVMs = value;
  }

  get assignedVMs(): number {
    return this._assignedVMs;
  }

  set assignedVMs(value: number) {
    this._assignedVMs = value;
  }

  get location(): string {
    return this._location;
  }

  set location(value: string) {
    this._location = value;
  }

  get maxVolumeLimit(): number {
    return this._maxVolumeLimit;
  }

  set maxVolumeLimit(value: number) {
    this._maxVolumeLimit = value;
  }

  get assignedVolumesStorage(): number {
    return this._assignedVolumesStorage;
  }

  set assignedVolumesStorage(value: number) {
    this._assignedVolumesStorage = value;
  }

  get activated(): boolean {
    return this._activated;
  }

  set activated(value: boolean) {
    this._activated = value;
  }

  get forc_url(): string {
    return this._forc_url;
  }

  set forc_url(value: string) {
    this._forc_url = value;
  }
}
