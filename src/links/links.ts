import { environment } from '../environments/environment';

export const WIKI_SNAPSHOTS: string = `${environment.WIKI_PRE}simple_vm/snapshots/`;
export const WIKI: string = `${environment.WIKI_PRE}`;
export const WIKI_GENERATE_KEYS: string = `${environment.WIKI_PRE}quickstart/#generate-ssh-keys`;
export const WIKI_NEWS_MANAGEMENT: string = `${environment.WIKI_PRE}cloud_admin/#news-management`;
export const WIKI_SIMPLEVM_CUSTOMISATION: string = `${environment.WIKI_PRE}simple_vm/customization/`;
export const WIKI_EXTEND_VOLUME: string = `${environment.WIKI_PRE}simple_vm/volumes/#extend-a-volume`;
export const WIKI_VOLUME_OVERVIEW: string = `${environment.WIKI_PRE}simple_vm/volumes/`;
export const WIKI_RESENV_LINK: string = `${environment.WIKI_PRE}simple_vm/customization/#research-environments`;
export const WIKI_RSTUDIO_LINK: string = `${environment.WIKI_PRE}simple_vm/customization/#rstudio`;
export const WIKI_JUPYTERLAB_LINK: string = `${environment.WIKI_PRE}simple_vm/customization/#jupyterlab`;
export const WIKI_GUACAMOLE_LINK: string = `${environment.WIKI_PRE}simple_vm/customization/#apache-guacamole`;
export const WIKI_NEW_INSTANCE_LINK: string = `${environment.WIKI_PRE}simple_vm/new_instance/`;
export const WIKI_INSTANCE_OVERVIEW_LINK: string = `${environment.WIKI_PRE}simple_vm/instance_overview/`;
export const WIKI_INSTANCE_DETAIL_LINK: string = `${environment.WIKI_PRE}simple_vm/instance_detail/`;
export const WIKI_LINK_ACCOUNTS: string = `${environment.WIKI_PRE}portal/user_information/#link-accounts-to-elixir`;
export const LIFESCIENCE_LINKING_ACCOUNTS: string = 'https://profile.aai.lifescience-ri.eu/profile/identities';
export const WIKI_PUBLICATIONS: string = `${environment.WIKI_PRE}citation_and_publication/#publications`;
export const WIKI_MEMBER_MANAGEMENT: string = `${environment.WIKI_PRE}portal/project_overview/#member-management`;
export const WIKI_FAQ: string = `${environment.WIKI_PRE}FAQ/`;
export const WIKI_MOTD: string = `${environment.WIKI_PRE}cloud_admin/news_management/#message-of-the-day`;
export const WIKI_WORKSHOPS: string = `${environment.WIKI_PRE}simple_vm/workshop/`;
export const WIKI_CREATE_SNAPSHOT_LINK: string = `${environment.WIKI_PRE}simple_vm/snapshots/#create-snapshot`;
export const SCALE_SCRIPT_LINK: string =	'https://raw.githubusercontent.com/deNBI/user_scripts/master/bibigrid/scaling.py';
export const WIKI_MOUNT_VOLUME: string = `${environment.WIKI_PRE}simple_vm/volumes/#mount-a-volume`;
export const WIKI_VOLUMES_LINK: string = `${environment.WIKI_PRE}simple_vm/volumes/`;
export const WIKI_MOSH_LINK: string = `${environment.WIKI_PRE}Tutorials/Mosh/`;
export const WIKI_EPHEMERAL_LINK: string = `${environment.WIKI_PRE}simple_vm/new_instance/#information-for-ephemeral-flavors`;
export const WIKI_GROUP_INVITATIONS: string = `${environment.WIKI_PRE}simple_vm/project_overview/#inviting-members`;
export const SCALING_UP_WIKI: string = `${environment.WIKI_PRE}simple_vm/Cluster/cluster_overview/#3-scale-up`;
export const CREDITS_WIKI: string = `${environment.WIKI_PRE}portal/credits/`;
export const WIKI_PERSONAL_DATA: string = `${environment.WIKI_PRE}portal/personal_data`;
export const SURVEY_LINK: string = 'https://www.surveymonkey.de/r/HQW9V7C';
export const CLOUD_PORTAL_SUPPORT_MAIL = 'cloud-helpdesk@denbi.de';
export const POLICY_LINK: string = 'https://cloud.denbi.de/about/policies/';
export const SIMPLE_VM_LINK: string = 'https://cloud.denbi.de/about/project-types/simplevm/';
export const OPENSTACK_LINK: string = 'https://cloud.denbi.de/about/project-types/openstack/';
export const PROJECT_TYPES_LINK: string = 'https://cloud.denbi.de/about/project-types/';
export const PUBLICATIONS_LINK: string = 'https://cloud.denbi.de/about/publications/';
export const FACILITY_NEWS_LINK: string = 'https://cloud.denbi.de/news/facility-news/';
export const STATUS_LINK: string = 'https://status.cloud.denbi.de/status';
export const SUPPORT_LINK: string = 'https://cloud.denbi.de/support/';
export const ZAMMAD_HELPDESK_LINK = 'https://helpdesk.cloud.denbi.de';
export const GDPR_LINK = 'https://gdpr.eu/article-9-processing-special-categories-of-personal-data-prohibited/';
export const WIKI_PERSISTENT_TERMINAL_LINK = `${environment.WIKI_PRE}Tutorials/Persistent_SSH_Sessions/`;

export const WIKI_LINKS: string[] = [
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
	WIKI_CREATE_SNAPSHOT_LINK,
	WIKI_VOLUMES_LINK,
	WIKI_EPHEMERAL_LINK,
	WIKI_MOSH_LINK,
	WIKI_PERSONAL_DATA,
];

export const LANDING_PAGE_LINKS: string[] = [
	POLICY_LINK,
	SIMPLE_VM_LINK,
	OPENSTACK_LINK,
	PROJECT_TYPES_LINK,
	PUBLICATIONS_LINK,
	FACILITY_NEWS_LINK,
	STATUS_LINK,
	SUPPORT_LINK,
];
