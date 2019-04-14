import ***REMOVED***Injectable***REMOVED*** from '@angular/core';
import ***REMOVED***MatSnackBar***REMOVED*** from '@angular/material';
import ***REMOVED***SwUpdate***REMOVED*** from '@angular/service-worker';

@Injectable()
export class UpdateService ***REMOVED***

    constructor(private swUpdate: SwUpdate, private snackbar: MatSnackBar) ***REMOVED***
        this.swUpdate.available.subscribe(evt => ***REMOVED***
            const snack = this.snackbar.open('Update Available', 'Reload', ***REMOVED***
                duration: 10000
            ***REMOVED***);

            snack
                .onAction()
                .subscribe(() => ***REMOVED***
                    window.location.reload();
                ***REMOVED***);
        ***REMOVED***);
    ***REMOVED***
***REMOVED***
