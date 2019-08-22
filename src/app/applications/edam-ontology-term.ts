export class EdamOntologyTerm {

  private _storid: number;
  private _name: string;
  private _term: string;
  private _uri: string;
  private _is_a: number[];

  constructor(storid: number, name: string, term: string, uri: string, is_a: number[]) {
    this._storid = storid;
    this._name = name;
    this._term = term;
    this._uri = uri;
    this._is_a = is_a;
  }

  get storid(): number {
    return this._storid;
  }

  set storid(value: number) {
    this._storid = value;
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  get term(): string {
    return this._term;
  }

  set term(value: string) {
    this._term = value;
  }

  get uri(): string {
    return this._uri;
  }

  set uri(value: string) {
    this._uri = value;
  }

  get is_a(): number[] {
    return this._is_a;
  }

  set is_a(value: number[]) {
    this._is_a = value;
  }
}
