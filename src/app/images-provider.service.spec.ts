import { TestBed } from '@angular/core/testing';

import { ImagesProviderService } from './images-provider.service';

describe('ImagesProviderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ImagesProviderService = TestBed.get(ImagesProviderService);
    expect(service).toBeTruthy();
  });
});
