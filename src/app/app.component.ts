import {AfterViewInit, Component, ViewChild, OnInit} from '@angular/core';
import {Http, RequestOptions, XHRBackend} from '@angular/http';
import {ModalDirective} from 'ngx-bootstrap';
import {Angulartics2Piwik} from 'angulartics2/piwik';

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

    @ViewChild('timeoutModal') modal: ModalDirective;

    constructor(private angulartics2Piwik: Angulartics2Piwik) {

    }

    ngOnInit(): void {
      this.angulartics2Piwik.startTracking();
    }

    ngAfterViewInit(): void {
    }
}
