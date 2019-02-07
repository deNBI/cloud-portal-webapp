import ***REMOVED*** async, ComponentFixture, TestBed ***REMOVED*** from '@angular/core/testing';

import ***REMOVED*** ResourcesComponent ***REMOVED*** from './resources.component';

describe('ResourcesComponent', () => ***REMOVED***
  let component: ResourcesComponent;
  let fixture: ComponentFixture<ResourcesComponent>;

  beforeEach(async(() => ***REMOVED***
    TestBed.configureTestingModule(***REMOVED***
      declarations: [ ResourcesComponent ]
    ***REMOVED***)
    .compileComponents();
  ***REMOVED***));

  beforeEach(() => ***REMOVED***
    fixture = TestBed.createComponent(ResourcesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  ***REMOVED***);

  it('should create', () => ***REMOVED***
    expect(component).toBeTruthy();
  ***REMOVED***);
***REMOVED***);
