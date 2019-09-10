import ***REMOVED*** async, ComponentFixture, TestBed ***REMOVED*** from '@angular/core/testing';

import ***REMOVED*** ApplicationDetailComponent ***REMOVED*** from './application-detail.component';

describe('ApplicationDetailComponent', () => ***REMOVED***
  let component: ApplicationDetailComponent;
  let fixture: ComponentFixture<ApplicationDetailComponent>;

  beforeEach(async(() => ***REMOVED***
    TestBed.configureTestingModule(***REMOVED***
      declarations: [ ApplicationDetailComponent ]
    ***REMOVED***)
    .compileComponents();
  ***REMOVED***));

  beforeEach(() => ***REMOVED***
    fixture = TestBed.createComponent(ApplicationDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  ***REMOVED***);

  it('should create', () => ***REMOVED***
    expect(component).toBeTruthy();
  ***REMOVED***);
***REMOVED***);
