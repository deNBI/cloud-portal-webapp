import { Component, OnInit } from '@angular/core';

import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import 'svg2pdf.js';
import { WorkshopService } from '../../api-connector/workshop.service';
import { WorkshopTimeFrame } from '../../virtualmachines/workshop/workshopTimeFrame.model';
import { VoService } from '../../api-connector/vo.service';
import { MaintenanceTimeFrame } from './maintenanceTimeFrame.model';
import { NotificationModalComponent } from '../../shared/modal/notification-modal';

/**
 * Component to display graphs which illustrate numbers for VO.
 */
@Component({
	selector: 'app-maintenance',
	templateUrl: './maintenance.component.html',
	styleUrls: ['./maintenance.component.scss'],
	providers: [WorkshopService, VoService],
})
export class MaintenanceComponent implements OnInit {
	is_vo_admin: boolean = false;
	title: string = 'Maintenance';

	workshopTimeFramesLoaded: boolean = false;
	maintenanceTimeFramesLoaded: boolean = false;
	workshopTimeFrames: WorkshopTimeFrame[] = [];
	maintenanceTimeFrames: MaintenanceTimeFrame[] = [];
	errorWorkshopTimeFrames: boolean = false;
	errorMaintenanceTimeFrames: boolean = false;
	newMaintenanceTimeFrame: MaintenanceTimeFrame = null;

	timeSpotCritical: boolean = false;
	timeSpotsChecked: boolean = false;
	criticalTimeSpots: WorkshopTimeFrame[] = [];

	addTimeFrameForm!: UntypedFormGroup;

	constructor(
		private workshopService: WorkshopService,
		private voService: VoService,
		private fb: UntypedFormBuilder,
		private modalService: BsModalService,
	) {
		this.workshopService = workshopService;
		this.voService = voService;
	}

	ngOnInit(): void {
		this.newMaintenanceTimeFrame = new MaintenanceTimeFrame({
			name: '',
			start_time: new Date(),
			end_time: new Date(),
			message: '',
		});
		this.workshopTimeFramesLoaded = false;
		this.maintenanceTimeFramesLoaded = false;
		this.reloadTimeFrames();

		this.addTimeFrameForm = this.fb.group({
			name_input_field: ['', [Validators.required, Validators.minLength(5)]],
		});
	}

	get f() {
		return this.addTimeFrameForm.controls;
	}

	dayChanged(date: { year: number; month: number; day: number }): void {
		this.newMaintenanceTimeFrame.start_time.setDate(date.day);
		this.newMaintenanceTimeFrame.start_time.setMonth(date.month - 1);
		this.newMaintenanceTimeFrame.start_time.setFullYear(date.year);

		this.newMaintenanceTimeFrame.end_time.setDate(date.day);
		this.newMaintenanceTimeFrame.end_time.setMonth(date.month - 1);
		this.newMaintenanceTimeFrame.end_time.setFullYear(date.year);
	}

	startTimeChanged(time: { hour: number; minute: number }): void {
		this.newMaintenanceTimeFrame.start_time.setHours(time.hour);
		this.newMaintenanceTimeFrame.start_time.setMinutes(time.minute);
	}

	endTimeChanged(time: { hour: number; minute: number }): void {
		this.newMaintenanceTimeFrame.end_time.setHours(time.hour);
		this.newMaintenanceTimeFrame.end_time.setMinutes(time.minute);
	}

	reloadTimeFrames(): void {
		this.workshopService.loadWorkshopTimeFrames().subscribe({
			next: (wsTimeFrames: WorkshopTimeFrame[]) => {
				this.workshopTimeFrames = wsTimeFrames.sort((a, b) => {
					if (a.start_time < b.start_time) {
						return -1;
					} else if (a.start_time > b.start_time) {
						return 1;
					} else {
						return 0;
					}
				});
				this.workshopTimeFramesLoaded = true;
				this.errorWorkshopTimeFrames = false;
			},
			error: () => {
				this.workshopTimeFramesLoaded = true;
				this.errorWorkshopTimeFrames = true;
			},
		});
		this.voService.loadMaintenanceTimeFrames().subscribe({
			next: (mtTimeFrames: MaintenanceTimeFrame[]) => {
				this.maintenanceTimeFrames = mtTimeFrames.sort((a, b) => {
					if (a.start_time < b.start_time) {
						return -1;
					} else if (a.start_time > b.start_time) {
						return 1;
					} else {
						return 0;
					}
				});
				this.maintenanceTimeFramesLoaded = true;
				this.errorMaintenanceTimeFrames = false;
			},
			error: () => {
				this.maintenanceTimeFramesLoaded = true;
				this.errorMaintenanceTimeFrames = true;
			},
		});
	}

	checkData(): void {
		this.timeSpotCritical = false;
		this.timeSpotsChecked = false;
		this.criticalTimeSpots = [];
		const critical_start: Date = this.newMaintenanceTimeFrame.start_time;
		critical_start.setHours(critical_start.getHours() - 2);
		const critical_start_time: number = critical_start.getTime();
		const critical_end: Date = this.newMaintenanceTimeFrame.end_time;
		critical_end.setHours(critical_end.getHours() + 2);
		const critical_end_time: number = critical_end.getTime();
		this.workshopTimeFrames.forEach((wstf: WorkshopTimeFrame) => {
			const start_time: number = new Date(wstf.start_time).getTime();
			const end_time: number = new Date(wstf.end_time).getTime();
			if (this.datesOverlap(start_time, end_time, critical_start_time, critical_end_time)) {
				this.timeSpotCritical = true;
				this.criticalTimeSpots.push(wstf);
			}
		});
		this.timeSpotsChecked = true;
	}

	datesOverlap(
		first_start: number | Date,
		first_end: number | Date,
		second_start: number,
		second_end: number,
	): boolean {
		return (
			(first_start >= second_start && first_start <= second_end)
			|| (first_end >= second_start && first_end <= second_end)
			|| (second_start >= first_start && second_start <= first_end)
			|| (second_end >= first_start && second_end <= first_end)
		);
	}

	createNewTimeFrame(): void {
		this.voService.addMaintenanceTimeFrame(this.newMaintenanceTimeFrame).subscribe({
			next: () => {
				this.reloadTimeFrames();
				const initialState = {
					notificationModalTitle: 'Success',
					notificationModalType: 'info',
					notificationModalMessage: 'The new maintenance got successfully added to the calender!',
				};
				this.modalService.show(NotificationModalComponent, { initialState });
			},
			error: () => {
				const initialState = {
					notificationModalTitle: 'Error',
					notificationModalType: 'danger',
					notificationModalMessage: 'An error occurred while adding the timeframe to the calender!',
				};
				this.modalService.show(NotificationModalComponent, { initialState });
			},
		});
	}

	deleteTimeFrame(timeframe: MaintenanceTimeFrame): void {
		this.voService.deleteMaintenanceTimeFrame(timeframe).subscribe({
			next: () => {
				this.reloadTimeFrames();
				const initialState = {
					notificationModalTitle: 'Success',
					notificationModalType: 'info',
					notificationModalMessage: 'The new maintenance got successfully deleted from the calender!',
				};
				this.modalService.show(NotificationModalComponent, { initialState });
			},
			error: () => {
				const initialState = {
					notificationModalTitle: 'Error',
					notificationModalType: 'danger',
					notificationModalMessage: 'An error occurred while deleting the timeframe.',
				};
				this.modalService.show(NotificationModalComponent, { initialState });
			},
		});
	}


}
