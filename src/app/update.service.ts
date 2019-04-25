import {ApplicationRef, Injectable} from '@angular/core';
import {MatSnackBar} from '@angular/material';
import {SwUpdate} from '@angular/service-worker';
import {concat, interval} from "rxjs";
import {first} from 'rxjs/operators';

@Injectable()
export class UpdateService {

  constructor(private appRef: ApplicationRef, private swUpdate: SwUpdate, private snackbar: MatSnackBar) {
    const isStable = appRef.isStable.pipe(first(isStable => isStable === true));

    const intervalTime = interval(60 * 1000);
    const checkUpdatesInIntervall = concat(isStable, intervalTime);
    checkUpdatesInIntervall.subscribe(() => this.swUpdate.checkForUpdate().subscribe(() => {
      this.swUpdate.available.subscribe(evt => {
        console.log('new action');
        const snack = this.snackbar.open('Update Available', 'Reload', {
          duration: 10000
        });

        snack
          .onAction()
          .subscribe(() => {
            window.location.reload();
          });
      });

    }))


  }
}
