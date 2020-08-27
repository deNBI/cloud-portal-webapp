import {Component, HostListener, Input, Output, EventEmitter} from '@angular/core';
import {UserService} from '../api-connector/user.service';
import {NavigationPoint} from './navigationPoint.model';

/**
 * Title headbar component.
 */
@Component({
             templateUrl: 'title-headbar.component.html',
             selector: 'app-title-headbar',
             providers: [UserService]

           })
export class TitleHeadbarComponent {

    @Input() page_title: string;
    @Input() navigationPoints: NavigationPoint[];

  constructor(private userService: UserService) {

  }

    logout(): void {
    this.userService.logoutUser().subscribe((redirect: any): void => {

      window.location.href = redirect['redirect'];
    })
  }

}
