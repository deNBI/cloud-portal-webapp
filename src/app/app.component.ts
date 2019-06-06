import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {Http, RequestOptions, XHRBackend} from '@angular/http';
import {ModalDirective} from 'ngx-bootstrap';
import {SwUpdate} from '@angular/service-worker';
import {Angulartics2Piwik} from 'angulartics2/piwik';
import {ApplicationRef} from '@angular/core';
import {concat, interval} from 'rxjs';
import {first} from 'rxjs/operators';
import {environment} from '../environments/environment';

/**
 * App component.
 */
@Component({
             selector: 'body',
             templateUrl: 'app.component.html',
             providers: [{
               provide: Http,
               deps: [XHRBackend, RequestOptions, AppComponent]
             }]
           })
export class AppComponent implements AfterViewInit, OnInit {

  notificationModalTitle = 'Update available';
  notificationModalMessage = 'A new update is available. Please reload the site to use the new version of the portal.';
  notificationModalType = 'info';

  @ViewChild('notificationModal') modal: ModalDirective;

  constructor(private appRef: ApplicationRef, private angulartics2Piwik: Angulartics2Piwik) {
    /*   if (environment.production) {
           const isStable = appRef.isStable.pipe(first(isStable => isStable === true));
           const intervalTime = interval(60 * 1000);
           const checkUpdatesInIntervall = concat(isStable, intervalTime);
           checkUpdatesInIntervall.subscribe(() => this.swUpdate.checkForUpdate().then(() => {
               this.swUpdate.available.subscribe(evt => {
                   this.openNotificationModal()

               })
           }))
       }*/

  }

  reloadSite() {
    window.location.reload()
  }

  openNotificationModal() {

    this.modal.show()
  }

  ngOnInit(): void {
    this.angulartics2Piwik.startTracking();
  }

  ngAfterViewInit(): void {
  }
}
