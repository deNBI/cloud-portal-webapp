const API_HOST: string = window['env']['API_HOST'] || 'portal-dev.denbi.de';

export const environment: any = {
	WIKI_PRE: `https:/${API_HOST}/wiki/`,
	vo: window['env']['VO'] || 3334,
	production: window['env']['PRODUCTION'] || false,
	freemium_project_id: 10392,
	domain: API_HOST,
	invitation_group_pre: 'https://perun.elixir-czech.cz/fed/registrar/?vo=elixir&targetnew=https%3A%2F%2Fperun.elixir-czech.cz'
		+ '%2Ffed%2Fregistrar%2F%3Fvo%3Ddenbi-dev%26group%3D',
	invitation_group_post: '&targetexisting=https%3A%2F%2Fperun.elixir-czech.cz%2Ffed%2Fregistrar%2F%3Fvo%3Ddenbi-dev%26group%3D',
	apiBaseUrl: `https://${API_HOST}/portal/api/v0/`,
	apiBase: `https://${API_HOST}/portal/`,
	voRegistrationLink: 'https://perun.elixir-czech.cz/registrar/?vo=denbi-dev',
	login: `https://${API_HOST}/portal/api/v0/loggedUser/`,
	webapp: `https://${API_HOST}/portal/webapp/`,
	matomoServer: '//cloud.denbi.de/matomo/',
};
