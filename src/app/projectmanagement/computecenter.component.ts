export class ComputecenterComponent {


    private _FacilityId: number;
    private _Name: string;
    private _Login: string;
    private _Support: string;


    constructor(FacilityId: number, Name: string, Login: string, Support: string) {
        this._FacilityId = FacilityId;
        this._Name = Name;
        this._Login = Login;
        this._Support = Support


    }

    get FacilityId(): number {
        return this._FacilityId
    }

    set FacilityId(value: number) {
        this._FacilityId = value;
    }

    get Name(): string {
        return this._Name
    }

    set Name(value: string) {
        this._Name = value;
    }

    get Login(): string {
        return this._Login
    }

    set Login(value: string) {
        this._Login = value;
    }

    get Support(): string {
        return this._Support
    }

    set Support(value: string) {
        this.Support = value;
    }


}
