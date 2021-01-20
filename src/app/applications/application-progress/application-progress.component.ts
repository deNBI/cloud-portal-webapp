import {Component, Input, OnInit} from '@angular/core';
import {ApplicationBaseClassComponent} from '../../shared/shared_modules/baseClass/application-base-class.component';
import {Application} from '../application.model/application.model';
import {Application_States} from '../../shared/shared_modules/baseClass/abstract-base-class';

@Component({
  selector: 'app-application-progress',
  templateUrl: './application-progress.component.html',
  styleUrls: ['./application-progress.component.scss'],
  providers: []
})

/**
 * Components displays progress of given application.
 */
export class ApplicationProgressComponent extends ApplicationBaseClassComponent implements OnInit {

  @Input() application: Application;
  application_progress: number;

  ngOnInit(): void {
    this.calculateProgressState();
    console.log(this.application.project_application_status);
  }

  calculateProgressState(): void {
    let progress_number: number;
    if (this.application?.project_application_date_approved) {
      progress_number = 4;
    } else if (this.application?.project_application_perun_id) {
      progress_number = 3;
    } else if (this.application?.project_application_pi_approved) {
      progress_number = 2;
    } else {
      progress_number = 1;
    }
    this.application_progress = progress_number;
  }
}
