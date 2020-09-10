import {environment} from "../../environments/environment";

var idSite = 2;
var matomoTrackingApiUrl = environment.matomoServer;

var _paq = window._paq = window._paq || [];
_paq.push(['setTrackerUrl', matomoTrackingApiUrl]);
_paq.push(['setSiteId', idSite]);
_paq.push(['trackPageView']);
_paq.push(['enableLinkTracking']);

