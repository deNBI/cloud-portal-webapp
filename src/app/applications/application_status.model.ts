/**
 * ApplicationStatus class.
 */
export class ApplicationStatus {

    /**
     * Id of the status.
     */
    private _Id: number;

    /**
     * Name of the status.
     */
    private _Name: string;

    constructor(Id: number, Name: string) {
        this._Id = Id;
        this._Name = Name;
    }

    get Id(): number {
        return this._Id;
    }

    set Id(value: number) {
        this._Id = value;
    }

    get Name(): string {
        return this._Name;
    }

    set Name(value: string) {
        this._Name = value;
    }
}
