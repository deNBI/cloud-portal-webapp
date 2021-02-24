import {Component, OnInit} from '@angular/core';
import {FacilityService} from '../../api-connector/facility.service';
import {Resources} from '../../vo_manager/resources/resources';
import {jsPDF} from 'jspdf';
import html2canvas from 'html2canvas';
import {ExportAsConfig, ExportAsService} from 'ngx-export-as'
import {ObjectStorageFactor} from './object-storage-factor';
import {VolumeStorageFactor} from './volume-storage-factor';
import {GeneralStorageFactor} from './general-storage-factor';
import {ResourceMachine} from './resource-machine';
import {GPUSpecification} from './gpu-specification';

/**
 * Facility resource component.
 */
@Component({
             selector: 'app-resources',
             templateUrl: './resources.component.html',
             styleUrls: ['./resources.component.scss'],
             providers: [FacilityService, ExportAsService]

           })
export class ResourcesComponent implements OnInit {

  title: string = 'Resource Overview';
  managerFacilities: [string, number][];

  ALL_RESOURCES: number = 0;
  INTERN_RESOURCES: number = 1;
  PUBLIC_RESOURCES: number = 2;

  ALL_ACTIVE: boolean = false;
  INTERN_ACTIVE: boolean = false;
  PUBLIC_ACTIVE: boolean = true;

  MACHINE_DEFINITION_TAB: number = 0;
  STORAGE_TAB: number = 1;
  OBJECT_STORAGE_TAB: number = 2;
  VOLUME_STORAGE_TAB: number = 3;
  GENERAL_STORAGE_TAB: number = 4;
  GPU_TAB: number = 5;

  MACHINE_DEFINITION_TAB_ACTIVE: boolean = false;
  STORAGE_TAB_ACTIVE: boolean = false;
  GENERAL_STORAGE_TAB_ACTIVE: boolean = false;
  OBJECT_STORAGE_TAB_ACTIVE: boolean = false;
  VOLUME_STORAGE_TAB_ACTIVE: boolean = false;
  GPU_TAB_ACTIVE: boolean = false;

  objectStorageFactors: ObjectStorageFactor[] = [];
  volumeStorageFactors: VolumeStorageFactor[] = [];
  generalStorageFactors: GeneralStorageFactor[] = [];
  resourceMachines: ResourceMachine[] = [];
  gpuSpecifications: GPUSpecification[] = [];

  /**
   * Chosen facility.
   */
  public selectedFacility: [string, number];

  isLoaded: boolean = false;
  resources: Resources [];
  visible_resources: Resources[];

  /**
   * Id of the table which will be converted to pdf or csv.
   */
  tableId: string = 'contentToConvert';
  today: number = Date.now();
  exportAsConfigCSV: ExportAsConfig = {
    type: 'csv',
    // elementId: this.tableId
    elementIdOrContent: this.tableId
  };

  constructor(private facilityService: FacilityService, private exportAsService: ExportAsService) {
  }

  setAllTabsFalse(): void {
    this.MACHINE_DEFINITION_TAB_ACTIVE = false;
    this.GENERAL_STORAGE_TAB_ACTIVE = false;
    this.OBJECT_STORAGE_TAB_ACTIVE = false;
    this.VOLUME_STORAGE_TAB_ACTIVE = false;
    this.GPU_TAB_ACTIVE = false;
    this.STORAGE_TAB_ACTIVE = false;

  }

  setAllResourcesFalse(): void {
    this.ALL_ACTIVE = false;
    this.PUBLIC_ACTIVE = false;
    this.INTERN_ACTIVE = false;

  }

  setResources(tab_num: number): void {

    this.setAllResourcesFalse();
    switch (tab_num) {
      case this.ALL_RESOURCES:
        this.ALL_ACTIVE = true;
        break;
      case this.INTERN_RESOURCES:
        this.INTERN_ACTIVE = true;
        break;
      case this.PUBLIC_RESOURCES:
        this.PUBLIC_ACTIVE = true;
        break;

      default:
        break;
    }
    this.setVisibleResources();
  }

