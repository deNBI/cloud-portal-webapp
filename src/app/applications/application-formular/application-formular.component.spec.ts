import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationFormularComponent } from './application-formular.component';

describe('ApplicationFormularComponent', () => {
  let component: ApplicationFormularComponent;
  let fixture: ComponentFixture<ApplicationFormularComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApplicationFormularComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationFormularComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
