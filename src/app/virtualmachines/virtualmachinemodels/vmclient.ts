export class Vmclient {
    id: string;
    host: string;
    status: string;
    port: string;
    version: string;
    features: string[];
    location: string;

    public isInFeatures(feature: string) {
        if (this.features.indexOf(feature) > -1) {
            return true
        }
        else {
            return false;
        }
    }
}
