/**
 * Class for packages selected in Conda to represent them in the instance-detail.
 */
export class CondaPackage {

  name: string;
  version: string;
  build: string;

  constructor(name: string, version: string, build: string) {
    this.name = name;
    this.version = version;
    this.build = build;
  }

}
