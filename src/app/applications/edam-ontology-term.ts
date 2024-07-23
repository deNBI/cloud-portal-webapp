/**
 * Edam ontology term class.
 */
export class EdamOntologyTerm {
	public name: string;
	public term: string;
	public uri: string;

	constructor(name: string, term: string, uri: string) {
		this.name = name;
		this.term = term;
		this.uri = uri;
	}
}
