import ***REMOVED***AfterViewInit, Component, ViewChild***REMOVED*** from '@angular/core';
import ***REMOVED***Http, RequestOptions, XHRBackend***REMOVED*** from '@angular/http';
import ***REMOVED***ModalDirective***REMOVED*** from 'ngx-bootstrap';
import ***REMOVED***UpdateService***REMOVED*** from './update.service';

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
export class AppComponent implements AfterViewInit ***REMOVED***

    @ViewChild('timeoutModal') modal: ModalDirective;

    constructor(private update: UpdateService) ***REMOVED***
    ***REMOVED***

    ngAfterViewInit(): void ***REMOVED***
    ***REMOVED***
***REMOVED***
