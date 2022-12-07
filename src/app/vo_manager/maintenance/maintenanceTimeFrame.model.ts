export class MaintenanceTimeFrame {
	id: string = '';
	name: string = '';
	start_time: Date = new Date();
	end_time: Date = new Date();
	message: string = '';

	constructor(workshopTimeFrame?: Partial<MaintenanceTimeFrame>) {
		Object.assign(this, workshopTimeFrame);
		this.start_time = new Date();
		this.end_time = new Date();
		if (workshopTimeFrame.name) {
			this.name = workshopTimeFrame.name;
		}
		if (workshopTimeFrame.start_time) {
			this.start_time = workshopTimeFrame.start_time;
		}
		if (workshopTimeFrame.end_time) {
			this.end_time = workshopTimeFrame.end_time;
		}
		if (workshopTimeFrame.message) {
			this.message = workshopTimeFrame.message;
		}
	}
}
