/**
 * ApplicationStatus class.
 */
export class ApplicationStatus {

    /**
     * application_status_id of the status.
     */
    private _application_status_id: number;

    /**
     * application_status_name of the status.
     */
    private _application_status_name: string;

    constructor(Id: number, Name: string) {
        this._application_status_id = Id;
        this._application_status_name = Name;
    }

    get application_status_id(): number {
        return this._application_status_id;
    }

    set application_status_id(value: number) {
        this._application_status_id = value;
    }

    get application_status_name(): string {
        return this._application_status_name;
    }

    set application_status_name(value: string) {
        this._application_status_name = value;
    }
}
