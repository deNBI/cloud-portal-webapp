import ***REMOVED*** Component, OnInit ***REMOVED*** from '@angular/core';

@Component(***REMOVED***
  selector: 'app-dashboard',
  templateUrl: './full-layout.component.html'
***REMOVED***)
export class FullLayoutComponent implements OnInit ***REMOVED***

  public year = new Date().getFullYear();
  public disabled = false;
  public status: ***REMOVED***isopen: boolean***REMOVED*** = ***REMOVED***isopen: false***REMOVED***;

  public toggled(open: boolean): void ***REMOVED***
    console.log('Dropdown is now: ', open);
  ***REMOVED***

  public toggleDropdown($event: MouseEvent): void ***REMOVED***
    $event.preventDefault();
    $event.stopPropagation();
    this.status.isopen = !this.status.isopen;
  ***REMOVED***

  ngOnInit(): void ***REMOVED******REMOVED***
***REMOVED***
