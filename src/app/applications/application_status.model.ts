/**
 * ApplicationStatus class.
 */
export class ApplicationStatus {

    /**
     * id of the status.
     */
    application_status_id: number;

    /**
     * application_status_name of the status.
     */
    application_status_name: string;

    constructor(Id: number, Name: string) {
        this.application_status_id = Id;
        this.application_status_name = Name;
    }
}
