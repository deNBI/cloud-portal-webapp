/**
 * Project enumeration class.
 */
export class ProjectEnumeration {
	project_name: string;
	application_id: string;
	has_perun_group: boolean;
	is_open_stack: boolean;
	project_lifetime: number;
	project_start_date: string;
	project_application_statuses: number[];
	compute_center_id: number;
	compute_center_name: string;

	public gotStatus(status: number): boolean {
		return this.project_application_statuses.includes(status);
	}
}
