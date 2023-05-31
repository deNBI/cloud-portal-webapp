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
	) {}

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
		this.newMaintenanceTimeFrame.start_time = new Date(
			date.year,
			date.month - 1,
			date.day,
			this.newMaintenanceTimeFrame.start_time.getHours(),
			this.newMaintenanceTimeFrame.start_time.getMinutes(),
		);

		this.newMaintenanceTimeFrame.end_time = new Date(
			date.year,
			date.month - 1,
			date.day,
			this.newMaintenanceTimeFrame.end_time.getHours(),
			this.newMaintenanceTimeFrame.end_time.getMinutes(),
		);
	}

	startTimeChanged(time: { hour: number; minute: number }): void {
		this.newMaintenanceTimeFrame.start_time = new Date(
			this.newMaintenanceTimeFrame.start_time.getFullYear(),
			this.newMaintenanceTimeFrame.start_time.getMonth(),
			this.newMaintenanceTimeFrame.start_time.getDate(),
			time.hour,
			time.minute,
		);
	}

	endTimeChanged(time: { hour: number; minute: number }): void {
		this.newMaintenanceTimeFrame.end_time = new Date(
			this.newMaintenanceTimeFrame.end_time.getFullYear(),
			this.newMaintenanceTimeFrame.end_time.getMonth(),
			this.newMaintenanceTimeFrame.end_time.getDate(),
			time.hour,
			time.minute,
		);
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
		this.workshopTimeFrames.forEach((wstf: WorkshopTimeFrame) => {
			const start_time: number = new Date(wstf.start_time).getTime();
			const end_time: number = new Date(wstf.end_time).getTime();
			if (
				this.datesOverlap(
					start_time,
					end_time,
					this.newMaintenanceTimeFrame.start_time.getTime(),
					this.newMaintenanceTimeFrame.end_time.getTime(),
				)
			) {
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

	/**
	 * This can also be used for further adjustments of the timeframe in the future - just needs to be implemented on the frontend.
	 * @param timeframe
	 */
	switchSignificance(timeframe: MaintenanceTimeFrame): void {
		timeframe.significant = !timeframe.significant;
		this.voService.adjustMaintenanceTimeFrame(timeframe).subscribe({
			next: () => {
				this.reloadTimeFrames();
				const initialState = {
					notificationModalTitle: 'Success',
					notificationModalType: 'info',
					notificationModalMessage: 'The maintenance got successfully adjusted!',
				};
				this.modalService.show(NotificationModalComponent, { initialState });
			},
			error: () => {
				const initialState = {
					notificationModalTitle: 'Error',
					notificationModalType: 'danger',
					notificationModalMessage: 'An error occurred while adjusting the timeframe.',
				};
				this.modalService.show(NotificationModalComponent, { initialState });
			},
		});
	}
}
