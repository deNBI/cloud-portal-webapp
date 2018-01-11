import ***REMOVED*** Directive, HostListener ***REMOVED*** from '@angular/core';

/**
* Allows the sidebar to be toggled via click.
*/
@Directive(***REMOVED***
  selector: '[appSidebarToggler]'
***REMOVED***)
export class SidebarToggleDirective ***REMOVED***
  constructor() ***REMOVED*** ***REMOVED***

  @HostListener('click', ['$event'])
  toggleOpen($event: any) ***REMOVED***
    $event.preventDefault();
    document.querySelector('body').classList.toggle('sidebar-hidden');
  ***REMOVED***
***REMOVED***

@Directive(***REMOVED***
  selector: '[appSidebarMinimizer]'
***REMOVED***)
export class SidebarMinimizeDirective ***REMOVED***
  constructor() ***REMOVED*** ***REMOVED***

  @HostListener('click', ['$event'])
  toggleOpen($event: any) ***REMOVED***
    $event.preventDefault();
    document.querySelector('body').classList.toggle('sidebar-minimized');
  ***REMOVED***
***REMOVED***

@Directive(***REMOVED***
  selector: '[appMobileSidebarToggler]'
***REMOVED***)
export class MobileSidebarToggleDirective ***REMOVED***
  constructor() ***REMOVED*** ***REMOVED***

  // Check if element has class
  private hasClass(target: any, elementClassName: string) ***REMOVED***
    return new RegExp('(\\s|^)' + elementClassName + '(\\s|$)').test(target.className);
  ***REMOVED***

  @HostListener('click', ['$event'])
  toggleOpen($event: any) ***REMOVED***
    $event.preventDefault();
    document.querySelector('body').classList.toggle('sidebar-mobile-show');
  ***REMOVED***
***REMOVED***

/**
* Allows the off-canvas sidebar to be closed via click.
*/
@Directive(***REMOVED***
  selector: '[appSidebarClose]'
***REMOVED***)
export class SidebarOffCanvasCloseDirective ***REMOVED***
  constructor() ***REMOVED*** ***REMOVED***

  // Check if element has class
  private hasClass(target: any, elementClassName: string) ***REMOVED***
    return new RegExp('(\\s|^)' + elementClassName + '(\\s|$)').test(target.className);
  ***REMOVED***

  // Toggle element class
  private toggleClass(elem: any, elementClassName: string) ***REMOVED***
    let newClass = ' ' + elem.className.replace( /[\t\r\n]/g, ' ' ) + ' ';
    if (this.hasClass(elem, elementClassName)) ***REMOVED***
      while (newClass.indexOf(' ' + elementClassName + ' ') >= 0 ) ***REMOVED***
        newClass = newClass.replace( ' ' + elementClassName + ' ' , ' ' );
      ***REMOVED***
      elem.className = newClass.replace(/^\s+|\s+$/g, '');
    ***REMOVED*** else ***REMOVED***
      elem.className += ' ' + elementClassName;
    ***REMOVED***
  ***REMOVED***

  @HostListener('click', ['$event'])
  toggleOpen($event: any) ***REMOVED***
    $event.preventDefault();

    if (this.hasClass(document.querySelector('body'), 'sidebar-off-canvas')) ***REMOVED***
      this.toggleClass(document.querySelector('body'), 'sidebar-opened');
    ***REMOVED***
  ***REMOVED***
***REMOVED***

export const SIDEBAR_TOGGLE_DIRECTIVES = [
    SidebarToggleDirective,
    SidebarMinimizeDirective,
    SidebarOffCanvasCloseDirective,
    MobileSidebarToggleDirective
];
