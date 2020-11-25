import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {ValidationApplicationComponent} from './validation-application.component';

// tslint:disable

describe('ValidationApplicationComponent', () => {
  let component: ValidationApplicationComponent;
  let fixture: ComponentFixture<ValidationApplicationComponent>;

  beforeEach(waitForAsync(() => {
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
