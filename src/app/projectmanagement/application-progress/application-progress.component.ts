import { Component, Input } from '@angular/core';
import { ApplicationBaseClassComponent } from '../../shared/shared_modules/baseClass/application-base-class.component';
import { Application } from '../../applications/application.model/application.model';
import { Application_States } from '../../shared/shared_modules/baseClass/abstract-base-class';

/**
 * Components displays progress of given application.
 */
@Component({
	selector: 'app-application-progress',
	templateUrl: './application-progress.component.html',
	styleUrls: ['./application-progress.component.scss'],
	providers: [],
})

export class ApplicationProgressComponent extends ApplicationBaseClassComponent {

  @Input() application: Application;
  Application_States: typeof Application_States = Application_States;
}
