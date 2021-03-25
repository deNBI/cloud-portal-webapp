/**
 * Edam ontology term class.
 */
export class EdamOntologyTerm {

	private _name: string;
	private _term: string;
	private _uri: string;

	constructor(storid: number, name: string, term: string, uri: string) {
		this._name = name;
		this._term = term;
		this._uri = uri;
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

}
