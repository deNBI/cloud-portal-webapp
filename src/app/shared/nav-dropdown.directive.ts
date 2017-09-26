import ***REMOVED*** Directive, HostListener, ElementRef ***REMOVED*** from '@angular/core';

@Directive(***REMOVED***
  selector: '[appNavDropdown]'
***REMOVED***)
export class NavDropdownDirective ***REMOVED***

  constructor(private el: ElementRef) ***REMOVED*** ***REMOVED***

  toggle() ***REMOVED***
    this.el.nativeElement.classList.toggle('open');
  ***REMOVED***
***REMOVED***

/**
* Allows the dropdown to be toggled via click.
*/
@Directive(***REMOVED***
  selector: '[appNavDropdownToggle]'
***REMOVED***)
export class NavDropdownToggleDirective ***REMOVED***
  constructor(private dropdown: NavDropdownDirective) ***REMOVED******REMOVED***

  @HostListener('click', ['$event'])
  toggleOpen($event: any) ***REMOVED***
    $event.preventDefault();
    this.dropdown.toggle();
  ***REMOVED***
***REMOVED***

export const NAV_DROPDOWN_DIRECTIVES = [NavDropdownDirective, NavDropdownToggleDirective];
