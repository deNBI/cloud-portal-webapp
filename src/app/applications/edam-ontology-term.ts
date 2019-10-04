export class EdamOntologyTerm ***REMOVED***

  private _name: string;
  private _term: string;
  private _uri: string;

  constructor(storid: number, name: string, term: string, uri: string, is_a: number[]) ***REMOVED***
    this._name = name;
    this._term = term;
    this._uri = uri;
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

***REMOVED***
