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

/**
 * Component to display graphs which illustrate numbers for VO.
 */
@Component({
	selector: 'app-maintenance',
	templateUrl: './maintenance.component.html',
	styleUrls: ['./maintenance.component.scss'],
	providers: [WorkshopService],
})
export class MaintenanceComponent implements OnInit {
	subscription: Subscription = new Subscription();
	is_vo_admin: boolean = false;
	title: string = 'Maintenance';

	workshopTimeFramesLoaded: boolean = false;
	workshopTimeFrames: WorkshopTimeFrame[] = [];
	errorLoadingTimeFrames: boolean = false;

	// eslint-disable-next-line no-empty-function

	constructor(private workshopService: WorkshopService) {

	}

	ngOnInit(): void {
		this.workshopTimeFramesLoaded = false;
		this.subscription.add(
			this.workshopService.loadWorkshopTimeFrames().subscribe({
				next: (wsTimeFrames: WorkshopTimeFrame[]) => {
					console.log(wsTimeFrames);
					this.workshopTimeFrames = wsTimeFrames;
					this.workshopTimeFramesLoaded = true;
					this.errorLoadingTimeFrames = false;
				},
				error: () => {
					this.workshopTimeFramesLoaded = true;
					this.errorLoadingTimeFrames = true;
				},
			}),
		);
	}


}
