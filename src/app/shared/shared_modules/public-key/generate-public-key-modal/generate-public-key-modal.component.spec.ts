import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneratePublicKeyModalComponent } from './generate-public-key-modal.component';

describe('GeneratePublicKeyModalComponent', () => {
  let component: GeneratePublicKeyModalComponent;
  let fixture: ComponentFixture<GeneratePublicKeyModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeneratePublicKeyModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeneratePublicKeyModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
