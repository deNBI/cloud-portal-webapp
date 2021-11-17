import {
	Component, ElementRef, OnInit, ViewChild,
} from '@angular/core';
/* import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import htmlToPdfmake from 'html-to-pdfmake'; */
import { ExportToCsv } from 'export-to-csv';
import { Resources } from '../../vo_manager/resources/resources';
import { FacilityService } from '../../api-connector/facility.service';
import { ObjectStorageFactor } from './object-storage-factor';
import { VolumeStorageFactor } from './volume-storage-factor';
import { GeneralStorageFactor } from './general-storage-factor';
import { ResourceMachine } from './resource-machine';
import { GPUSpecification } from './gpu-specification';

// pdfMake.vfs = pdfFonts.pdfMake.vfs;

/**
 * Facility resource component.
 */
@Component({
	selector: 'app-resources',
	templateUrl: './resources.component.html',
	styleUrls: ['./resources.component.scss'],
	providers: [FacilityService],

})
export class ResourcesComponent implements OnInit {

	title: string = 'Resource Overview';

	tableId: string = 'contentToConvert';
		@ViewChild('contentToConvert') pdfTable: ElementRef;

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
		today: number = Date.now();

		constructor(private facilityService: FacilityService) {
			this.facilityService = facilityService;
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
			});
		}

		setVisibleResources(): void {
			if (this.PUBLIC_ACTIVE) {
				this.visible_resources = this.resources
					.filter((res: Resources): boolean => !res.resource_name.includes('Intern') && !res.resource_name.includes('All'));
			} else if (this.INTERN_ACTIVE) {
				this.visible_resources = this.resources.filter((res: Resources): boolean => res.resource_name.includes('Intern'));
			} else if (this.ALL_ACTIVE) {
				this.visible_resources = this.resources;

			}
			this.isLoaded = true;

		}

		public getSelectedFacilityResources(): void {
			this.facilityService.getObjectStorageFactors(this.selectedFacility['FacilityId']).subscribe(
				(res: ObjectStorageFactor[]): void => {
					this.objectStorageFactors = res;
				},
			);
			this.facilityService.getGeneralStorageFactors(this.selectedFacility['FacilityId']).subscribe((res: GeneralStorageFactor[]): void => {
				this.generalStorageFactors = res;
			});
			this.facilityService.getResourceMachines(this.selectedFacility['FacilityId']).subscribe((res: ResourceMachine[]): void => {
				this.resourceMachines = res;
			});

			this.facilityService.getVolumeStorageFactors(this.selectedFacility['FacilityId']).subscribe((res: VolumeStorageFactor[]): void => {
				this.volumeStorageFactors = res;
			});
			this.facilityService.getGPUSpecifications(this.selectedFacility['FacilityId']).subscribe((specs: GPUSpecification[]): void => {
				this.gpuSpecifications = specs;
			});
			this.facilityService.getFacilityResources(this.selectedFacility['FacilityId']).subscribe(
				(res: Resources[]): void => {
					res = this.transformGbToTb(res);
					this.resources = res;
					this.setVisibleResources();
				},
			);

		}

		transformGbToTb(res: Resources[]): Resources[] {
			res.forEach((resource: Resources) => {
				if (resource['resource_name'] === 'Expired | In-Use'
				|| resource['resource_name'] === 'Total Used'
				|| resource['resource_name'] === 'Simple VM'
				|| resource['resource_name'] === 'Wait for Confirmation: OpenStack'
				|| resource['resource_name'] === 'Running: OpenStack') {
					resource['totalObjectStorage'] /= 1024;
					resource['totalObjectStorage'] = Math.round((resource['totalObjectStorage'] + Number.EPSILON) * 1000) / 1000;
					resource['totalVolumeLimit'] /= 1024;
					resource['totalVolumeLimit'] = Math.round((resource['totalVolumeLimit'] + Number.EPSILON) * 1000) / 1000;
				}
			});

			return res;
		}

		public tableToCSV(): void {
			console.log('to csv');
			const options = {
				fieldSeparator: ',',
				quoteStrings: '"',
				decimalSeparator: '.',
				showLabels: true,
				showTitle: false,
				// title: `${this.selectedFacility['Facility']} Resources`,
				filename: `${this.selectedFacility['Facility']}_resources.csv`,
				useTextFile: false,
				useBom: true,
				useKeysAsHeaders: true,
			// headers: ['Column 1', 'Column 2', etc...] <-- Won't work with useKeysAsHeaders present!
			};

			const csvExporter = new ExportToCsv(options);

			csvExporter.generateCsv(this.visible_resources);

		}

	/* public tableToPDF(): void {
		// const doc = new jsPDF();
		const pdfTable = this.pdfTable.nativeElement;
		const html = htmlToPdfmake(pdfTable.innerHTML);
		const documentDefinition = {
			content: html,
			pageOrientation: 'portrait',
			pageSize: { width: pdfTable.offsetWidth, height: pdfTable.offsetHeight },
		};
		pdfMake.createPdf(documentDefinition).download(`${this.selectedFacility['Facility']}_resources.pdf`);

	} */

}
