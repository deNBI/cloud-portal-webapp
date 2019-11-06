import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ValidationApplicationComponent} from './validation-application.component';

// tslint:disable

describe('ValidationApplicationComponent', () => {
  let component: ValidationApplicationComponent;
  let fixture: ComponentFixture<ValidationApplicationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
                                     declarations: [ValidationApplicationComponent]
                                   })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidationApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
