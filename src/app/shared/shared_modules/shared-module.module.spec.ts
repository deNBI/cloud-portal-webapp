import { SharedModuleModule } from './shared-module.module';

describe('SharedModuleModule', () => {
  let sharedModuleModule: SharedModuleModule;

  beforeEach(() => {
    sharedModuleModule = new SharedModuleModule();
  });

  it('should create an instance', () => {
    expect(sharedModuleModule).toBeTruthy();
  });
});
