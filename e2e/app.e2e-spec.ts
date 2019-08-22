import ***REMOVED*** CoreUIPage ***REMOVED*** from './app.po';

describe('core-ui App', function() ***REMOVED***
  let page: CoreUIPage;

  beforeEach(() => ***REMOVED***
    page = new CoreUIPage();
  ***REMOVED***);

  it('should display message saying app works', () => ***REMOVED***
    page.navigateTo();
    expect<any>(page.getParagraphText()).toEqual('app works!');
  ***REMOVED***);
***REMOVED***);
