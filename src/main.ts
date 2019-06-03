import ***REMOVED***enableProdMode***REMOVED*** from '@angular/core';
import ***REMOVED***platformBrowserDynamic***REMOVED*** from '@angular/platform-browser-dynamic';

import ***REMOVED***AppModule***REMOVED*** from './app/app.module';
import ***REMOVED***environment***REMOVED*** from './environments/environment';

if (environment.production) ***REMOVED***
  enableProdMode();
***REMOVED***

// Constructing tracking code
const matomoScript = document.createElement('script');
matomoScript.type = 'text/javascript';
matomoScript.innerHTML =
  'var _paq = _paq || [];\n' +
  '  _paq.push([\'enableLinkTracking\']);\n' +
  '  (function() ***REMOVED***\n' +
  `    let u="$***REMOVED***environment.matomoServer***REMOVED***";\n` +
  '    _paq.push([\'setTrackerUrl\', u+\'matomo.php\']);\n' +
  '    _paq.push([\'setSiteId\', \'2\']);\n' +
  '    let d=document, g=d.createElement(\'script\'), s=d.getElementsByTagName(\'script\')[0];\n' +
  '    g.type=\'text/javascript\'; g.async=true; g.defer=true; g.src=u+\'matomo.js\'; s.parentNode.insertBefore(g,s);\n' +
  '  ***REMOVED***)();';

document.getElementsByTagName('head')[0].appendChild(matomoScript);
platformBrowserDynamic().bootstrapModule(AppModule).then(() => ***REMOVED***

  if (navigator.serviceWorker && environment.production) ***REMOVED***
    navigator.serviceWorker.getRegistrations().then(
      function (registrations) ***REMOVED***

        for (const registration of registrations) ***REMOVED***

          registration.unregister()

        ***REMOVED***
      ***REMOVED***)
  ***REMOVED***
***REMOVED***);
