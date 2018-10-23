export class Vmclient ***REMOVED***
    id: string;
    host: string;
    status: string;
    port: string;
    version: string;
    features: string[];
    location: string;

    public isInFeatures(feature: string) ***REMOVED***
        if (this.features.indexOf(feature) > -1) ***REMOVED***
            return true
        ***REMOVED***
        else ***REMOVED***
            return false;
        ***REMOVED***
    ***REMOVED***
***REMOVED***
