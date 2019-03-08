import ***REMOVED*** Directive, HostListener ***REMOVED*** from '@angular/core';

/**
* Allows the aside to be toggled via click.
*/
@Directive(***REMOVED***
  selector: '[appAsideMenuToggler]'
***REMOVED***)
export class AsideToggleDirective ***REMOVED***
  constructor() ***REMOVED*** ***REMOVED***

  @HostListener('click', ['$event'])
  toggleOpen($event: any) ***REMOVED***
    $event.preventDefault();
    document.querySelector('body').classList.toggle('aside-menu-hidden');
  ***REMOVED***
***REMOVED***
