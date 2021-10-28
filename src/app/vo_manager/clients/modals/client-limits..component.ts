import {
	Component, EventEmitter, OnDestroy, OnInit,
} from '@angular/core';
import {BsModalRef} from 'ngx-bootstrap/modal';
import {Client} from '../client.model';
import {ClientService} from '../../../api-connector/client.service';
import {Application} from '../../../applications/application.model/application.model';
import {FacilityService} from '../../../api-connector/facility.service';

@Component({
	selector: 'app-client-limits',
	templateUrl: './client-limits.component.html',
	providers: [FacilityService, ClientService],
})
export class ClientLimitsComponent implements OnDestroy, OnInit {

	client: Client = null;
	compute_center_id: string = null;
	application: Application = null;
	is_modification_request: boolean = false;
	approvable: boolean = true;
	limits_message: string;
	message_type: string;
	public event: EventEmitter<any> = new EventEmitter();

	constructor(public bsModalRef: BsModalRef, private clientService: ClientService, private facilityService: FacilityService) {
		// eslint-disable-next-line no-empty-function
	}

	getComputeCenterClientModificationLimitsAvailable() {

		// eslint-disable-next-line max-len
		this.facilityService.getComputeCenterClientLimitsAvailable(this.compute_center_id, this.application.project_application_id.toString()).subscribe((cl: any) => {
			this.client = new Client(null, null, null, cl['client_name'], null);
			this.client.maxVolumeLimit = cl['maxTotalVolumeGigabytes'];
			this.client.assignedVolumesStorage = cl['assigned_volume_gb'];
			this.client.currentUsedVolumeStorage = cl['totalGigabytesUsed'];
			this.client.newVolumeLimit = cl['new_volume_gb'];

			this.client.maxVolumes = cl['maxTotalVolumes'];
			this.client.assignedVolumes = cl['assigned_volumes'];
			this.client.currentUsedVolumes = cl['totalVolumesUsed'];
			this.client.newVolumes = cl['new_volumes'];

			this.client.maxVMs = cl['max_total_instances'];
			this.client.assignedVMs = cl['assigned_instances'];
			this.client.currentUsedVms = cl['total_instances_used'];
			this.client.newVms = cl['additional_instances'];

			this.client.maxCores = cl['max_total_cores'];
			this.client.assignedCores = cl['assigned_cores'];
			this.client.currentUsedCores = cl['total_cores_used'];
			this.client.newCores = cl['new_cores'];

			this.client.maxRam = cl['max_total_ram_size'];
			this.client.assignedRam = cl['assigned_ram'];
			this.client.currentUsedRam = cl['total_ram_used'];
			this.client.newRam = cl['new_ram'];
			if (cl['client_available']) {
				this.message_type = 'success';
				this.limits_message = `The client [${this.client.location}] has enough resources left!.`;
				this.approvable = true;

			} else {
				this.message_type = 'danger';
				this.limits_message = `The client [${this.client.location}] has not the necessary resources left!`;
				// this.approvable = false;

			}
		});

	}

	getComputeCenterClientLimitsAvailable() {

		// eslint-disable-next-line max-len
		this.facilityService.getComputeCenterClientLimitsAvailable(this.compute_center_id, this.application.project_application_id.toString()).subscribe((cl: any) => {
			this.client = new Client(null, null, null, cl['client_name'], null);
			this.client.maxVolumeLimit = cl['maxTotalVolumeGigabytes'];
			this.client.assignedVolumesStorage = cl['assigned_volume_gb'];
			this.client.currentUsedVolumeStorage = cl['totalGigabytesUsed'];
			this.client.newVolumeLimit = cl['new_volume_gb'];

			this.client.maxVolumes = cl['maxTotalVolumes'];
			this.client.assignedVolumes = cl['assigned_volumes'];
			this.client.currentUsedVolumes = cl['totalVolumesUsed'];
			this.client.newVolumes = cl['new_volumes'];

			this.client.maxVMs = cl['max_total_instances'];
			this.client.assignedVMs = cl['assigned_instances'];
			this.client.currentUsedVms = cl['total_instances_used'];
			this.client.newVms = cl['additional_instances'];

			this.client.maxCores = cl['max_total_cores'];
			this.client.assignedCores = cl['assigned_cores'];
			this.client.currentUsedCores = cl['total_cores_used'];
			this.client.newCores = cl['new_cores'];

			this.client.maxRam = cl['max_total_ram_size'];
			this.client.assignedRam = cl['assigned_ram'];
			this.client.currentUsedRam = cl['total_ram_used'];
			this.client.newRam = cl['new_ram'];
			if (cl['client_available']) {
				this.message_type = 'success';
				this.limits_message = `The client [${this.client.location}] has enough resources left!.`;
				this.approvable = true;

			} else {
				this.message_type = 'danger';
				this.limits_message = `The client [${this.client.location}] has not the necessary resources left!`;
				// this.approvable = false;

			}
		});

	}

	getClientLimits() {
		this.clientService.getClientLimits(this.client.id).subscribe((cl: any) => {
			this.client = new Client(null, null, null, cl['client_name'], null);
			this.client.maxVolumeLimit = cl['maxTotalVolumeGigabytes'];
			this.client.assignedVolumesStorage = cl['assigned_volume_gb'];
			this.client.currentUsedVolumeStorage = cl['totalGigabytesUsed'];
			// this.client.newVolumeLimit = client['new_volume_gb'];

			this.client.maxVolumes = cl['maxTotalVolumes'];
			this.client.assignedVolumes = cl['assigned_volumes'];
			this.client.currentUsedVolumes = cl['totalVolumesUsed'];
			// this.client.newVolumes = client['new_volumes'];

			this.client.maxVMs = cl['max_total_instances'];
			this.client.assignedVMs = cl['assigned_instances'];
			this.client.currentUsedVms = cl['total_instances_used'];
			// this.client.newVms = client['additional_instances'];

			this.client.maxCores = cl['max_total_cores'];
			this.client.assignedCores = cl['assigned_cores'];
			this.client.currentUsedCores = cl['total_cores_used'];
			// this.client.newCores = client['new_cores'];

			this.client.maxRam = cl['max_total_ram_size'];
			this.client.assignedRam = cl['assigned_ram'];
			this.client.currentUsedRam = cl['total_ram_used'];
			//	this.client.newRam = client['new_ram'];

		});
	}

	approve(): void {
		if (this.approvable && !this.is_modification_request) {
			this.createSimpleVM();
		}
		if (this.approvable && this.is_modification_request) {
			this.approveModification();
		}
	}

	approveModification(): void {
		this.event.emit({
			approveModification: true,
			application: this.application,

		});
		this.bsModalRef.hide();
	}

	createSimpleVM(): void {
		this.event.emit({
			createSimpleVM: true,
			compute_center_id: this.compute_center_id,
			application: this.application,
		});
		this.bsModalRef.hide();
	}

	ngOnInit() {
		console.log('init');

		if (this.client) {
			this.getClientLimits();

		} else if (this.application && !this.compute_center_id) {
			this.message_type = "success"
			this.limits_message = "Client will be scheduled via round robin!"


		} else if (this.application && !this.is_modification_request) {
			this.getComputeCenterClientLimitsAvailable();

		} else if (this.application && this.is_modification_request) {
			this.getComputeCenterClientLimitsAvailable();

		}
	}

	ngOnDestroy(): void {
	}

}