  setTab(tab_num: number): void {

    this.setAllTabsFalse();
    switch (tab_num) {
      case this.MACHINE_DEFINITION_TAB:
        this.MACHINE_DEFINITION_TAB_ACTIVE = true;
        break;
      case this.STORAGE_TAB:
        this.STORAGE_TAB_ACTIVE = true;
        if (this.generalStorageFactors.length > 0) {
          this.GENERAL_STORAGE_TAB_ACTIVE = true;
        } else if (this.volumeStorageFactors.length > 0 || this.objectStorageFactors.length > 0) {
          this.OBJECT_STORAGE_TAB_ACTIVE = true;
        }
        break;
      case this.GENERAL_STORAGE_TAB:
        this.GENERAL_STORAGE_TAB_ACTIVE = true;
        this.STORAGE_TAB_ACTIVE = true;

        break;
      case this.OBJECT_STORAGE_TAB:
        this.OBJECT_STORAGE_TAB_ACTIVE = true;
        this.STORAGE_TAB_ACTIVE = true;

        break;
      case this.VOLUME_STORAGE_TAB:
        this.VOLUME_STORAGE_TAB_ACTIVE = true;
        this.STORAGE_TAB_ACTIVE = true;

        break;

      case this.GPU_TAB:
        this.GPU_TAB_ACTIVE = true;
        break;

      default:
        break;
    }
  }

  onChangeSelectedFacility(): void {
    this.setAllTabsFalse();
    this.getSelectedFacilityResources();
  }

  ngOnInit(): void {
    this.facilityService.getManagerFacilities().subscribe((result: [string, number][]): void => {
      this.managerFacilities = result;
      this.selectedFacility = this.managerFacilities[0];
      this.getSelectedFacilityResources();

    })
  }

  setVisibleResources(): void {
    if (this.PUBLIC_ACTIVE) {
      this.visible_resources = this.resources.filter((res: Resources): boolean => {
        return !res.resource_name.includes('Intern') && !res.resource_name.includes('All');
      })
    } else if (this.INTERN_ACTIVE) {
      this.visible_resources = this.resources.filter((res: Resources): boolean => {
        return res.resource_name.includes('Intern');
      })
    } else if (this.ALL_ACTIVE) {
      this.visible_resources = this.resources

    }
    this.isLoaded = true;

  }

  public getSelectedFacilityResources(): void {
    this.facilityService.getObjectStorageFactors(this.selectedFacility['FacilityId']).subscribe(
      (res: ObjectStorageFactor[]): void => {
        this.objectStorageFactors = res;
      });
    this.facilityService.getGeneralStorageFactors(this.selectedFacility['FacilityId']).subscribe((res: GeneralStorageFactor[]): void => {
      this.generalStorageFactors = res;
    });
    this.facilityService.getResourceMachines(this.selectedFacility['FacilityId']).subscribe((res: ResourceMachine[]): void => {
      this.resourceMachines = res;
      console.log(this.resourceMachines);
    });

    this.facilityService.getVolumeStorageFactors(this.selectedFacility['FacilityId']).subscribe((res: VolumeStorageFactor[]): void => {
      this.volumeStorageFactors = res;
    });
    this.facilityService.getGPUSpecifications(this.selectedFacility['FacilityId']).subscribe((specs: GPUSpecification[]): void => {
      this.gpuSpecifications = specs;
    });
    this.facilityService.getFacilityResources(
      this.selectedFacility['FacilityId']).subscribe(
        (res: Resources[]): void => {
          this.resources = res;
          this.setVisibleResources()
        });

  }

  public tableToCSV(): void {
    this.exportAsService.save(this.exportAsConfigCSV, this.tableId);

  }

  public tableToPDF(): void {
    html2canvas(document.getElementById(this.tableId)).then((canvas: any): void => {
      // Few necessary setting options
      const imgWidth: number = 208;
      const imgHeight: number = canvas.height * imgWidth / canvas.width;
      const contentDataURL: string = canvas.toDataURL('image/png');
      const pdf: jsPDF = new jsPDF('p', 'mm', 'a4'); // A4 size page of PDF
      const position: number = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
      pdf.save(`${this.selectedFacility['Facility']}.pdf`); // Generated PDF
    }).catch((error: any): void => {
      console.log(error)
      console.log('failed to convert to pdf')
    });
  }

}
