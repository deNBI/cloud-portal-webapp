import { Workshop } from './workshop.model';

export class WorkshopTimeFrame {
	workshop: Workshop;
	start_time: Date;
	end_time: Date;
	description: string = '';

	constructor(workshopTimeFrame?: Partial<WorkshopTimeFrame>) {
		Object.assign(this, workshopTimeFrame);
		this.workshop = new Workshop();
		this.start_time = new Date();
		this.end_time = new Date();
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
	}
}
