export class MaintenanceTimeFrame {
	id: string = '';
	name: string = '';
	start_time: Date = new Date();
	end_time: Date = new Date();
	message: string = '';

	constructor(maintenanceTimeFrame?: Partial<MaintenanceTimeFrame>) {
		Object.assign(this, maintenanceTimeFrame);
		console.log(maintenanceTimeFrame);
		this.start_time = new Date();
		this.end_time = new Date();
		if (maintenanceTimeFrame.name) {
			this.name = maintenanceTimeFrame.name;
		}
		if (maintenanceTimeFrame.start_time) {
			this.start_time = maintenanceTimeFrame.start_time;
		}
		if (maintenanceTimeFrame.end_time) {
			this.end_time = maintenanceTimeFrame.end_time;
		}
		if (maintenanceTimeFrame.message) {
			this.message = maintenanceTimeFrame.message;
		}
	}
}
