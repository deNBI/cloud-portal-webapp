import ***REMOVED***AfterViewInit, Component, ViewChild, OnInit***REMOVED*** from '@angular/core';
import ***REMOVED***Http, RequestOptions, XHRBackend***REMOVED*** from '@angular/http';
import ***REMOVED***ModalDirective***REMOVED*** from 'ngx-bootstrap';
import ***REMOVED***Angulartics2Piwik***REMOVED*** from 'angulartics2/piwik';

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

    @ViewChild('timeoutModal') modal: ModalDirective;

    constructor(private angulartics2Piwik: Angulartics2Piwik) ***REMOVED***

    ***REMOVED***

    ngOnInit(): void ***REMOVED***
      this.angulartics2Piwik.startTracking();
    ***REMOVED***

    ngAfterViewInit(): void ***REMOVED***
    ***REMOVED***
***REMOVED***
