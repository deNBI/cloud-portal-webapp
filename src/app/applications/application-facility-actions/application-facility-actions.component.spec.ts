import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationFacilityActionsComponent } from './application-facility-actions.component';

describe('ApplicationFacilityActionsComponent', () => {
  let component: ApplicationFacilityActionsComponent;
  let fixture: ComponentFixture<ApplicationFacilityActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApplicationFacilityActionsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ApplicationFacilityActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
