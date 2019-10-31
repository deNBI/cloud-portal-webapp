// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.

export const environment: any = {
  production: false,
  vo: 3334,
  freemium_project_id: 10392,
  domain: 'localhost',

  invitation_group_pre: 'https://perun.elixir-czech.cz/fed/registrar/?vo=elixir&targetnew=https%3A%2F%2Fperun.elixir-czech.cz' +
    '%2Ffed%2Fregistrar%2F%3Fvo%3Ddenbi-dev%26group%3D',
  invitation_group_post: '&targetexisting=https%3A%2F%2Fperun.elixir-czech.cz%2Ffed%2Fregistrar%2F%3Fvo%3Ddenbi-dev%26group%3D',
  wiki_group_invitations: 'https://cloud.denbi.de/wiki/portal/project_overview/#inviting-members',
  apiBaseUrl: 'http://localhost:8000/api/v0/',
  voRegistrationLink: 'https://perun.elixir-czech.cz/registrar/?vo=denbi-dev',
  login: 'http://localhost:8000',
  matomoServer: ''

};
