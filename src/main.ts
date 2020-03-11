import {enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

import {AppModule} from './app/app.module';
import {environment} from './environments/environment';

if (environment.production) {
  enableProdMode();
}
// tslint:disable

// Constructing tracking code
const matomoScript = document.createElement('script');
matomoScript.type = 'text/javascript';
matomoScript.innerHTML =
  'var _paq = _paq || [];\n' +
  '  _paq.push([\'enableLinkTracking\']);\n' +
  '  (function() {\n' +
  `    let u="${environment.matomoServer}";\n` +
  '    _paq.push([\'setTrackerUrl\', u+\'matomo.php\']);\n' +
  '    _paq.push([\'setSiteId\', \'2\']);\n' +
  '    let d=document, g=d.createElement(\'script\'), s=d.getElementsByTagName(\'script\')[0];\n' +
  '    g.type=\'text/javascript\'; g.async=true; g.defer=true; g.src=u+\'matomo.js\'; s.parentNode.insertBefore(g,s);\n' +
  '  })();';

document.getElementsByTagName('head')[0].appendChild(matomoScript);
platformBrowserDynamic().bootstrapModule(AppModule).then(() => {

  if (navigator.serviceWorker && environment.production) {
    navigator.serviceWorker.getRegistrations().then(
      function (registrations) {

        for (const registration of registrations) {

          registration.unregister()

        }
      })
  }
});
