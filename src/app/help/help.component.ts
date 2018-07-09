import {Component} from '@angular/core';
import { NgModule } from '@angular/core';

@Component({
    templateUrl: './help.component.html',
})

export class HelpComponent {

  public emailSubject: string;
  public emailText: string;
  public emailStatus: number = 0;
  public emailAdress: string;

  sendEmail(subject: string, message: string) {
    this.emailStatus = 1;
    return true;
  }

  resetEmail(){
    this.emailStatus = 0;
    this.emailText = '';
    this.emailSubject = '';
    this.emailAdress = '';
  }
}


