import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectUserListComponent } from './project-user-list.component';

describe('ProjectUserListComponent', () => {
  let component: ProjectUserListComponent;
  let fixture: ComponentFixture<ProjectUserListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectUserListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectUserListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
