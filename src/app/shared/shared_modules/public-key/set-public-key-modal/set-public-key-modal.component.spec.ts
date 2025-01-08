import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetPublicKeyModalComponent } from './set-public-key-modal.component';

describe('SetPublicKeyModalComponent', () => {
  let component: SetPublicKeyModalComponent;
  let fixture: ComponentFixture<SetPublicKeyModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SetPublicKeyModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SetPublicKeyModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
