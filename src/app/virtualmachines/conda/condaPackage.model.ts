/**
 * Class for packages selected in Conda to represent them in the instance-detail.
 */
export class CondaPackage {
	name: string;
	version: string;

	constructor(condaPackage?: Partial<CondaPackage>, name?: string, version?: string) {
		if (condaPackage) {
			Object.assign(this, condaPackage);
		} else {
			this.name = name;
			this.version = version;
		}
	}
}
