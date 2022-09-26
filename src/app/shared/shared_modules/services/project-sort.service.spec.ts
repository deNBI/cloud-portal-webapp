import { TestBed } from '@angular/core/testing';

import { ProjectSortService } from './project-sort.service';

describe('ProjectSortService', () => {
  let service: ProjectSortService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectSortService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
