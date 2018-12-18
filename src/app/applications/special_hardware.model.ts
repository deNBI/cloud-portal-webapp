export class SpecialHardware {

    /**
     * Id of the special hardware.
     */
  private _Id: number;
    /**
     * Key of the special hardware.
     */
  private _Key: string;
    /**
     * Name of the special hardware.
     */
  private _Name: string;
    /**
     * If the special hardware was checked in a form.
     */
  private _Checked: boolean;

    /**
     * Initialize the special hardware with values.
     * @param {number} Id
     * @param {string} Key
     * @param {string} Name
     */
  constructor(Id: number, Key: string, Name: string) {
    this._Id = Id;
    this._Key = Key;
    this._Name = Name;
    this._Checked = false;
  }

  get Id(): number {
    return this._Id;
  }

  set Id(value: number) {
    this._Id = value;
  }

  get Key(): string {
    return this._Key;
  }

  set Key(value: string) {
    this._Key = value;
  }

  get Name(): string {
    return this._Name;
  }

  set Name(value: string) {
    this._Name = value;
  }

  get Checked(): boolean {
    return this._Checked;
  }

  set Checked(value: boolean) {
    this._Checked = value;
  }

}
