const API_HOST: string = window['env']['API_HOST'] || 'cloud.denbi.de';
const VO_NAME: string = window['env']['VO_NAME'] || 'denbi';
const NEW_SIMPLE_VM: string = window['env']['NEW_SIMPLE_VM'] || 'https://simplevm.denbi.de';

export const environment: any = {
	WIKI_PRE: `https://${API_HOST}/wiki/`,
	SIMPLEVM_WIKI_PRE: `${NEW_SIMPLE_VM}/wiki/`,
	NEW_SVM_PORTAL_LINK: `${NEW_SIMPLE_VM}/portal/webapp/`,
	vo: window['env']['VO'] || 3335,
	voName: VO_NAME,
	production: window['env']['PRODUCTION'] === 'true' || false,
	freemium_project_id: 10392,
	domain: API_HOST,
	invitation_group_pre: `https://signup.aai.lifescience-ri.eu/fed/registrar/?vo=elixir&targetnew=https://signup.aai.lifescience-ri.eu/fed/registrar/?vo=${VO_NAME}&group=`,
	apiBaseUrl: `https://${API_HOST}/portal/api/v0/`,
	apiBase: `https://${API_HOST}/portal/`,
	wagtailBase: `https://${API_HOST}/`,
	voRegistrationLink: `https://signup.aai.lifescience-ri.eu/fed/registrar/?vo=elixir&targetnew=https://signup.aai.lifescience-ri.eu/fed/registrar/?vo=${VO_NAME}`,
	login: `https://${API_HOST}/portal/api/v0/loggedUser/`,
	webapp: `https://${API_HOST}/portal/webapp/`,
	matomoServer: '//cloud.denbi.de/matomo/',
};
