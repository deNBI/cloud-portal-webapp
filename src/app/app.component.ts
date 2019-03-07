import ***REMOVED***AfterViewInit, Component, ViewChild***REMOVED*** from '@angular/core';
import ***REMOVED***Http, RequestOptions, XHRBackend***REMOVED*** from '@angular/http';
import ***REMOVED***HttpInterceptor***REMOVED*** from 'app/interceptor';
import ***REMOVED***ModalDirective***REMOVED*** from 'ngx-bootstrap';

export function httpInterceptor(backend: XHRBackend, options: RequestOptions, modal: AppComponent) ***REMOVED***
    return new HttpInterceptor(backend, options, modal.getModal());
***REMOVED***

@Component(***REMOVED***
    selector: 'body',
    templateUrl: 'app.component.html',
    providers: [***REMOVED***
        provide: Http,
        useFactory: httpInterceptor,
        deps: [XHRBackend, RequestOptions, AppComponent]
    ***REMOVED***]
***REMOVED***)
export class AppComponent implements AfterViewInit ***REMOVED***

    @ViewChild('timeoutModal') modal: ModalDirective;

    ngAfterViewInit(): void ***REMOVED***
    ***REMOVED***

    refresh() ***REMOVED***
        window.sessionStorage.clear();
        window.location.reload(true);
    ***REMOVED***

    getModal() ***REMOVED***
        return this.modal;
    ***REMOVED***
***REMOVED***
