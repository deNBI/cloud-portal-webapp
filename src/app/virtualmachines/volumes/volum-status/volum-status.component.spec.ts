import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VolumStatusComponent } from './volum-status.component';

describe('VolumStatusComponent', () => {
  let component: VolumStatusComponent;
  let fixture: ComponentFixture<VolumStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VolumStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VolumStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
