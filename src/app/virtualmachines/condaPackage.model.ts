/**
 * Class for packages selected in Conda to represent them in the instance-detail.
 */
export class CondaPackage {

	name: string;
	version: string;
	build: string;

	constructor(condaPackage?: Partial<CondaPackage>) {
		Object.assign(this, condaPackage);
	}

}
