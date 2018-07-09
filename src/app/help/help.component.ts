import ***REMOVED***Component***REMOVED*** from '@angular/core';
import ***REMOVED*** NgModule ***REMOVED*** from '@angular/core';

@Component(***REMOVED***
    templateUrl: './help.component.html',
***REMOVED***)

export class HelpComponent ***REMOVED***

  public emailSubject: string;
  public emailText: string;
  public emailStatus: number = 0;
  public emailAdress: string;

  sendEmail(subject: string, message: string) ***REMOVED***
    this.emailStatus = 1;
    return true;
  ***REMOVED***

  resetEmail()***REMOVED***
    this.emailStatus = 0;
    this.emailText = '';
    this.emailSubject = '';
    this.emailAdress = '';
  ***REMOVED***
***REMOVED***


