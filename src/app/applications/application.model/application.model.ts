import {ApplicationExtension} from '../application_extension.model';
import {ComputecenterComponent} from '../../projectmanagement/computecenter.component';
import {ApplicationDissemination} from '../application-dissemination';
import {EdamOntologyTerm} from '../edam-ontology-term';
import { Injectable } from '@angular/core';

/**
 * Application class.
 */
@Injectable()
export class Application {

  private _Id: number | string;
  private _Name: string;
  private _Shortname: string;
  private _Institute: string;
  private _Workgroup: string;
  private _Lifetime: number;
  private _VMsRequested: number;
  private _CoresPerVM: number;
  private _RamPerVM: number;
  private _VolumeLimit: number;
  private _VolumeCounter: number;
  private _ObjectStorage: number;
  private _SpecialHardware: number;
  private _Description: string;
  private _Comment: string;
  private _DateSubmitted: string;
  private _DateStatusChanged: string;
  private _User: string;
  private _UserEmail: string;
  private _UserAffiliations: string[];
  private _PiAffiliations: string[];
  private _Status: number;
  private _ComputeCenter: ComputecenterComponent;
  private _OpenStackProject: boolean;
  private _DaysRunning: number;
  private _ApplicationExtension: ApplicationExtension = null;
  private _PerunId: number | string;
  private _TotalCores: number;
  private _TotalRam: number;
  private _InitialCredits: number;
  private _DateApproved: string;
  private _OpenstackBasicIntroduction: boolean;
  private _Horizon2020: string;
  private _BMBFProject: string;
  private _EdamTopics: EdamOntologyTerm[];
  private _SensitiveData: boolean;
  private _ElixirProject: string;
  private _Dissemination: ApplicationDissemination;
  private _PIApproved: boolean;
  private _PI: string;
  private _PIElixir: string;
  private _PIEmail: string;
  // todo own type!!!!!!!!!!!!
  private _CurrentFlavors: {
    [id: string]: {
      counter: number, tag: string, ram: number, rootdisk: number,
      vcpus: number, gpu: number, epheremal_disk: number
    }
  };

  private _Workshop: boolean;

  constructor() {
    this._CurrentFlavors = {};
  }

  public addFlavorToCurrent(name: string, counter: number, tag: string, ram: number, rootdisk: number,
                            vcpus: number, gpu: number, epheremal_disk: number): void {
    this._CurrentFlavors[name] = {
      counter: counter,
      tag: tag,
      ram: ram,
      rootdisk: rootdisk,
      vcpus: vcpus,
      gpu: gpu,
      epheremal_disk: epheremal_disk
    };
  }

  get Workshop(): boolean {
    return this._Workshop;
  }

  set Workshop(value: boolean) {
    this._Workshop = value;
  }

  get OpenstackBasicIntroduction(): boolean {
    return this._OpenstackBasicIntroduction;
  }

  set OpenstackBasicIntroduction(value: boolean) {
    this._OpenstackBasicIntroduction = value;
  }

  get SensitiveData(): boolean {
    return this._SensitiveData;
  }

  set SensitiveData(value: boolean) {
    this._SensitiveData = value;
  }

  get PiAffiliations(): string[] {
    return this._PiAffiliations;
  }

  set PiAffiliations(value: string[]) {
    this._PiAffiliations = value;
  }

  get EdamTopics(): EdamOntologyTerm[] {
    return this._EdamTopics;
  }

  set EdamTopics(value: EdamOntologyTerm[]) {
    this._EdamTopics = value;
  }

  get PIElixir(): string {
    return this._PIElixir;
  }

  set PIElixir(value: string) {
    this._PIElixir = value;
  }

  get Dissemination(): ApplicationDissemination {
    return this._Dissemination;
  }

  set Dissemination(value: ApplicationDissemination) {
    this._Dissemination = value;
  }

  get PIApproved(): boolean {
    return this._PIApproved;
  }

  set PIApproved(value: boolean) {
    this._PIApproved = value;
  }

  get CurrentFlavors(): {
    [id: string]: {
      counter: number, tag: string, ram: number, rootdisk: number,
      vcpus: number, gpu: number, epheremal_disk: number
    }
  } {
    return this._CurrentFlavors
  }

  set CurrentFlavors(value: {
    [id: string]: {
      counter: number, tag: string, ram: number, rootdisk: number,
      vcpus: number, gpu: number, epheremal_disk: number
    }
  }) {
    this._CurrentFlavors = value;
  }

  get DateApproved(): string {
    return this._DateApproved;
  }

  set DateApproved(value: string) {
    this._DateApproved = value;
  }

  get TotalCores(): number {
    return this._TotalCores;
  }

  set TotalCores(value: number) {
    this._TotalCores = value;
  }

  get TotalRam(): number {
    return this._TotalRam;
  }

  set TotalRam(value: number) {
    this._TotalRam = value;
  }

