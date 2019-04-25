import ***REMOVED***ApplicationRef, Injectable***REMOVED*** from '@angular/core';
import ***REMOVED***MatSnackBar***REMOVED*** from '@angular/material';
import ***REMOVED***SwUpdate***REMOVED*** from '@angular/service-worker';
import ***REMOVED***concat, interval***REMOVED*** from "rxjs";
import ***REMOVED***first***REMOVED*** from 'rxjs/operators';

@Injectable()
export class UpdateService ***REMOVED***

  constructor(private appRef: ApplicationRef, private swUpdate: SwUpdate, private snackbar: MatSnackBar) ***REMOVED***
    const isStable = appRef.isStable.pipe(first(isStable => isStable === true));

    const intervalTime = interval(60 * 1000);
    const checkUpdatesInIntervall = concat(isStable, intervalTime);
    checkUpdatesInIntervall.subscribe(() => this.swUpdate.checkForUpdate().subscribe(() => ***REMOVED***
      this.swUpdate.available.subscribe(evt => ***REMOVED***
        console.log('new action');
        const snack = this.snackbar.open('Update Available', 'Reload', ***REMOVED***
          duration: 10000
        ***REMOVED***);

        snack
          .onAction()
          .subscribe(() => ***REMOVED***
            window.location.reload();
          ***REMOVED***);
      ***REMOVED***);

    ***REMOVED***))


  ***REMOVED***
***REMOVED***
