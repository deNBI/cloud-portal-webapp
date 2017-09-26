import ***REMOVED*** Component, OnInit ***REMOVED*** from '@angular/core';
import ***REMOVED*** Router, ActivatedRoute, NavigationEnd ***REMOVED*** from '@angular/router';
import 'rxjs/add/operator/filter';

@Component(***REMOVED***
  selector: 'app-breadcrumbs',
  template: `
  <ng-template ngFor let-breadcrumb [ngForOf]="breadcrumbs" let-last = last>
    <li class="breadcrumb-item"
        *ngIf="breadcrumb.label.title&&breadcrumb.url.substring(breadcrumb.url.length-1) == '/'||breadcrumb.label.title&&last"
        [ngClass]="***REMOVED***active: last***REMOVED***">
      <a *ngIf="!last" [routerLink]="breadcrumb.url">***REMOVED******REMOVED***breadcrumb.label.title***REMOVED******REMOVED***</a>
      <span *ngIf="last" [routerLink]="breadcrumb.url">***REMOVED******REMOVED***breadcrumb.label.title***REMOVED******REMOVED***</span>
    </li>
  </ng-template>`
***REMOVED***)
export class BreadcrumbsComponent implements OnInit ***REMOVED***
  breadcrumbs: Array<Object>;
  constructor(private router: Router, private route: ActivatedRoute) ***REMOVED******REMOVED***
  ngOnInit(): void ***REMOVED***
    this.router.events.filter(event => event instanceof NavigationEnd).subscribe(event => ***REMOVED***
      this.breadcrumbs = [];
      let currentRoute = this.route.root,
      url = '';
      do ***REMOVED***
        const childrenRoutes = currentRoute.children;
        currentRoute = null;
        childrenRoutes.forEach(route => ***REMOVED***
          if (route.outlet === 'primary') ***REMOVED***
            const routeSnapshot = route.snapshot;
            url += '/' + routeSnapshot.url.map(segment => segment.path).join('/');
            this.breadcrumbs.push(***REMOVED***
              label: route.snapshot.data,
              url:   url
            ***REMOVED***);
            currentRoute = route;
          ***REMOVED***
        ***REMOVED***);
      ***REMOVED*** while (currentRoute);
    ***REMOVED***);
  ***REMOVED***
***REMOVED***
