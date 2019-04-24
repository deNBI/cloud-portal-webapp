import ***REMOVED*** async, ComponentFixture, TestBed ***REMOVED*** from '@angular/core/testing';

import ***REMOVED*** TypeOverviewComponent ***REMOVED*** from './type-overview.component';

describe('TypeOverviewComponent', () => ***REMOVED***
  let component: TypeOverviewComponent;
  let fixture: ComponentFixture<TypeOverviewComponent>;

  beforeEach(async(() => ***REMOVED***
    TestBed.configureTestingModule(***REMOVED***
      declarations: [ TypeOverviewComponent ]
    ***REMOVED***)
    .compileComponents();
  ***REMOVED***));

  beforeEach(() => ***REMOVED***
    fixture = TestBed.createComponent(TypeOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  ***REMOVED***);

  it('should create', () => ***REMOVED***
    expect(component).toBeTruthy();
  ***REMOVED***);
***REMOVED***);
