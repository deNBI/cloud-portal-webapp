import ***REMOVED***AfterViewInit, Component, OnInit, ViewChild***REMOVED*** from '@angular/core';
import ***REMOVED***Http, RequestOptions, XHRBackend***REMOVED*** from '@angular/http';
import ***REMOVED***ModalDirective***REMOVED*** from 'ngx-bootstrap';
import ***REMOVED***SwUpdate***REMOVED*** from '@angular/service-worker';
import ***REMOVED***Angulartics2Piwik***REMOVED*** from 'angulartics2/piwik';
import ***REMOVED***ApplicationRef***REMOVED*** from '@angular/core';
import ***REMOVED***concat, interval***REMOVED*** from "rxjs";
import ***REMOVED***first***REMOVED*** from 'rxjs/operators';
import ***REMOVED***environment***REMOVED*** from "../environments/environment";

/**
 * App component.
 */
@Component(***REMOVED***
    selector: 'body',
    templateUrl: 'app.component.html',
    providers: [***REMOVED***
        provide: Http,
        deps: [XHRBackend, RequestOptions, AppComponent]
    ***REMOVED***]
***REMOVED***)
export class AppComponent implements AfterViewInit, OnInit ***REMOVED***

    notificationModalTitle = 'Update available';
    notificationModalMessage = 'A new update is available. Please reload the site to use the new version of the portal.';
    notificationModalType = 'info';

    @ViewChild('notificationModal') modal: ModalDirective;


    constructor(private appRef: ApplicationRef, private swUpdate: SwUpdate, private angulartics2Piwik: Angulartics2Piwik) ***REMOVED***
        if (environment.production) ***REMOVED***
            const isStable = appRef.isStable.pipe(first(isStable => isStable === true));
            const intervalTime = interval(60 * 1000);
            const checkUpdatesInIntervall = concat(isStable, intervalTime);
            checkUpdatesInIntervall.subscribe(() => this.swUpdate.checkForUpdate().then(() => ***REMOVED***
                this.swUpdate.available.subscribe(evt => ***REMOVED***
                    this.openNotificationModal()

                ***REMOVED***)
            ***REMOVED***))
        ***REMOVED***


    ***REMOVED***

    reloadSite() ***REMOVED***
        window.location.reload()
    ***REMOVED***

    openNotificationModal() ***REMOVED***

        this.modal.show()
    ***REMOVED***


    ngOnInit(): void ***REMOVED***
        this.angulartics2Piwik.startTracking();
    ***REMOVED***

    ngAfterViewInit(): void ***REMOVED***
    ***REMOVED***
***REMOVED***
