const API_HOST: string = window['env']['API_HOST'] || 'cloud.denbi.de';
const VO_NAME: string = window['env']['VO_NAME'] || 'denbi';

export const environment: any = {
	WIKI_PRE: `https://${API_HOST}/wiki/`,
	vo: window['env']['VO'] || 3335,
	production: window['env']['PRODUCTION'] === 'true' || false,
	freemium_project_id: 10392,
	domain: API_HOST,
	invitation_group_pre: 'https://perun.elixir-czech.cz/fed/registrar/?vo=elixir&targetnew=https%3A%2F%2Fperun.elixir-czech.cz'
		+ `%2Ffed%2Fregistrar%2F%3Fvo%3D${VO_NAME}%26group%3D`,
	invitation_group_post: `&targetexisting=https%3A%2F%2Fperun.elixir-czech.cz%2Ffed%2Fregistrar%2F%3Fvo%3D${VO_NAME}%26group%3D`,
	apiBaseUrl: `https://${API_HOST}/portal/api/v0/`,
	apiBase: `https://${API_HOST}/portal/`,
	wagtailBase: `https://${API_HOST}/`,
	voRegistrationLink: `https://perun.elixir-czech.cz/registrar/?vo=${VO_NAME}`,
	login: `https://${API_HOST}/portal/api/v0/loggedUser/`,
	webapp: `https://${API_HOST}/portal/webapp/`,
	matomoServer: '//cloud.denbi.de/matomo/',
};
