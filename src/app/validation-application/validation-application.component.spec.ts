import ***REMOVED*** async, ComponentFixture, TestBed ***REMOVED*** from '@angular/core/testing';

import ***REMOVED*** ValidationApplicationComponent ***REMOVED*** from './validation-application.component';

describe('ValidationApplicationComponent', () => ***REMOVED***
  let component: ValidationApplicationComponent;
  let fixture: ComponentFixture<ValidationApplicationComponent>;

  beforeEach(async(() => ***REMOVED***
    TestBed.configureTestingModule(***REMOVED***
      declarations: [ ValidationApplicationComponent ]
    ***REMOVED***)
    .compileComponents();
  ***REMOVED***));

  beforeEach(() => ***REMOVED***
    fixture = TestBed.createComponent(ValidationApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  ***REMOVED***);

  it('should create', () => ***REMOVED***
    expect(component).toBeTruthy();
  ***REMOVED***);
***REMOVED***);
