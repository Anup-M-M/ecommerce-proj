import { TestBed } from '@angular/core/testing';

import { OrederHistoryService } from './oreder-history.service';

describe('OrederHistoryService', () => {
  let service: OrederHistoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrederHistoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
