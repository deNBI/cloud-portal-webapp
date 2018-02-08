import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {RequestOptions, XHRBackend, Http} from '@angular/http';
import {HttpInterceptor} from "app/interceptor";
import {ModalDirective} from "ngx-bootstrap";


export function httpInterceptor(backend: XHRBackend, options: RequestOptions, modal: AppComponent) {
  return new HttpInterceptor(backend, options, modal.getModal());
}

@Component({
  selector: 'body',
  templateUrl: 'app.component.html',
  providers: [ {
    provide: Http,
    useFactory: httpInterceptor,
    deps: [XHRBackend, RequestOptions, AppComponent]
  }]
})
export class AppComponent implements AfterViewInit {

  ngAfterViewInit(): void {
  }

  @ViewChild('timeoutModal') modal: ModalDirective;

  refresh() {
    window.sessionStorage.clear();
    window.location.reload(true);
  }

  getModal() {
    return this.modal;
  }
}
