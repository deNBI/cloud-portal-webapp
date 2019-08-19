export class EdamOntologyTerm ***REMOVED***

  private _storid: number;
  private _name: string;
  private _term: string;
  private _uri: string;
  private _is_a: number[];

  constructor(storid: number, name: string, term: string, uri: string, is_a: number[]) ***REMOVED***
    this._storid = storid;
    this._name = name;
    this._term = term;
    this._uri = uri;
    this._is_a = is_a;
  ***REMOVED***

  get storid(): number ***REMOVED***
    return this._storid;
  ***REMOVED***

  set storid(value: number) ***REMOVED***
    this._storid = value;
  ***REMOVED***

  get name(): string ***REMOVED***
    return this._name;
  ***REMOVED***

  set name(value: string) ***REMOVED***
    this._name = value;
  ***REMOVED***

  get term(): string ***REMOVED***
    return this._term;
  ***REMOVED***

  set term(value: string) ***REMOVED***
    this._term = value;
  ***REMOVED***

  get uri(): string ***REMOVED***
    return this._uri;
  ***REMOVED***

  set uri(value: string) ***REMOVED***
    this._uri = value;
  ***REMOVED***

  get is_a(): number[] ***REMOVED***
    return this._is_a;
  ***REMOVED***

  set is_a(value: number[]) ***REMOVED***
    this._is_a = value;
  ***REMOVED***
***REMOVED***
