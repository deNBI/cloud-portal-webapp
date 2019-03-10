import ***REMOVED***AfterViewInit, Component, ViewChild***REMOVED*** from '@angular/core';
import ***REMOVED***Http, RequestOptions, XHRBackend***REMOVED*** from '@angular/http';
import ***REMOVED***ModalDirective***REMOVED*** from 'ngx-bootstrap';


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

    ngAfterViewInit(): void ***REMOVED***
    ***REMOVED***
***REMOVED***