  get UserAffiliations(): string[] {
    return this._UserAffiliations
  }

  set UserAffiliations(value: string[]) {
    this._UserAffiliations = value;
  }

  get ApplicationExtension(): ApplicationExtension {
    return this._ApplicationExtension;
  }

  set ApplicationExtension(value: ApplicationExtension) {
    this._ApplicationExtension = value;
  }

  get DaysRunning(): number {
    return this._DaysRunning;
  }

  set DaysRunning(value: number) {
    this._DaysRunning = value;
  }

  get OpenStackProject(): boolean {
    return this._OpenStackProject
  }

  set OpenStackProject(value: boolean) {
    this._OpenStackProject = value;
  }

  get ComputeCenter(): ComputecenterComponent {
    return this._ComputeCenter
  }

  set ComputeCenter(value: ComputecenterComponent) {
    this._ComputeCenter = value;
  }

  get Id(): number | string {
    return this._Id;
  }

  set Id(value: number | string) {
    this._Id = value;
  }

  get Name(): string {
    return this._Name;
  }

  set Name(value: string) {
    this._Name = value;
  }

  set Comment(value: string) {
    this._Comment = value;
  }

  get Comment(): string {
    return this._Comment;
  }

  get Shortname(): string {
    return this._Shortname;
  }

  set Shortname(value: string) {
    this._Shortname = value;
  }

  get Institute(): string {
    return this._Institute;
  }

  set Institute(value: string) {
    this._Institute = value;
  }

  get Workgroup(): string {
    return this._Workgroup;
  }

  set Workgroup(value: string) {
    this._Workgroup = value;
  }

  get Lifetime(): number {
    return this._Lifetime;
  }

  set Lifetime(value: number) {
    this._Lifetime = value;
  }

  get VMsRequested(): number {
    return this._VMsRequested;
  }

  set VMsRequested(value: number) {
    this._VMsRequested = value;
  }

  get CoresPerVM(): number {
    return this._CoresPerVM;
  }

  set CoresPerVM(value: number) {
    this._CoresPerVM = value;
  }

  get RamPerVM(): number {
    return this._RamPerVM;
  }

  set RamPerVM(value: number) {
    this._RamPerVM = value;
  }

  get VolumeLimit(): number {
    return this._VolumeLimit;
  }

  set VolumeLimit(value: number) {
    this._VolumeLimit = value;
  }

  get VolumeCounter(): number {
    return this._VolumeCounter;
  }

  set VolumeCounter(value: number) {
    this._VolumeCounter = value;
  }

  get ObjectStorage(): number {
    return this._ObjectStorage;
  }

  set ObjectStorage(value: number) {
    this._ObjectStorage = value;
  }

  get SpecialHardware(): number {
    return this._SpecialHardware;
  }

  set SpecialHardware(value: number) {
    this._SpecialHardware = value;
  }

  get Description(): string {
    return this._Description;
  }

  set Description(value: string) {
    this._Description = value;
  }

  get DateSubmitted(): string {
    return this._DateSubmitted;
  }

  set DateSubmitted(value: string) {
    this._DateSubmitted = value;
  }

  get DateStatusChanged(): string {
    return this._DateStatusChanged;
  }

  set DateStatusChanged(value: string) {
    this._DateStatusChanged = value;
  }

  get User(): string {
    return this._User;
  }

  set User(value: string) {
    this._User = value;
  }

  get Status(): number {
    return this._Status;
  }

  set Status(value: number) {
    this._Status = value;
  }

  get UserEmail(): string {
    return this._UserEmail;
  }

  set UserEmail(value: string) {
    this._UserEmail = value;
  }

  get PerunId(): number | string {
    return this._PerunId;
  }

  set PerunId(value: number | string) {
    this._PerunId = value;
  }

  get BMBFProject(): string {
    return this._BMBFProject;
  }

  set BMBFProject(value: string) {
    this._BMBFProject = value;
  }

  get Horizon2020(): string {
    return this._Horizon2020;
  }

  set Horizon2020(value: string) {
    this._Horizon2020 = value;
  }

  get ElixirProject(): string {
    return this._ElixirProject;
  }

  set ElixirProject(value: string) {
    this._ElixirProject = value;
  }

  get PI(): string {
    return this._PI;
  }

  set PI(value: string) {
    this._PI = value;
  }

  get PIEmail(): string {
    return this._PIEmail;
  }

  set PIEmail(value: string) {
    this._PIEmail = value;
  }

  get InitialCredits(): number {
    return Number(this._InitialCredits);
  }

  set InitialCredits(value: number) {
    this._InitialCredits = value;
  }

  get TotalExtensionCredits(): number {
    if (this.ApplicationExtension != null) {
      return Number(this.InitialCredits) + Number(this.ApplicationExtension.ExtendedCredits)
    } else {
      return this.InitialCredits
    }
  }
}
