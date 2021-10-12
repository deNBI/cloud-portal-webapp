/**
 * Project Member class.
 */
export class ProjectMember {

	userId: number | string;
	memberId: number | string;
	userName: string;
	firstName: string;
	lastName: string;

	IsPi: boolean;
	elixirId: string;
	email: string;
	publicKeySet: boolean;
	groupAdmin: boolean;
	hasVM: boolean = false;

	constructor(project_member?: Partial<ProjectMember>) {
		Object.assign(this, project_member);
	}

}
