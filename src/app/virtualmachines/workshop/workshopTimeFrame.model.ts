import { Workshop } from './workshop.model';
import { Application } from '../../applications/application.model/application.model';

export class WorkshopTimeFrame {
	id: string = '';
	workshop: Workshop = new Workshop();
	start_time: Date = new Date();
	end_time: Date = new Date();
	description: string = '';
	project: Application = new Application();

	constructor(workshopTimeFrame?: Partial<WorkshopTimeFrame>) {
		Object.assign(this, workshopTimeFrame);
		this.workshop = new Workshop();
		this.start_time = new Date();
		this.end_time = new Date();
		this.project = new Application();
		if (workshopTimeFrame.workshop) {
			this.workshop = workshopTimeFrame.workshop;
		}
		if (workshopTimeFrame.start_time) {
			this.start_time = workshopTimeFrame.start_time;
		}
		if (workshopTimeFrame.end_time) {
			this.end_time = workshopTimeFrame.end_time;
		}
		if (workshopTimeFrame.description) {
			this.description = workshopTimeFrame.description;
		}
		if (workshopTimeFrame.project) {
			this.project = workshopTimeFrame.project;
		}
	}
}
