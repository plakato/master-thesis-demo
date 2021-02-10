import { TestBed } from '@angular/core/testing';

import { InputStoreService } from './input-store.service';

describe('InputStoreService', () => {
  let service: InputStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InputStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
