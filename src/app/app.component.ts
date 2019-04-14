import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {Http, RequestOptions, XHRBackend} from '@angular/http';
import {ModalDirective} from 'ngx-bootstrap';
import {UpdateService} from './update.service';

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
export class AppComponent implements AfterViewInit {

    @ViewChild('timeoutModal') modal: ModalDirective;

    constructor(private update: UpdateService) {
    }

    ngAfterViewInit(): void {
    }
}
