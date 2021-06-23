import { environment } from '../environments/environment';

export const WIKI_SNAPSHOTS: string = `${environment.WIKI_PRE}simple_vm/snapshots.html`;
export const WIKI: string = `${environment.WIKI_PRE}`;
export const WIKI_GENERATE_KEYS: string = `${environment.WIKI_PRE}quickstart.html#generate-ssh-keys`;
export const WIKI_NEWS_MANAGEMENT: string = `${environment.WIKI_PRE}cloud_admin.html#news-management`;
export const WIKI_SIMPLEVM_CUSTOMISATION: string = `${environment.WIKI_PRE}simple_vm/customization.html`;
export const WIKI_EXTEND_VOLUME: string = `${environment.WIKI_PRE}simple_vm/volumes.html#extend-a-volume`;
export const WIKI_VOLUME_OVERVIEW: string = `${environment.WIKI_PRE}simple_vm/volumes.html`;
export const WIKI_RESENV_LINK: string = `${environment.WIKI_PRE}simple_vm/customization.html#research-environments`;
export const WIKI_RSTUDIO_LINK: string = `${environment.WIKI_PRE}simple_vm/customization.html#rstudio`;
export const WIKI_GUACAMOLE_LINK: string = `${environment.WIKI_PRE}simple_vm/customization.html#apache-guacamole`;
export const WIKI_NEW_INSTANCE_LINK: string = `${environment.WIKI_PRE}simple_vm/new_instance.html`;
export const WIKI_INSTANCE_OVERVIEW_LINK: string = `${environment.WIKI_PRE}simple_vm/instance_overview.html`;
export const WIKI_INSTANCE_DETAIL_LINK: string = `${environment.WIKI_PRE}simple_vm/instance_detail.html`;
export const WIKI_LINK_ACCOUNTS: string = `${environment.WIKI_PRE}portal/user_information.html#link-accounts-to-elixir`;
export const WIKI_PUBLICATIONS: string = `${environment.WIKI_PRE}citation_and_publication.html#publications`;
export const WIKI_MEMBER_MANAGEMENT: string = `${environment.WIKI_PRE}portal/project_overview.html#member-management`;
export const WIKI_FAQ: string = `${environment.WIKI_PRE}FAQ.html`;
export const WIKI_MOTD: string = `${environment.WIKI_PRE}cloud_admin/news_management.html#message-of-the-day`;
export const SCALE_SCRIPT_LINK: string = 'https://raw.githubusercontent.com/deNBI/user_scripts/master/bibigrid/scaling.py';
export const WIKI_MOUNT_VOLUME: string = `${environment.WIKI_PRE}simple_vm/volumes.html#mount-a-volume`;
export const WIKI_GROUP_INVITATIONS: string = `${environment.WIKI_PRE}simple_vm/project_overview.html#inviting-members`;
export const SCALING_UP_WIKI: string = `${environment.WIKI_PRE}simple_vm/cluster_overview.html#scale-up`;
export const CREDITS_WIKI: string = `${environment.WIKI_PRE}portal/credits.html`;
export const SURVEY_LINK: string = 'https://www.surveymonkey.de/r/HQW9V7C';
export const CLOUD_MAIL: string = 'cloud@denbi.de';
export const CLOUD_PORTAL_SUPPORT_MAIL = 'cloud-portal-support@denbi.de';

export const WIKI_LNKS: string[] = [
	WIKI_SNAPSHOTS,
	WIKI,
	WIKI_GENERATE_KEYS,
	WIKI_NEWS_MANAGEMENT,
	WIKI_SIMPLEVM_CUSTOMISATION,
	WIKI_EXTEND_VOLUME,
	WIKI_VOLUME_OVERVIEW,
	WIKI_RESENV_LINK,
	WIKI_RSTUDIO_LINK,
	WIKI_GUACAMOLE_LINK,
	WIKI_NEW_INSTANCE_LINK,
	WIKI_INSTANCE_OVERVIEW_LINK,
	WIKI_INSTANCE_DETAIL_LINK,
	WIKI_LINK_ACCOUNTS,
	SCALE_SCRIPT_LINK,
	WIKI_PUBLICATIONS,
	WIKI_MEMBER_MANAGEMENT,
	WIKI_FAQ,
	WIKI_MOTD,
];
