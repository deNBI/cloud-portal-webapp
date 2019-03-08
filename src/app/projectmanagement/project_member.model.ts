export class ProjectMember {
    get Email(): string {
        return this._Email;
    }

    set Email(value: string) {
        this._Email = value;
    }

    private _Id: number;
    private _MemberId: number;
    private _Username: string;
    private _IsPi: boolean;
    private _ElixirId: string;
    private _Email: string;

    constructor(Id: number, Username: string, MemberId: number) {
        this._Id = Id;
        this._Username = Username;
        this._MemberId = MemberId;

    }

    get ElixirId(): string {
        return this._ElixirId
    }

    set ElixirId(value: string) {
        this._ElixirId = value;
    }

    get IsPi(): boolean {
        return this._IsPi;
    }

    set IsPi(value: boolean) {
        this._IsPi = value;
    }

    get Id(): number {
        return this._Id;
    }

    set Id(value: number) {
        this._Id = value;
    }

    get Username(): string {
        return this._Username;
    }

    set Username(value: string) {
        this._Username = value;
    }

    get MemberId(): number {
        return this._MemberId;
    }

    set MemberId(value: number) {
        this._MemberId = value;
    }
}
