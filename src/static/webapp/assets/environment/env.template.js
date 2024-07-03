;(function (window) {
	window.env = window.env || {}

	// Environment variables
	window['env']['API_HOST'] = '${API_HOST}'
	window['env']['VO'] = '${VO}'
	window['env']['PRODUCTION'] = '${PRODUCTION}'
	window['env']['VO_NAME'] = '${VO_NAME}'
	window['env']['MATOMO_SITE_ID'] = '${MATOMO_SITE_ID}'
	window['env']['MATOMO_TRACKING_URL'] = '${MATOMO_TRACKING_URL}'
})(this)
