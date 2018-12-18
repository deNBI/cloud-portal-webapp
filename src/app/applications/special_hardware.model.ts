export class SpecialHardware ***REMOVED***

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
     * @param ***REMOVED***number***REMOVED*** Id
     * @param ***REMOVED***string***REMOVED*** Key
     * @param ***REMOVED***string***REMOVED*** Name
     */
  constructor(Id: number, Key: string, Name: string) ***REMOVED***
    this._Id = Id;
    this._Key = Key;
    this._Name = Name;
    this._Checked = false;
  ***REMOVED***

  get Id(): number ***REMOVED***
    return this._Id;
  ***REMOVED***

  set Id(value: number) ***REMOVED***
    this._Id = value;
  ***REMOVED***

  get Key(): string ***REMOVED***
    return this._Key;
  ***REMOVED***

  set Key(value: string) ***REMOVED***
    this._Key = value;
  ***REMOVED***

  get Name(): string ***REMOVED***
    return this._Name;
  ***REMOVED***

  set Name(value: string) ***REMOVED***
    this._Name = value;
  ***REMOVED***

  get Checked(): boolean ***REMOVED***
    return this._Checked;
  ***REMOVED***

  set Checked(value: boolean) ***REMOVED***
    this._Checked = value;
  ***REMOVED***

***REMOVED***
