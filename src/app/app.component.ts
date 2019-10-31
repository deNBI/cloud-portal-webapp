import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {Http, RequestOptions, XHRBackend} from '@angular/http';
import {ModalDirective} from 'ngx-bootstrap';
import {Angulartics2Piwik} from 'angulartics2/piwik';
import {ApplicationRef} from '@angular/core';

/**
 * App component.
 */
@Component({
             // tslint:disable-next-line:component-selector
             selector: 'body',
             templateUrl: 'app.component.html',
             providers: [{
               provide: Http,
               deps: [XHRBackend, RequestOptions, AppComponent]
             }]
           })
export class AppComponent implements AfterViewInit, OnInit {

  notificationModalTitle: string = 'Update available';
  notificationModalMessage: string = 'A new update is available. Please reload the site to use the new version of the portal.';
  notificationModalType: string = 'info';

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

  reloadSite(): void {
    window.location.reload()
  }

  ngOnInit(): void {
    this.angulartics2Piwik.startTracking();
  }

  ngAfterViewInit(): void {
  }
}
