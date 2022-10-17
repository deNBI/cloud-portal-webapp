/**
 * Project Member class.
 */
export class ProjectMember {
	userId: number | string;
	memberId: number | string;
	userName: string;
	firstName: string;
	lastName: string;

	isAdmin: boolean;
	isPi: boolean;
	elixirId: string;
	email: string;
	publicKeySet: boolean;
	publicKey: string;
	hasVM: boolean = false;
	vm_amount: number = 0;

	constructor(project_member?: Partial<ProjectMember>) {
		Object.assign(this, project_member);
	}
}
