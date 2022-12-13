/**
 * Backend class.
 */
export class Backend {
	owner: string;
	user_key_url: string;
	template: string;
	template_version: string;
	upstream_url: string;
	backend_id: number;
	location_url: string;
	playbook_successful: boolean;
	playbook_done: boolean;
	no_playbook: boolean;

	constructor(backend?: Partial<Backend>) {
		Object.assign(this, backend);
	}
}
