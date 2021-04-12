import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
	enableProdMode();
}
/* eslint-disable */

platformBrowserDynamic().bootstrapModule(AppModule).then(() => {

  if (navigator.serviceWorker && environment.production) {
    navigator.serviceWorker.getRegistrations().then(
      function(registrations) {

        for (const registration of registrations) {

          registration.unregister()

        }
      })
  }
});

/* eslint-enable */
