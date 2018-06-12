// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.

export const environment = {
  production: false,
  vo: 3334,

  apiBaseUrl: 'https://portal-dev.denbi.de/api/v0/',
  voRegistrationLink: 'https://perun.elixir-czech.cz/registrar/?vo=denbi-dev',
  connectorBaseUrl : 'https://portal-dev.denbi.de/connector/',
     login: 'https://porta-dev.denbi.de/portal/'
};
