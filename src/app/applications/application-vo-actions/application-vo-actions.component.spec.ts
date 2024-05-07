import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationVoActionsComponent } from './application-vo-actions.component';

describe('ApplicationVoActionsComponent', () => {
  let component: ApplicationVoActionsComponent;
  let fixture: ComponentFixture<ApplicationVoActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApplicationVoActionsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ApplicationVoActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
