import { Component, OnInit } from '@angular/core';
import html2canvas from 'html2canvas';
import * as saveSVG from 'save-svg-as-png';
import bb, { areaSpline, bar, Chart } from 'billboard.js';
import { jsPDF } from 'jspdf';
import * as d3 from 'd3';

import { NumbersService } from '../../api-connector/numbers.service';
import 'svg2pdf.js';
import {WorkshopService} from "../../api-connector/workshop.service";
import {Subscription} from "rxjs";
import {WorkshopTimeFrame} from "../../virtualmachines/workshop/workshopTimeFrame.model";
import {VoService} from "../../api-connector/vo.service";
import {MaintenanceTimeFrame} from "./maintenanceTimeFrame.model";
import {NotificationModalComponent} from "../../shared/modal/notification-modal";

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
	subscription: Subscription = new Subscription();
	is_vo_admin: boolean = false;
	title: string = 'Maintenance';

	workshopTimeFramesLoaded: boolean = false;
	maintenanceTimeFramesLoaded: boolean = false;
	workshopTimeFrames: WorkshopTimeFrame[] = [];
	maintenanceTimeFrames: MaintenanceTimeFrame[] = [];
	errorWorkshopTimeFrames: boolean = false;
	errorMaintenanceTimeFrames: boolean = false;
	newMaintenanceTimeFrame: MaintenanceTimeFrame = null;

	// eslint-disable-next-line no-empty-function

	constructor(private workshopService: WorkshopService, private voService: VoService) {

	}

	ngOnInit(): void {
		this.newMaintenanceTimeFrame = new MaintenanceTimeFrame(
			{
				name: '', start_time: new Date(), end_time: new Date(), message: '',
			},
		);
		this.workshopTimeFramesLoaded = false;
		this.maintenanceTimeFramesLoaded = false;
		this.subscription.add(
			this.workshopService.loadWorkshopTimeFrames().subscribe({
				next: (wsTimeFrames: WorkshopTimeFrame[]) => {
					console.log(wsTimeFrames);
					this.workshopTimeFrames = wsTimeFrames;
					this.workshopTimeFramesLoaded = true;
					this.errorWorkshopTimeFrames = false;
				},
				error: () => {
					this.workshopTimeFramesLoaded = true;
					this.errorWorkshopTimeFrames = true;
				},
			}),
		);
		this.subscription.add(
			this.voService.loadMaintenanceTimeFrames().subscribe({
				next: (mtTimeFrames: MaintenanceTimeFrame[]) => {
					console.log(mtTimeFrames);
					this.maintenanceTimeFrames = mtTimeFrames;
					this.maintenanceTimeFramesLoaded = true;
					this.errorMaintenanceTimeFrames = false;
				},
				error: () => {
					this.maintenanceTimeFramesLoaded = true;
					this.errorMaintenanceTimeFrames = true;
				},
			})
		);

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

	createNewTimeFrame(): void {
		this.voService.addMaintenanceTimeFrame(this.newMaintenanceTimeFrame).subscribe({
			next: () => {
				//this.loadCalenderForSelectedProject();
				const initialState = {
					notificationModalTitle: 'Success',
					notificationModalType: 'info',
					notificationModalMessage: 'The new timeframe got successfully added to the calender!',
				};
				//this.modalService.show(NotificationModalComponent, { initialState });
				console.log("worked");
			},
			error: () => {
				const initialState = {
					notificationModalTitle: 'Error',
					notificationModalType: 'danger',
					notificationModalMessage: 'An error occured while adding the timeframe to the calender!',
				};
				//this.modalService.show(NotificationModalComponent, { initialState });
				console.log("error");
			},
		});
	}


}
