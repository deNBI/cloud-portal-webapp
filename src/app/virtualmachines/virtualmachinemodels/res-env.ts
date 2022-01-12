/**
 * Res-Env Class.
 */
export class ResearchEnvironment {
	template_name: string;
	template_version: string;
	description: string;
	logo_url: string;
	info_url: string;
	title: string;
	incompatible_versions: string[];
	information_for_display: {
		[key: string]: string;
	};

	constructor(resenv?: Partial<ResearchEnvironment>) {
		Object.assign(this, resenv);
	}
}
