// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.

export const environment: any = {
	WIKI_PRE: 'https://portal-dev.denbi.de/wiki/',
	production: false,
	vo: 3334,
	freemium_project_id: 10392,
	domain: 'localhost',
	invitation_group_pre:
		'https://signup.aai.lifescience-ri.eu/fed/registrar/?vo=elixir&targetnew=https://signup.aai.lifescience-ri.eu/fed/registrar/?vo=denbi-dev&group=',
	apiBaseUrl: 'http://localhost:8000/api/v0/',
	apiBase: 'http://localhost:8000/',
	wagtailBase: 'http://localhost:8005/',
	voRegistrationLink:
		'https://signup.aai.lifescience-ri.eu/fed/registrar/?vo=elixir&targetnew=https://signup.aai.lifescience-ri.eu/fed/registrar/?vo=denbi-dev',
	login: 'http://localhost:8000/api/v0/loggedUser/',
	webapp: 'http://localhost:8001/',
	matomoServer: '',
};
