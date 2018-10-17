import ***REMOVED*** async, ComponentFixture, TestBed ***REMOVED*** from '@angular/core/testing';

import ***REMOVED*** PublicKeyComponent ***REMOVED*** from './public-key.component';

describe('PublicKeyComponent', () => ***REMOVED***
  let component: PublicKeyComponent;
  let fixture: ComponentFixture<PublicKeyComponent>;

  beforeEach(async(() => ***REMOVED***
    TestBed.configureTestingModule(***REMOVED***
      declarations: [ PublicKeyComponent ]
    ***REMOVED***)
    .compileComponents();
  ***REMOVED***));

  beforeEach(() => ***REMOVED***
    fixture = TestBed.createComponent(PublicKeyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  ***REMOVED***);

  it('should create', () => ***REMOVED***
    expect(component).toBeTruthy();
  ***REMOVED***);
***REMOVED***);
